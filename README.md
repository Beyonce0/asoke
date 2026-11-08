# ÀṢỌKÉ — Woven For Her

Online store for handwoven aso-oke scarves and ready-to-wear.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 ·
GSAP · Lenis · Motion · Supabase (Postgres, Auth, Storage) · Paystack.

---

## Getting started

```bash
npm install
npm run dev
```

**No credentials needed to start.** With no `.env.local`, the storefront runs
on the sample catalogue in `src/lib/sample-data.ts` — six products, three
collections, placeholder cloth swatches. Everything is designable right away.
Only checkout is inert, and it says so when you press the button.

Connect the backend when you are ready:

```bash
cp .env.example .env.local   # then fill it in
```

The moment real credentials are present, every query switches to the database
and the sample data is never read again.

## Palette

|                  | Hex       | Tailwind   | Role                                     |
| ---------------- | --------- | ---------- | ---------------------------------------- |
| Deep Charcoal    | `#0D0C0C` | `charcoal` | Main background — site, loader, sections |
| Warm Brown-Black | `#171312` | `surface`  | Secondary background — cards, drawers    |
| Deep Navy        | `#172A4A` | `navy`     | Primary brand colour                     |
| Antique Gold     | `#B89B5E` | `gold`     | Luxury accent                            |
| Deep Burgundy    | `#7A1018` | `burgundy` | Textile accent                           |

Text tones on charcoal: `cream`, `cream-soft`, `muted`. Full contrast notes in
`AGENTS.md`.

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. **Project Settings → API** — copy the URL, the `anon` key, and the
   `service_role` key into `.env.local`.
3. Run the migrations. Either paste `supabase/migrations/*.sql` into the SQL
   editor in order, or link the CLI:

   ```bash
   npx supabase link --project-ref <your-ref>
   npx supabase db push
   ```

4. **Authentication → URL Configuration** — set the site URL to
   `http://localhost:3000` and add `http://localhost:3000/auth/callback` as a
   redirect URL.
5. Product images go in the `product-images` storage bucket, which migration
   `0001` creates as public.

### 2. Paystack

1. Create an account at [paystack.com](https://paystack.com).
2. **Settings → API Keys & Webhooks** — copy the test public and secret keys.
3. Set the webhook URL to `https://<your-domain>/api/paystack/webhook`.
   For local testing, tunnel it:

   ```bash
   npx untun@latest tunnel http://localhost:3000
   ```

Test cards are in the [Paystack docs](https://paystack.com/docs/payments/test-payments/).

### 3. Add a product

Nothing shows in the shop until a product exists with `is_published = true`
and at least one active variant. Insert one from the Supabase table editor:
`collections` → `products` → `product_variants` → `product_images`.

Prices are in **kobo** — ₦45,000 is `4500000`.

---

## How a payment flows

```
Cart (localStorage)
  └─ POST server action  startCheckout
       ├─ re-prices every line from the database        ← client prices ignored
       ├─ inserts orders + order_items  (payment_status: pending)
       ├─ Paystack /transaction/initialize
       └─ redirect → Paystack hosted checkout
                        │
        ┌───────────────┴────────────────┐
        │                                │
   customer returns            Paystack webhook
   /checkout/confirm           charge.success
        │                                │
        └────────► fulfillOrder() ◄──────┘
                     ├─ verify with Paystack
                     ├─ reject if amount ≠ order total
                     └─ mark_order_paid()  — row-locked, idempotent
```

Both paths call the same function, and the RPC no-ops on a replay, so stock is
never decremented twice.

---

## Scripts

| Command             | What it does                          |
| ------------------- | ------------------------------------- |
| `npm run dev`       | Dev server with Turbopack             |
| `npm run build`     | Production build                      |
| `npm run start`     | Serve the production build            |
| `npm run typecheck` | `tsc --noEmit`                        |
| `npm run lint`      | ESLint                                |
| `npm run format`    | Prettier, with Tailwind class sorting |

---

## Deploying

Push to GitHub and import the repo on Vercel. Set all six variables from
`.env.example` in the project settings, with `NEXT_PUBLIC_SITE_URL` pointing at
the production domain. Then update the Paystack webhook URL and the Supabase
redirect URLs to match.

---

## Not built yet

- Admin surface for products and orders — the Supabase table editor covers it
  for now.
- Transactional email on order confirmation (Resend or Supabase hooks).
- Courier-quoted shipping. Currently flat: ₦2,500 in Lagos, ₦5,000 elsewhere.
- Saved addresses at checkout — the table and policies exist, the UI does not.
