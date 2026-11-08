# ÀṢỌKÉ — Woven For Her

Online store for handwoven aso-oke scarves and ready-to-wear, cut for women.
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · GSAP · Lenis ·
Supabase · Paystack.

## Commands

```
npm run dev        # dev server (Turbopack)
npm run build      # production build
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm run format     # prettier
```

## Palette — locked

A dark house. The site sits on charcoal the way the atelier photography does,
and the cloth colours do the talking.

| Token      | Hex       | Role                                                       |
| ---------- | --------- | ---------------------------------------------------------- |
| `charcoal` | `#0D0C0C` | Main background. Site, loader, most sections               |
| `surface`  | `#171312` | Secondary background. Cards, drawers, blocks that lift     |
| `navy`     | `#172A4A` | Primary brand colour. Buttons, borders, hovers, graphics   |
| `gold`     | `#B89B5E` | Luxury accent. Hairlines, small marks, the lockup subtitle |
| `burgundy` | `#7A1018` | Textile accent. Primary button fill                        |

Derived working tones: `cream` (primary text), `cream-soft` (body copy),
`muted` (labels and meta), `line` (hairlines), `navy-light`, `gold-light`,
`burgundy-light`.

**Never name a colour token `base`.** Tailwind ships `text-base` as a font
size, so `--color-base` silently collides with it and the class becomes
ambiguous. That is why the background token is `charcoal`.

**Contrast on charcoal, already checked** — cream 15.6:1, cream-soft 9.3:1,
muted 5.2:1, gold 7.3:1 (gold _is_ safe for text on this palette, unlike on a
light one). Navy 1.3:1 and burgundy 1.6:1 are fills only; cream on either is
fine (11.8:1 and 9.9:1). Gold buttons need `text-charcoal` — cream on gold is
only 2.2:1.

No dark mode toggle. The site commits to this one look on purpose — fabric
colour that shifts with the viewer's OS setting misrepresents the product.

## The opening sequence

`/` runs curtain → hero → plate, in that order.

1. **Curtain** (`components/motion/intro.tsx`) — charcoal panel, wordmark,
   `WOVEN FOR HER`, a gold hairline that fills. Lifts when the page is ready.
2. **Hero** (`components/sections/hero.tsx`) — the courtyard photograph with
   the model composited into it, gated on `isIntroDone` so it does not play
   behind the curtain. It cancels the header's height with a negative margin so
   it is one clean screen; both read `--header-height`.
3. **Plate** (`components/sections/showcase.tsx`) — the lineup photograph,
   sliced into five vertical panels that rise and lock together the way aso-oke
   strips are joined. Scroll-triggered. Full-bleed from `md` up; letterboxes on
   portrait phones so the outer figures are never cropped away.

**The model is keyed live, not pre-baked.** `components/motion/chroma-video.tsx`
removes the green in a WebGL shader every frame. WebM alpha is ignored by
Safari and MP4 cannot carry alpha at all, so keying at play time is the only
one-path answer. Two rules learned the hard way:

- **Measure the key, never guess it.** Sample the screen across a real frame,
  take the widest chroma distance from the key colour, then check the closest
  colour in the subject. On the current footage green tops out at 0.024 and the
  garment starts at 0.35, so `similarity` sits at 0.06.
- **Despill by clamping green, not by desaturating.** Pulling colour toward
  luminance turned the navy stripes grey. Clamping green to the mean of red and
  blue strips the rim and the cast on skin while leaving navy (b > g) and
  burgundy (r > g) untouched.

`scratchpad/verify-key.mjs`-style CPU replays of the shader are the cheapest way
to check a key before shipping it.

**One screen, one measurement.** The key lives in `lib/chroma.ts` as
`GREEN_SCREEN` and is shared by the hero composite and the turn clips on
product pages. Everything the house films is shot on the same screen, so a
second copy of those numbers is a second thing to get wrong.

## The product gallery

A piece is shown from whatever sides it was shot from, plus a film of it
turning if one exists — `components/shop/product-gallery.tsx`. Both are data,
not layout: `product_images.view` is `front | back | detail`, and
`products.turn_video` holds one green-screen clip, keyed at play time like
everything else. A piece with one photograph and no film renders one option and
no switch.

The film mounts only once it is asked for, and `ChromaVideo` sizes its canvas
from the frame when it is not told the dimensions up front — a clip out of the
database does not come with its own measurements.

Cards read `product_images[0]`, so any query embedding images must order them
(`FIRST_IMAGE_FIRST` in `lib/queries.ts`) or a card is free to lead with the
back of the garment.

## Languages

The storefront speaks English, Yorùbá, Igbo, Hausa and Nigerian Pidgin. The
choice is a cookie (`locale`), not a URL segment, so every address stays the
same in every language. `src/i18n/`:

- `dictionaries/en.ts` is the source. The others are typed `Dictionary`, so a
  key added to English and missed elsewhere fails `npm run typecheck`.
- Server components and actions: `await getDictionary()` from `i18n/server`.
  Client components: `useI18n()`. `fill()` handles `{name}` placeholders.
- Validation messages are built per request (`checkoutSchema(fields)`,
  `bookingSchema(errors)`), so errors arrive in the shopper's language.
- Only the site's own words are translated. Product names, descriptions and
  anything typed into the admin show as written. The admin is English only.
- The non-English text was machine-drafted and needs a native speaker's read
  before launch.

