/*
 * Is the Paystack secret key real, and which mode is it in?
 *
 * Run before the first checkout — `node scripts/check-paystack.mjs`. Finding
 * out that a key is wrong from Paystack directly takes seconds; finding out
 * from a failed checkout means a customer got there first.
 *
 * Reads .env.local by hand rather than through the app's env module, because
 * the point is to test the file as it is actually written.
 */

import { readFile } from "node:fs/promises";

const file = await readFile(new URL("../.env.local", import.meta.url), "utf8");

const env = Object.fromEntries(
  file
    .split(/\r?\n/)
    .filter((line) => line.includes("=") && !line.trim().startsWith("#"))
    .map((line) => {
      const at = line.indexOf("=");
      return [line.slice(0, at).trim(), line.slice(at + 1).trim()];
    }),
);

const secret = env.PAYSTACK_SECRET_KEY;

if (!secret || secret.endsWith("placeholder")) {
  console.log("✗ PAYSTACK_SECRET_KEY is still a placeholder.");
  console.log("  Paystack dashboard → Settings → API Keys & Webhooks.");
  process.exit(1);
}

if (!secret.startsWith("sk_")) {
  console.log("✗ That does not look like a secret key — it should start sk_.");
  console.log("  A key starting pk_ is the public one and cannot charge.");
  process.exit(1);
}

const live = secret.startsWith("sk_live_");

// Cheapest authenticated call there is: it lists nothing and proves the key.
const response = await fetch("https://api.paystack.co/transaction?perPage=1", {
  headers: { Authorization: `Bearer ${secret}` },
});

const body = await response.json().catch(() => ({}));

if (!response.ok) {
  console.log(`✗ Paystack rejected the key (${response.status}).`);
  console.log(`  ${body.message ?? "no message"}`);
  process.exit(1);
}

console.log(`✓ Key works — ${live ? "LIVE MODE, real money" : "test mode"}.`);
console.log(`  Transactions so far: ${body.meta?.total ?? 0}`);

if (live) {
  console.log("\n  Live keys on a development machine charge real cards.");
  console.log("  Use sk_test_ until you are ready to sell.");
}

console.log("\nWebhook, once deployed:");
console.log(
  `  ${env.NEXT_PUBLIC_SITE_URL ?? "https://yourdomain.com"}/api/paystack/webhook`,
);
