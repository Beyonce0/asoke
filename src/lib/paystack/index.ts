import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import { serverEnv } from "@/lib/env.server";

const PAYSTACK_API = "https://api.paystack.co";

type PaystackResponse<T> = {
  status: boolean;
  message: string;
  data: T;
};

export type InitializedTransaction = {
  authorization_url: string;
  access_code: string;
  reference: string;
};

export type VerifiedTransaction = {
  id: number;
  status: "success" | "failed" | "abandoned" | "ongoing" | "pending";
  reference: string;
  /** Kobo. */
  amount: number;
  currency: string;
  paid_at: string | null;
  channel: string | null;
  customer: { email: string };
  metadata: Record<string, unknown> | null;
};

async function paystackFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<PaystackResponse<T>> {
  const response = await fetch(`${PAYSTACK_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${serverEnv().PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
    // Payment state must never be served from a cache.
    cache: "no-store",
  });

  const body = (await response.json()) as PaystackResponse<T>;

  if (!response.ok || !body.status) {
    throw new Error(
      `Paystack ${path} failed (${response.status}): ${body.message ?? "unknown error"}`,
    );
  }

  return body;
}

/**
 * Opens a transaction and returns the hosted checkout URL to redirect to.
 * `amount` is in kobo — Paystack rejects fractional naira.
 */
export async function initializeTransaction(params: {
  email: string;
  amount: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}) {
  const { data } = await paystackFetch<InitializedTransaction>(
    "/transaction/initialize",
    {
      method: "POST",
      body: JSON.stringify({
        email: params.email,
        amount: params.amount,
        currency: "NGN",
        reference: params.reference,
        callback_url: params.callbackUrl,
        metadata: params.metadata ?? {},
      }),
    },
  );

  return data;
}

/**
 * The only trustworthy source of "was this paid". Never mark an order paid
 * from a client-side callback alone — always confirm here or via the webhook.
 */
export async function verifyTransaction(reference: string) {
  const { data } = await paystackFetch<VerifiedTransaction>(
    `/transaction/verify/${encodeURIComponent(reference)}`,
  );

  return data;
}

/**
 * Paystack signs webhooks as HMAC-SHA512 of the raw request body, keyed with
 * the secret key. The body must be the untouched string — re-serialising
 * parsed JSON changes the bytes and breaks the digest.
 */
export function isValidWebhookSignature(rawBody: string, signature: string) {
  const expected = createHmac("sha512", serverEnv().PAYSTACK_SECRET_KEY)
    .update(rawBody)
    .digest("hex");

  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature, "utf8");

  return a.length === b.length && timingSafeEqual(a, b);
}

/** Human-readable, collision-resistant order reference. */
export function generateReference() {
  return `ASO-${Date.now().toString(36).toUpperCase()}-${crypto
    .randomUUID()
    .slice(0, 8)
    .toUpperCase()}`;
}