**The brand name never changes.** `Àṣọké` / `ÀṢỌKÉ` is never translated and
every wordmark carries `translate="no"`. The whole document also sets
`translate="no"` and `<meta name="google" content="notranslate">`: Chrome's
auto-translate once rewrote the brand as "Axéké" on top of the site's own
translation.

**No em-dashes in anything a visitor or admin reads:** dictionaries, JSX
text, alt text, seed data, error messages. Use a colon, comma or full stop.
Code comments are exempt.

**Inter draws capital Ƙ as a plain K.** Hausa labels set in `uppercase` lose
the hook; lowercase ƙ, ɓ, ɗ and the Igbo dots render correctly.

## Email

Replies to enquiries are written on `/admin/inbox/[id]` and sent through
Resend (`lib/email.ts`, a plain `fetch`, no SDK). `RESEND_API_KEY`,
`EMAIL_FROM` and `EMAIL_REPLY_TO` are server-only. Until a domain is verified
in Resend, `EMAIL_FROM` stays empty and Resend's test sender can only deliver
to the Resend account's own address.

`sendEnquiryReply` sends first, then records the reply in `enquiry_replies`
and marks the enquiry replied, so the history never shows a reply the
customer did not receive. It checks the history table exists before sending.

## Rules that are easy to get wrong

**Money is kobo, everywhere.** The database, the cart, the Paystack API and
`order_items.unit_price` all store integers in kobo. Format only at the edge
with `formatNaira()`. Never introduce a float.

**Never trust a client-side price.** `startCheckout` re-reads every variant
from the database and recomputes the total. The cart's `unitPrice` is display
only.

**Never mark an order paid from the browser.** `fulfillOrder()` verifies with
Paystack, checks the amount matches, then calls the `mark_order_paid` RPC,
which locks the order row. The webhook and the `/checkout/confirm` callback
both go through it, and it is idempotent by design.

**The webhook needs the raw body.** `isValidWebhookSignature` hashes the exact
bytes Paystack sent. Parsing and re-serialising breaks the HMAC.

**Checkout is the redirect flow, so only the secret key matters.** The server
opens the transaction and sends the customer to Paystack's hosted page;
`NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` is optional and currently unused — it exists
for a future switch to the inline popup. `npm run paystack:check` proves a key
before a customer does.

**Paystack cannot reach localhost.** In development only the `/checkout/confirm`
callback settles an order, which is enough because it verifies with Paystack
directly. The webhook — the path that still fires when the customer closes the
tab — needs a public URL, so add
`https://<domain>/api/paystack/webhook` in the Paystack dashboard at deploy
time, not before.

**Everything is charged in naira.** `initializeTransaction` hardcodes `NGN` and
`formatNaira` is used in seventeen files. An international card can already pay
a naira charge — the customer's bank converts — but quoting in another currency
would need a price per currency, a general formatter, and that currency enabled
on the Paystack account.

**Three Supabase clients, three jobs.**

- `lib/supabase/client.ts` — client components, runs as the user.
- `lib/supabase/server.ts` — server components / actions, runs as the user, RLS applies.
- `lib/supabase/admin.ts` — service role, bypasses RLS. Only for the webhook
  and checkout writes. Never reachable from a client component.

**Auth checks use `getUser()`, not `getSession()`.** Only `getUser()`
revalidates against Supabase; a session cookie can be forged.

**Fonts need the `vietnamese` subset.** Yoruba's ẹ (U+1EB9) and ọ (U+1ECD)
live in that Unicode block. Drop it and the brand name renders in a fallback.

**One rAF loop.** Lenis is driven by `gsap.ticker` in `SmoothScroll`, with
`autoRaf: false`. Do not start a second loop or add `lenis.raf` anywhere else.
Scrollable overlays need `data-lenis-prevent`.

**The intro curtain owns the first two seconds.** `components/motion/intro.tsx`
renders in the server HTML so there is no flash of storefront, pauses Lenis
while it is up, and hands off via `useIntro()` as it starts lifting. Any
above-the-fold animation must gate on `isIntroDone` or it plays unseen behind
the panel — see `Hero`. Tunables live at the top of the file: `SHOW_PERCENTAGE`,
`MIN_VISIBLE_MS`, `MAX_WAIT_MS`.

**Sample data is a stand-in.** While `NEXT_PUBLIC_SUPABASE_URL` is unset,
`lib/queries.ts` serves `lib/sample-data.ts` so the storefront and the admin
can both be designed against real content. Connect Supabase and every query
switches over untouched. `supabase/seed.sql` is the same catalogue as SQL, for
the first run against a real project; delete `sample-data.ts` and those rows
once real products exist.

**Bringing up a new Supabase project.** `supabase/setup.sql` is every migration
concatenated in order, for one paste into the SQL editor. The files in
`supabase/migrations` stay the source of truth — regenerate or delete the
combined file rather than editing it.

## Layout

```
src/
  app/
    (shop)/        storefront — shares Header/Footer/CartDrawer
    (auth)/        sign-in, sign-up — bare layout
    api/paystack/webhook/  charge.success handler
    auth/callback/         email confirmation exchange
  components/  layout · motion · sections · shop · ui
  lib/         env · gsap · orders · paystack · queries · supabase · utils
  store/       cart (context + localStorage)
  types/       database.ts mirrors the SQL; index.ts derives app types
  proxy.ts     session refresh + /account gate (Next 16 renamed middleware→proxy)
supabase/migrations/
```

`src/types/database.ts` is hand-written to match the migrations. Once the
Supabase project exists, regenerate it instead of editing:

```
npx supabase gen types typescript --project-id <ref> --schema public > src/types/database.ts
```

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
