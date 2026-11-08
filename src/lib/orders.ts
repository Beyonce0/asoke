import "server-only";

import { verifyTransaction } from "@/lib/paystack";
import { createAdminClient } from "@/lib/supabase/admin";

export type FulfillResult =
  | { ok: true; reference: string; alreadyPaid: boolean }
  | {
      ok: false;
      reason: "unknown-order" | "not-successful" | "amount-mismatch" | "error";
    };

/**
 * Settles an order against Paystack's own record of the transaction.
 *
 * Both the browser callback and the webhook call this, often within the same
 * second. `mark_order_paid` locks the order row and no-ops on a replay, so
 * running it twice cannot double-decrement stock.
 */
export async function fulfillOrder(reference: string): Promise<FulfillResult> {
  const admin = createAdminClient();

  try {
    const transaction = await verifyTransaction(reference);

    const { data: order, error } = await admin
      .from("orders")
      .select("id, total, payment_status")
      .eq("reference", reference)
      .maybeSingle();

    if (error || !order) return { ok: false, reason: "unknown-order" };

    if (order.payment_status === "paid") {
      return { ok: true, reference, alreadyPaid: true };
    }

    if (transaction.status !== "success") {
      await admin.rpc("mark_order_failed", { p_reference: reference });
      return { ok: false, reason: "not-successful" };
    }

    // Paystack is the authority on what was actually collected. If it does not
    // match what we asked for, something tampered with the amount — refuse to
    // fulfil and leave the order for a human.
    if (transaction.amount !== order.total) {
      console.error(
        `[orders] Amount mismatch on ${reference}: charged ${transaction.amount}, expected ${order.total}`,
      );
      return { ok: false, reason: "amount-mismatch" };
    }

    const { error: rpcError } = await admin.rpc("mark_order_paid", {
      p_reference: reference,
      p_paid_at: transaction.paid_at ?? new Date().toISOString(),
    });

    if (rpcError) {
      console.error("[orders] mark_order_paid failed", rpcError);
      return { ok: false, reason: "error" };
    }

    return { ok: true, reference, alreadyPaid: false };
  } catch (caught) {
    console.error("[orders] fulfilment failed", caught);
    return { ok: false, reason: "error" };
  }
}
