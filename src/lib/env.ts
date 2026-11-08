import { z } from "zod";

/**
 * Browser-safe environment variables.
 *
 * Next.js only inlines `NEXT_PUBLIC_*` values when they are referenced as a
 * literal `process.env.NEXT_PUBLIC_X` expression, so each one is read by hand
 * below rather than spreading `process.env`.
 */
const publicSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  /*
   * Optional, because this integration never uses it.
   *
   * Checkout is the redirect flow: the server opens the transaction with the
   * SECRET key and sends the customer to Paystack's own hosted page, so the
   * browser needs no key at all. The public key is only for Paystack's inline
   * popup, which this shop does not use — kept here so that switching to
   * inline later is a one-line change rather than an env hunt, but never
   * something a launch should be blocked on.
   */
  NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: z.string().startsWith("pk_").optional(),
  NEXT_PUBLIC_SITE_URL: z.url(),
});

const parsed = publicSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
  NEXT_PUBLIC_SITE_URL:
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
});

/**
 * Production must never boot half-configured. Development may, so the design
 * can be worked on before the Supabase and Paystack accounts exist — data
 * calls fail softly and render empty states instead of crashing the page.
 */
function resolve() {
  if (parsed.success) return parsed.data;

  const detail = z.prettifyError(parsed.error);

  if (process.env.NODE_ENV === "production") {
    throw new Error(`Invalid public environment variables:\n${detail}`);
  }

  console.warn(
    `\n[env] Running with placeholder configuration.\n${detail}\n` +
      `Copy .env.example to .env.local and fill it in to enable data and payments.\n`,
  );

  return publicSchema.parse({
    NEXT_PUBLIC_SUPABASE_URL: "https://placeholder.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "placeholder-anon-key",
    NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
  });
}

export const env = resolve();

/** True when real credentials are present. Guard live data calls with this. */
export const isConfigured = parsed.success;
