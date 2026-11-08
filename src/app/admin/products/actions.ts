"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin";
import { slugify } from "@/lib/utils";

/*
 * Writing a product.
 *
 * Three rules this file exists to keep:
 *
 * MONEY IS KOBO. The form takes naira because that is what a person types.
 * This is the only place the two units meet, and the conversion rounds — a
 * float is never allowed to reach the database.
 *
 * A PRODUCT IS THREE TABLES. Row, images, variants. They are written in one
 * action so a half-made product cannot exist: a piece with a price and no way
 * to buy it, or photographs belonging to nothing.
 *
 * THE ADMIN'S OWN SESSION DOES THE WRITING. Never the service role. If the
 * caller is not an admin, RLS refuses every statement below regardless of what
 * this code believes.
 */

const money = z
  .string()
  .trim()
  .min(1, "Enter a price.")
  .transform((value) => value.replace(/[^\d.]/g, ""))
  .refine((value) => value !== "" && Number.isFinite(Number(value)), {
    message: "Price must be a number.",
  })
  .transform((value) => Math.round(Number(value) * 100))
  .refine((kobo) => kobo >= 0, { message: "Price cannot be negative." });

const variantSchema = z.object({
  id: z.uuid().optional(),
  color: z.string().trim().max(80).optional(),
  size: z.string().trim().max(80).optional(),
  /** Blank means "use the product price". */
  priceOverride: z.string().trim().optional(),
  stock: z.coerce.number().int().min(0).max(100_000),
  isActive: z.boolean(),
});

const imageSchema = z.object({
  url: z.string().trim().min(1),
  alt: z.string().trim().max(300).optional(),
  view: z.enum(["front", "back", "detail"]),
});

const productSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().trim().min(2, "Give the piece a name."),
  slug: z.string().trim().optional(),
  description: z.string().trim().max(2000).optional(),
  story: z.string().trim().max(4000).optional(),
  collectionId: z.uuid().nullable(),
  price: money,
  productType: z.enum(["ready_to_wear", "fabric", "bespoke", "custom"]),
  fabricType: z.string().trim().max(120).optional(),
  turnVideo: z.string().trim().optional(),
  isPublished: z.boolean(),
  isFeatured: z.boolean(),
  images: z.array(imageSchema).max(12),
  variants: z
    .array(variantSchema)
    .min(1, "A piece needs at least one variant, even if it is one size."),
});

export type ProductInput = z.input<typeof productSchema>;
export type SaveResult =
  { ok: true; id: string } | { ok: false; error: string };

export async function saveProduct(input: ProductInput): Promise<SaveResult> {
  const parsed = productSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid." };
  }

  const product = parsed.data;
  const slug = product.slug?.trim() || slugify(product.name);

  let supabase;
  try {
    ({ supabase } = await requireAdmin());
  } catch {
    return { ok: false, error: "You are not signed in as an admin." };
  }

  const row = {
    name: product.name,
    slug,
    description: product.description || null,
    story: product.story || null,
    collection_id: product.collectionId,
    base_price: product.price,
    product_type: product.productType,
    fabric_type: product.fabricType || null,
    turn_video: product.turnVideo || null,
    is_published: product.isPublished,
    is_featured: product.isFeatured,
  };

  const saved = product.id
    ? await supabase
        .from("products")
        .update(row)
        .eq("id", product.id)
        .select("id")
        .maybeSingle()
    : await supabase.from("products").insert(row).select("id").maybeSingle();

  if (saved.error || !saved.data) {
    // 23505 is a unique violation, and `slug` is the only unique column here.
    const message =
      saved.error?.code === "23505"
        ? `The slug "${slug}" is already taken.`
        : (saved.error?.message ?? "Could not save the piece.");

    return { ok: false, error: message };
  }

  const id = saved.data.id;

  /*
   * Images are replaced wholesale. Nothing references them, they carry no
   * history, and reconciling twelve rows by hand costs more than rewriting
   * them. The files themselves stay in storage — deleting a row is not
   * deleting a photograph.
   */
  await supabase.from("product_images").delete().eq("product_id", id);

  if (product.images.length > 0) {
    const images = await supabase.from("product_images").insert(
      product.images.map((image, index) => ({
        product_id: id,
        url: image.url,
        alt: image.alt || null,
        view: image.view,
        sort_order: index,
      })),
    );

    if (images.error) return { ok: false, error: images.error.message };
  }

  /*
   * Variants are reconciled rather than replaced, because a cart line and an
   * order item point at a variant id. Removing one that has been sold is
   * survivable — `order_items` keeps its own snapshot of the name and price,
   * and the foreign key sets null — but the link is gone for good, so it only
   * happens when the atelier actually removes the variant.
   */
  const keep = product.variants
    .map((variant) => variant.id)
    .filter((value): value is string => Boolean(value));

  const removal = supabase
    .from("product_variants")
    .delete()
    .eq("product_id", id);
  await (keep.length > 0
    ? removal.not("id", "in", `(${keep.join(",")})`)
    : removal);

  for (const [index, variant] of product.variants.entries()) {
    const override = variant.priceOverride?.trim()
      ? Math.round(Number(variant.priceOverride.replace(/[^\d.]/g, "")) * 100)
      : null;

    const values = {
      // Stable and human-readable, and unique because the slug is.
      sku: `${slug}-${index + 1}`.toUpperCase(),
      color: variant.color || null,
      size: variant.size || null,
      price_override: override,
      stock: variant.stock,
      is_active: variant.isActive,
    };

    // `product_id` is insert-only — a variant never moves between products,
    // and the types say so.
    const written = variant.id
      ? await supabase
          .from("product_variants")
          .update(values)
          .eq("id", variant.id)
      : await supabase
          .from("product_variants")
          .insert({ ...values, product_id: id });

    if (written.error) return { ok: false, error: written.error.message };
  }

  // The storefront caches for five minutes; a publish should not wait for it.
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath(`/shop/${slug}`);
  revalidatePath("/admin/products");

  return { ok: true, id };
}

export async function deleteProduct(id: string): Promise<SaveResult> {
  let supabase;
  try {
    ({ supabase } = await requireAdmin());
  } catch {
    return { ok: false, error: "You are not signed in as an admin." };
  }

  // Images and variants go with it — both cascade. Past orders do not: they
  // hold their own snapshots and their foreign keys fall to null.
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/products");

  return { ok: true, id };
}
