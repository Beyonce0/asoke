"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin";

/*
 * Fulfilment, and fulfilment only.
 *
 * This goes through the `set_order_status` function rather than an update
 * statement, because an update statement could name any column. Payment status
 * and `paid_at` are Paystack's word — settled by `mark_order_paid()` after a
 * verified charge — and nothing reachable from a browser may write them, no
 * matter who is signed in. The function writes one column and checks the
 * caller is an admin before it does.
 */

const schema = z.object({
  id: z.uuid(),
  status: z.enum([
    "pending",
    "processing",
    "cutting",
    "fitting",
    "finishing",
    "ready",
    "shipped",
    "delivered",
    "cancelled",
  ]),
  /** Shown to the customer on their own order page. */
  note: z.string().trim().max(400).optional(),
});

export type Result = { ok: true } | { ok: false; error: string };

export async function setOrderStatus(
  input: z.input<typeof schema>,
): Promise<Result> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Unknown status." };

  let supabase;
  try {
    ({ supabase } = await requireAdmin());
  } catch {
    return { ok: false, error: "You are not signed in as an admin." };
  }

  const { error } = await supabase.rpc("set_order_status", {
    p_order_id: parsed.data.id,
    p_status: parsed.data.status,
    p_note: parsed.data.note || null,
  });

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${parsed.data.id}`);
  revalidatePath("/admin");
  // The customer is watching the same fact from the other side.
  revalidatePath("/account/orders");

  return { ok: true };
}
