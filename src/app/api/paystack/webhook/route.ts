import { NextResponse, type NextRequest } from "next/server";

import { fulfillOrder } from "@/lib/orders";
import { isValidWebhookSignature } from "@/lib/paystack";

// Node runtime: the signature check needs node:crypto.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Paystack's server-to-server notification. This — not the browser callback —
 * is the reliable path: it still fires when the customer closes the tab
 * mid-payment.
 */
export async function POST(request: NextRequest) {
  // Must read the raw text. Parsing and re-serialising changes the bytes and
  // the HMAC will no longer match.
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!signature || !isValidWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: { event?: string; data?: { reference?: string } };

  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Malformed payload" }, { status: 400 });
  }

  const reference = event.data?.reference;

  if (event.event === "charge.success" && reference) {
    const result = await fulfillOrder(reference);

    if (!result.ok && result.reason === "error") {
      // A 5xx makes Paystack retry with backoff; every other outcome is final.
      return NextResponse.json({ error: "Retry" }, { status: 500 });
    }
  }

  // Acknowledge everything else so Paystack stops resending it.
  return NextResponse.json({ received: true });
}
