-- ── Fabrics ─────────────────────────────────────────────────────────────────
--
-- The house sells cloth, not only garments made from it, and cloth is measured
-- rather than counted: a bolt is eighteen metres and leaves as four, then six,
-- then whatever is left. `products` cannot express that — its stock is an
-- integer count of identical things — so cloth gets its own table.
--
-- This is also the list the bespoke process starts from. "Choose your fabric"
-- on the homepage is these rows.

create table fabrics (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  name             text not null,
  -- Iseyin, Ilorin, Abẹ́òkúta — where it was woven, which is half the story.
  origin           text,
  pattern          text,
  colours          text[] not null default '{}',
  width_cm         integer check (width_cm > 0),
  -- Kobo per metre. Money is kobo everywhere; this is no exception.
  price_per_metre  integer check (price_per_metre >= 0),
  /*
   * Metres, and the one number in the schema that is deliberately not an
   * integer — cloth is cut at 2.5m and 0.75m. `numeric` rather than a float:
   * exact decimal arithmetic, so subtracting a sale never leaves 17.999999
   * metres on the shelf.
   */
  metres_available numeric(10, 2) not null default 0 check (metres_available >= 0),
  description      text,
  image            text,
  is_active        boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create trigger fabrics_updated_at before update on fabrics
  for each row execute function set_updated_at();

alter table fabrics enable row level security;

create policy "active fabrics are public"
  on fabrics for select
  using (is_active);

create policy "admins manage fabrics"
  on fabrics for all
  using (is_admin()) with check (is_admin());

-- ── Bespoke requests ────────────────────────────────────────────────────────
--
-- A commission enquiry. It arrives from the storefront, sits in the dashboard,
-- and moves along a track the atelier can see at a glance.
--
-- The states are the atelier's actual workflow rather than an order's: an
-- enquiry is not a sale, it is a conversation that may become one, so it does
-- not live in `orders` and it has no payment status.

create type bespoke_status as enum (
  'new', 'reviewing', 'consultation', 'in_production', 'completed', 'cancelled'
);

create table bespoke_requests (
  id                uuid primary key default gen_random_uuid(),
  -- Null for a guest. Most enquiries come before anyone makes an account.
  user_id           uuid references auth.users (id) on delete set null,
  full_name         text not null,
  email             text not null,
  phone             text,
  -- 'Traditional wedding', 'Engagement', 'Birthday'
  occasion          text,
  event_date        date,
  outfit            text,
  fabric_preference text,
  -- Kobo, both ends of the range the client gave.
  budget_min        integer check (budget_min >= 0),
  budget_max        integer check (budget_max >= 0),
  message           text,
  /*
   * Paths in the private `bespoke-uploads` bucket, not public URLs. These are
   * a client's own photographs — frequently of other people at other people's
   * weddings — and they are signed for the atelier when needed, never served
   * openly.
   */
  reference_images  text[] not null default '{}',
  status            bespoke_status not null default 'new',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index bespoke_requests_status_idx on bespoke_requests (status, created_at desc);

create trigger bespoke_requests_updated_at before update on bespoke_requests
  for each row execute function set_updated_at();

alter table bespoke_requests enable row level security;

/*
 * Anyone may submit one, signed in or not — a commission enquiry is the first
 * contact most clients ever have with the house, and putting an account in
 * front of it would lose the enquiry.
 *
 * The cost of that is spam, which is a rate-limiting and moderation problem
 * rather than a policy one. Nobody can read what they wrote back except the
 * atelier, so there is nothing here to harvest.
 */
create policy "anyone may submit an enquiry"
  on bespoke_requests for insert
  with check (true);

create policy "read own enquiries"
  on bespoke_requests for select
  using (user_id is not null and (select auth.uid()) = user_id);

create policy "admins read enquiries"
  on bespoke_requests for select
  using (is_admin());

-- Status only moves from the dashboard. A client cannot mark their own
-- commission complete.
create policy "admins update enquiries"
  on bespoke_requests for update
  using (is_admin()) with check (is_admin());
