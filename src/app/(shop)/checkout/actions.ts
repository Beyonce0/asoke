"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { fill } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { getDictionary } from "@/i18n/server";
import { env, isConfigured } from "@/lib/env";
import { generateReference, initializeTransaction } from "@/lib/paystack";
import { shippingFor } from "@/lib/shipping";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const lineSchema = z.object({
  variantId: z.uuid(),
  quantity: z.number().int().min(1).max(20),
});

/** Built per request, so the messages arrive in the shopper's language. */
function checkoutSchema(fields: Dictionary["checkout"]["errors"]["fields"]) {
  return z.object({
    email: z.email(fields.email),
    fullName: z.string().trim().min(2, fields.fullName),
    phone: z.string().trim().min(7, fields.phone),
    line1: z.string().trim().min(3, fields.street),
    line2: z.string().trim().optional(),
    city: z.string().trim().min(2, fields.city),
    state: z.string().trim().min(2, fields.state),
    lines: z.array(lineSchema).min(1, fields.empty),
  });
}

export type CheckoutState = { error?: string };

export async function startCheckout(
  _previous: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const rawLines = formData.get("lines");
  const errors = (await getDictionary()).checkout.errors;

  const parsed = checkoutSchema(errors.fields).safeParse({
    email: formData.get("email"),
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    line1: formData.get("line1"),
    line2: formData.get("line2") || undefined,
    city: formData.get("city"),
    state: formData.get("state"),
    lines: typeof rawLines === "string" ? JSON.parse(rawLines) : [],
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? errors.details };
  }

  const input = parsed.data;

  // Design mode: the storefront runs on sample data until Supabase and
  // Paystack are configured. Say so plainly rather than failing on a lookup.
  if (!isConfigured) {
    return { error: errors.notConnected };
  }

  // The browser's prices are a display convenience and nothing more. Everything
  // that decides what the customer is charged is read fresh from the database.
  const admin = createAdminClient();
  const { data: variants, error: variantError } = await admin
    .from("product_variants")
    .select(
      "id, price_override, stock, color, size, is_active, product_id, products(name, base_price, is_published)",
    )
    .in(
      "id",
      input.lines.map((line) => line.variantId),
    );

  if (variantError || !variants) {
    return { error: errors.price };
  }

  let subtotal = 0;
  const items: {
    product_id: string;
    variant_id: string;
    name_snapshot: string;
    variant_label: string | null;
    unit_price: number;
    quantity: number;
  }[] = [];

  for (const line of input.lines) {
    const variant = variants.find((v) => v.id === line.variantId);
    const product = variant?.products as unknown as
      { name: string; base_price: number; is_published: boolean } | undefined;

    if (!variant || !product || !variant.is_active || !product.is_published) {
      return { error: errors.unavailable };
    }

    if (variant.stock < line.quantity) {
      return { error: fill(errors.stock, { name: product.name }) };
    }

    const unitPrice = variant.price_override ?? product.base_price;
    subtotal += unitPrice * line.quantity;

    items.push({
      product_id: variant.product_id,
      variant_id: variant.id,
      name_snapshot: product.name,
      variant_label:
        [variant.color, variant.size].filter(Boolean).join(" · ") || null,
      unit_price: unitPrice,
      quantity: line.quantity,
    });
  }

  const shippingFee = shippingFor(input.state);
  const total = subtotal + shippingFee;
  const reference = generateReference();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({
      user_id: user?.id ?? null,
      reference,
      email: input.email,
      subtotal,
      shipping_fee: shippingFee,
      total,
      shipping_address: {
        full_name: input.fullName,
        phone: input.phone,
        line1: input.line1,
        line2: input.line2 ?? null,
        city: input.city,
        state: input.state,
        country: "Nigeria",
      },
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return { error: errors.open };
  }

  const { error: itemsError } = await admin
    .from("order_items")
    .insert(items.map((item) => ({ ...item, order_id: order.id })));

  if (itemsError) {
    return { error: errors.save };
  }

  let authorizationUrl: string;

  try {
    const transaction = await initializeTransaction({
      email: input.email,
      amount: total,
      reference,
      callbackUrl: `${env.NEXT_PUBLIC_SITE_URL}/checkout/confirm`,
      metadata: { order_id: order.id, customer_name: input.fullName },
    });

    authorizationUrl = transaction.authorization_url;
  } catch (error) {
    console.error("[checkout] Paystack initialize failed", error);
    return { error: errors.payment };
  }

  await admin
    .from("orders")
    .update({ paystack_reference: reference })
    .eq("id", order.id);

  // redirect() signals by throwing, so it must sit outside the try block above.
  redirect(authorizationUrl);
}
