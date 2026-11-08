-- ============================================================================
-- ÀṢỌKÉ — first-run setup
--
-- Every migration in supabase/migrations, in order, concatenated so a new
-- project can be brought up with one paste into the Supabase SQL editor.
--
-- The files in supabase/migrations remain the source of truth. This is a
-- convenience for the first run only — after that, run new migrations
-- individually, and regenerate or delete this file so it cannot go stale.
-- ============================================================================


-- ─────────────────────────────────────────────────────────────────────────
-- 0001_init.sql
-- ─────────────────────────────────────────────────────────────────────────

-- ÀṢÒKÉ — initial schema
-- All money is stored in kobo (integer). Never use floats for currency.

create extension if not exists "pgcrypto";

-- ── Enums ───────────────────────────────────────────────────────────────────

create type order_status as enum (
  'pending', 'processing', 'shipped', 'delivered', 'cancelled'
);

create type payment_status as enum (
  'pending', 'paid', 'failed', 'refunded'
);

-- ── Profiles ────────────────────────────────────────────────────────────────

create table profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  phone       text,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── Catalogue ───────────────────────────────────────────────────────────────

create table collections (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  description text,
  hero_image  text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

create table products (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  description   text,
  -- The weaving story behind the piece. Editorial copy for the detail page.
  story         text,
  collection_id uuid references collections (id) on delete set null,
  base_price    integer not null check (base_price >= 0),
  currency      text not null default 'NGN',
  is_published  boolean not null default false,
  is_featured   boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index products_collection_idx on products (collection_id);
create index products_published_idx on products (is_published, created_at desc);

create table product_images (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  url        text not null,
  alt        text,
  sort_order integer not null default 0
);

create index product_images_product_idx on product_images (product_id, sort_order);

create table product_variants (
  id             uuid primary key default gen_random_uuid(),
  product_id     uuid not null references products (id) on delete cascade,
  sku            text not null unique,
  -- e.g. 'Ìbílẹ̀ Gold'
  color          text,
  -- e.g. 'M' or 'Custom'
  size           text,
  -- Overrides products.base_price when set. Kobo.
  price_override integer check (price_override >= 0),
  stock          integer not null default 0 check (stock >= 0),
  is_active      boolean not null default true
);

create index product_variants_product_idx on product_variants (product_id);

-- ── Customers ───────────────────────────────────────────────────────────────

create table addresses (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  full_name  text not null,
  phone      text not null,
  line1      text not null,
  line2      text,
  city       text not null,
  state      text not null,
  country    text not null default 'Nigeria',
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create index addresses_user_idx on addresses (user_id);

-- ── Orders ──────────────────────────────────────────────────────────────────

create table orders (
  id                 uuid primary key default gen_random_uuid(),
  -- Null for guest checkout.
  user_id            uuid references auth.users (id) on delete set null,
  reference          text not null unique,
  email              text not null,
  subtotal           integer not null check (subtotal >= 0),
  shipping_fee       integer not null default 0 check (shipping_fee >= 0),
  total              integer not null check (total >= 0),
  currency           text not null default 'NGN',
  status             order_status not null default 'pending',
  payment_status     payment_status not null default 'pending',
  paystack_reference text unique,
  paid_at            timestamptz,
  shipping_address   jsonb,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index orders_user_idx on orders (user_id, created_at desc);

create table order_items (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references orders (id) on delete cascade,
  product_id    uuid references products (id) on delete set null,
  variant_id    uuid references product_variants (id) on delete set null,
  -- Snapshots: the order must still read correctly after the product changes.
  name_snapshot text not null,
  variant_label text,
  unit_price    integer not null check (unit_price >= 0),
  quantity      integer not null check (quantity > 0)
);

create index order_items_order_idx on order_items (order_id);

-- ── Triggers ────────────────────────────────────────────────────────────────

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on profiles
  for each row execute function set_updated_at();
create trigger products_updated_at before update on products
  for each row execute function set_updated_at();
create trigger orders_updated_at before update on orders
  for each row execute function set_updated_at();

-- Every auth user gets a profile row automatically.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ── Row level security ──────────────────────────────────────────────────────

alter table profiles         enable row level security;
alter table collections      enable row level security;
alter table products         enable row level security;
alter table product_images   enable row level security;
alter table product_variants enable row level security;
alter table addresses        enable row level security;
alter table orders           enable row level security;
alter table order_items      enable row level security;

-- Catalogue: world-readable, but only what has been published.
create policy "collections are public"
  on collections for select
  using (true);

create policy "published products are public"
  on products for select
  using (is_published);

create policy "images of published products are public"
  on product_images for select
  using (exists (
    select 1 from products p
    where p.id = product_images.product_id and p.is_published
  ));

create policy "variants of published products are public"
  on product_variants for select
  using (exists (
    select 1 from products p
    where p.id = product_variants.product_id and p.is_published
  ));

-- Profiles: yours only.
create policy "read own profile"
  on profiles for select
  using ((select auth.uid()) = id);

create policy "update own profile"
  on profiles for update
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Addresses: yours only.
create policy "read own addresses"
  on addresses for select
  using ((select auth.uid()) = user_id);

create policy "insert own addresses"
  on addresses for insert
  with check ((select auth.uid()) = user_id);

create policy "update own addresses"
  on addresses for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "delete own addresses"
  on addresses for delete
  using ((select auth.uid()) = user_id);

-- Orders: readable by their owner. Writes go through the service role only,
-- so a customer can never mark their own order paid.
create policy "read own orders"
  on orders for select
  using ((select auth.uid()) = user_id);

create policy "read own order items"
  on order_items for select
  using (exists (
    select 1 from orders o
    where o.id = order_items.order_id
      and o.user_id = (select auth.uid())
  ));

-- ── Storage ─────────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "product images are public"
  on storage.objects for select
  using (bucket_id = 'product-images');


-- ─────────────────────────────────────────────────────────────────────────
-- 0002_order_fulfillment.sql
-- ─────────────────────────────────────────────────────────────────────────

-- Marking an order paid touches two tables and must not half-apply, so it
-- lives in one function that runs inside a single transaction.

create or replace function mark_order_paid(
  p_reference text,
  p_paid_at   timestamptz default now()
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order orders%rowtype;
begin
  -- Locks the row so the Paystack webhook and the browser callback — which
  -- routinely arrive at the same moment — cannot both decrement stock.
  select * into v_order
    from orders
   where reference = p_reference
     for update;

  if not found then
    return false;
  end if;

  -- Already settled. Idempotent by design: replays are a no-op, not an error.
  if v_order.payment_status = 'paid' then
    return true;
  end if;

  update orders
     set payment_status = 'paid',
         status         = 'processing',
         paid_at        = coalesce(p_paid_at, now())
   where id = v_order.id;

  update product_variants v
     set stock = greatest(v.stock - oi.quantity, 0)
    from order_items oi
   where oi.order_id = v_order.id
     and oi.variant_id = v.id;

  return true;
end;
$$;

-- Only the service role may settle payments.
revoke execute on function mark_order_paid(text, timestamptz) from public, anon, authenticated;

create or replace function mark_order_failed(p_reference text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update orders
     set payment_status = 'failed'
   where reference = p_reference
     and payment_status = 'pending';

  return found;
end;
$$;

revoke execute on function mark_order_failed(text) from public, anon, authenticated;


-- ─────────────────────────────────────────────────────────────────────────
-- 0003_garment_views.sql
-- ─────────────────────────────────────────────────────────────────────────

-- ── Garment views ───────────────────────────────────────────────────────────
--
-- The first thing a shopper asks about a piece is what it looks like from
-- behind, and cloth this heavy hangs differently in motion than it does on a
-- hanger. Both questions were unanswerable: a photograph did not say which
-- side it showed, and there was nowhere to put a clip.
--
-- So a photograph now names its side, and a product may carry one film of the
-- piece turning. The detail page offers whichever of these exist as a switch
-- above the picture, so a piece with only a front shot still works and simply
-- shows one option.

create type garment_view as enum ('front', 'back', 'detail');

-- Existing rows are all front shots — that is what was uploaded when there was
-- no way to say otherwise — so the default backfills them correctly.
alter table product_images
  add column view garment_view not null default 'front';

-- One clip per piece, shot on green like everything else the atelier films.
-- The key is removed in a shader at play time (see components/motion/
-- chroma-video.tsx), which is why a single file works on any background and
-- why nothing here needs to know the page it will be played on.
--
-- Null until the piece has been filmed, which is most of them.
alter table products
  add column turn_video text;

-- No policy work: both tables already carry select policies gated on
-- products.is_published, and there are no write policies at all, so writes stay
-- with the service role. A column added to a policied table inherits all of it.


-- ─────────────────────────────────────────────────────────────────────────
-- 0004_admin_role.sql
-- ─────────────────────────────────────────────────────────────────────────

-- ── Who is an admin ─────────────────────────────────────────────────────────
--
-- Until now nothing could write to the catalogue at all: the tables carry read
-- policies and no write policies, so only the service role could insert a
-- product. That is correct for a storefront and useless for a dashboard.
--
-- The alternative — pointing the admin UI at the service-role key — would put
-- a credential that bypasses row level security behind nothing but application
-- code. Instead an admin becomes a real identity in the database, and the same
-- policies that protect the storefront protect the dashboard. If an admin
-- action is ever reachable by the wrong person, Postgres refuses the write.

create type app_role as enum ('customer', 'admin');

alter table profiles
  add column role app_role not null default 'customer';

/*
 * The gate everything else is written against.
 *
 * `security definer` is not decoration: without it, a policy on profiles that
 * calls this function — which itself selects from profiles — recurses until
 * Postgres gives up. Running as the owner skips RLS on the inner read and
 * breaks the loop. `set search_path` stops a caller pointing `profiles` at a
 * table of their own making.
 *
 * Deliberately left executable by everyone. Policies run as the calling role,
 * so `authenticated` must be able to call it, and all it ever reveals is
 * whether you yourself are an admin.
 */
create or replace function is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
      from profiles
     where id = (select auth.uid())
       and role = 'admin'
  );
$$;

-- ── Nobody promotes themselves ──────────────────────────────────────────────
--
-- "update own profile" lets a customer write their own row, and Supabase hands
-- `authenticated` every column privilege by default — so without this, one
-- request against profiles.role makes anyone an admin.
--
-- RLS chooses which ROWS you may touch. Only column grants choose which
-- COLUMNS. Both are needed here.
revoke update on profiles from anon, authenticated;
grant update (full_name, phone, avatar_url) on profiles to authenticated;

-- ── What an admin may do ────────────────────────────────────────────────────
--
-- Policies are OR'd, so these sit alongside the public read policies rather
-- than replacing them: the storefront keeps seeing published rows, and an
-- admin additionally sees drafts and may write.

create policy "admins manage products"
  on products for all
  using (is_admin()) with check (is_admin());

create policy "admins manage collections"
  on collections for all
  using (is_admin()) with check (is_admin());

create policy "admins manage product images"
  on product_images for all
  using (is_admin()) with check (is_admin());

create policy "admins manage product variants"
  on product_variants for all
  using (is_admin()) with check (is_admin());

-- Read-only for now. Fulfilment status gets its own function later, the way
-- payment already does — an admin must never be able to write payment_status
-- or paid_at, which are Paystack's word and settled by mark_order_paid().
create policy "admins read orders"
  on orders for select
  using (is_admin());

create policy "admins read order items"
  on order_items for select
  using (is_admin());

-- So the dashboard can put a name to an order.
create policy "admins read profiles"
  on profiles for select
  using (is_admin());

-- ── The first admin ─────────────────────────────────────────────────────────
--
-- Cannot be granted by the application: no signup flow may offer "make me an
-- admin". Sign up through the site as normal, then run this once against the
-- Supabase SQL editor with your own address. Afterwards admins can promote
-- each other from the dashboard.
--
--   update profiles
--      set role = 'admin'
--    where id = (select id from auth.users where email = 'you@example.com');


-- ─────────────────────────────────────────────────────────────────────────
-- 0005_media_storage.sql
-- ─────────────────────────────────────────────────────────────────────────

-- ── Storage ─────────────────────────────────────────────────────────────────
--
-- Two buckets, because the two kinds of file have opposite requirements.
--
-- Product media is public: it is shop photography, it is meant to be seen, and
-- a public URL is what `next/image` optimises without a round trip for a signed
-- one. next.config.ts already allow-lists this path.
--
-- Bespoke uploads are not. A commission enquiry carries a customer's reference
-- images — frequently photographs of their family at other people's weddings —
-- and those are readable by the atelier and nobody else, ever.

insert into storage.buckets (id, name, public)
values ('product-media', 'product-media', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('bespoke-uploads', 'bespoke-uploads', false)
on conflict (id) do nothing;

-- ── Who may touch what ──────────────────────────────────────────────────────
--
-- `public = true` on a bucket only makes reads anonymous. Every write still
-- goes through these policies, which is what stops a signed-in customer
-- uploading into the shop's photography.
--
-- Schema-qualified `public.is_admin()` — these policies are evaluated with
-- storage on the search path, where a bare name would not resolve.

create policy "product media is readable by anyone"
  on storage.objects for select
  using (bucket_id = 'product-media');

create policy "admins manage product media"
  on storage.objects for all
  using (bucket_id = 'product-media' and public.is_admin())
  with check (bucket_id = 'product-media' and public.is_admin());

-- No insert policy yet: nothing submits a commission until the bespoke form
-- exists, and a bucket anyone may write to before then is a free file host.
create policy "admins read bespoke uploads"
  on storage.objects for select
  using (bucket_id = 'bespoke-uploads' and public.is_admin());


-- ─────────────────────────────────────────────────────────────────────────
-- 0006_product_attributes.sql
-- ─────────────────────────────────────────────────────────────────────────

-- ── What kind of thing a product is ─────────────────────────────────────────
--
-- The catalogue was built assuming everything is a finished garment. The
-- atelier also sells cloth by the piece and takes commissions, and those are
-- not the same object: a shopper filtering for "fabric" does not want a jacket
-- in the results, and a bespoke listing is a starting point rather than stock.

create type product_type as enum (
  'ready_to_wear', 'fabric', 'bespoke', 'custom'
);

alter table products
  add column product_type product_type not null default 'ready_to_wear';

-- Free text rather than an enum, deliberately. The house weaves aṣọ-òkè, adire,
-- akwa ocha and akwete today and will weave something else next year, and a new
-- cloth should not need a migration to sell. When the Fabrics section lands
-- this becomes a foreign key to it, and the strings written here are what will
-- seed that table.
alter table products
  add column fabric_type text;


-- ─────────────────────────────────────────────────────────────────────────
-- 0007_fabrics_and_bespoke.sql
-- ─────────────────────────────────────────────────────────────────────────

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


-- ─────────────────────────────────────────────────────────────────────────
-- 0008_enquiries_appointments.sql
-- ─────────────────────────────────────────────────────────────────────────

-- ── Enquiries ───────────────────────────────────────────────────────────────
--
-- Contact-form messages, kept rather than emailed into somebody's inbox and
-- lost. The point of a table is that two people can see the same queue, and
-- that "did anyone reply to this?" has an answer.

create type enquiry_status as enum ('new', 'replied', 'closed');

create table enquiries (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users (id) on delete set null,
  full_name  text not null,
  email      text not null,
  phone      text,
  subject    text,
  message    text not null,
  status     enquiry_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index enquiries_status_idx on enquiries (status, created_at desc);

create trigger enquiries_updated_at before update on enquiries
  for each row execute function set_updated_at();

alter table enquiries enable row level security;

create policy "anyone may write to the atelier"
  on enquiries for insert
  with check (true);

create policy "read own enquiries"
  on enquiries for select
  using (user_id is not null and (select auth.uid()) = user_id);

create policy "admins read all enquiries"
  on enquiries for select
  using (is_admin());

create policy "admins update enquiries"
  on enquiries for update
  using (is_admin()) with check (is_admin());

-- ── Appointments ────────────────────────────────────────────────────────────
--
-- A booking is a promise about a specific hour, so the time is the row's
-- centre of gravity — stored as `timestamptz`, never as a date and a string of
-- text. A client in London booking a fitting in Lagos must land on the same
-- instant the atelier sees.

create type appointment_status as enum (
  'requested', 'confirmed', 'completed', 'cancelled'
);

create table appointments (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users (id) on delete set null,
  full_name  text not null,
  email      text not null,
  phone      text,
  -- 'Bespoke consultation', 'Fabric consultation', 'Fitting'
  kind       text not null,
  starts_at  timestamptz not null,
  duration_minutes integer not null default 60 check (duration_minutes > 0),
  notes      text,
  status     appointment_status not null default 'requested',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- The diary is always read in time order, and usually only forwards from now.
create index appointments_starts_at_idx on appointments (starts_at);

create trigger appointments_updated_at before update on appointments
  for each row execute function set_updated_at();

alter table appointments enable row level security;

create policy "anyone may request an appointment"
  on appointments for insert
  with check (true);

create policy "read own appointments"
  on appointments for select
  using (user_id is not null and (select auth.uid()) = user_id);

create policy "admins read all appointments"
  on appointments for select
  using (is_admin());

-- Confirming, moving and cancelling are all the atelier's call. A client
-- asking for a different hour submits a new request.
create policy "admins update appointments"
  on appointments for update
  using (is_admin()) with check (is_admin());

-- ── Fulfilment ──────────────────────────────────────────────────────────────
--
-- Orders still have no admin update policy, and this is why: an admin needs to
-- move an order from processing to shipped, and must never be able to touch
-- `payment_status` or `paid_at`. Those two are Paystack's word, settled by
-- mark_order_paid() after a verified charge.
--
-- Row level security chooses rows, not columns, so a policy cannot express
-- that distinction. A function can: this one writes exactly one column and
-- refuses anyone who is not an admin.

create or replace function set_order_status(
  p_order_id uuid,
  p_status   order_status
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_admin() then
    raise exception 'Only an admin may change fulfilment status.';
  end if;

  update orders
     set status = p_status
   where id = p_order_id;
end;
$$;


-- ─────────────────────────────────────────────────────────────────────────
-- 0009_site_settings.sql
-- ─────────────────────────────────────────────────────────────────────────

-- ── Site settings ───────────────────────────────────────────────────────────
--
-- The handful of facts that are currently sentences inside components: how to
-- reach the atelier, when it is open, and which files the front page plays.
--
-- Every one of them is the kind of thing that changes without warning — a new
-- phone number, a better hero film — and none of them should need a developer,
-- a deploy, or a conversation with an AI to change.
--
-- ONE ROW, FOREVER. `id` is a boolean fixed at true, so the primary key admits
-- exactly one value: there is one atelier and there can only ever be one row of
-- its details. A settings table that can hold two rows eventually holds two,
-- and then nothing knows which is live.

create table site_settings (
  id                boolean primary key default true check (id),

  -- ── How to reach the house ────────────────────────────────────────────
  email             text,
  phone             text,
  whatsapp          text,
  address           text,
  opening_hours     text,
  instagram         text,

  /*
   * ── What the front page plays ─────────────────────────────────────────
   *
   * Null means "use what ships with the build". Every one of these has a
   * hard-coded fallback in the component that reads it, so an empty settings
   * row renders exactly the site as designed rather than a page of holes.
   *
   * The hero film is keyed live, so whatever replaces it must be shot on the
   * atelier's green screen — see components/motion/chroma-video.tsx.
   */
  hero_image        text,
  hero_video_mp4    text,
  hero_video_webm   text,
  craft_image       text,

  -- ── Promises made to customers ────────────────────────────────────────
  -- Shown on the atelier timeline. The one number a customer holds us to.
  turnaround        text,

  updated_at        timestamptz not null default now()
);

create trigger site_settings_updated_at before update on site_settings
  for each row execute function set_updated_at();

-- The row exists from the start, empty. Then the dashboard only ever updates,
-- and no code anywhere has to handle "settings have not been created yet".
insert into site_settings (id) values (true) on conflict (id) do nothing;

alter table site_settings enable row level security;

-- Readable by anyone: this is the shop's phone number and the film on its
-- front page, which is as public as information gets.
create policy "site settings are public"
  on site_settings for select
  using (true);

create policy "admins update site settings"
  on site_settings for update
  using (is_admin()) with check (is_admin());


-- ─────────────────────────────────────────────────────────────────────────
-- 0010_order_journey.sql
-- ─────────────────────────────────────────────────────────────────────────

-- ── The journey an order takes ──────────────────────────────────────────────
--
-- `order_status` had five values, which is enough for a shop that posts things
-- and not enough for one that makes them. A scarf off the shelf goes straight
-- from paid to packed to posted. A commission spends weeks in the atelier —
-- cut, fitted, finished — and "processing" is a poor answer to a bride asking
-- where her cloth is in August for a December wedding.
--
-- So the enum gains the atelier's own stages. Both kinds of order share one
-- column, because they share one question: where is my order. Which stages
-- apply is a matter of what was bought, not of a second workflow.

alter type order_status add value if not exists 'cutting'   after 'processing';
alter type order_status add value if not exists 'fitting'   after 'cutting';
alter type order_status add value if not exists 'finishing' after 'fitting';
alter type order_status add value if not exists 'ready'     after 'finishing';

-- ── What happened, and when ─────────────────────────────────────────────────
--
-- A status is a single word that overwrites itself. What a customer actually
-- wants is the story: cut on the 12th, fitted on the 18th, posted on the 21st.
-- What the atelier wants is the same story plus who was told what.
--
-- So every change of status appends a row here and nothing ever updates one.
-- The orders table keeps the current state for the sake of fast lists; this is
-- the record.

create table order_events (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references orders (id) on delete cascade,
  status     order_status not null,
  /*
   * The atelier's own words — "sleeves taken in an inch", "courier collected".
   * Shown to the customer, so it is written for them rather than for a file.
   */
  note       text,
  created_at timestamptz not null default now()
);

create index order_events_order_idx on order_events (order_id, created_at);

alter table order_events enable row level security;

create policy "read own order events"
  on order_events for select
  using (exists (
    select 1 from orders o
    where o.id = order_events.order_id
      and o.user_id = (select auth.uid())
  ));

create policy "admins read order events"
  on order_events for select
  using (is_admin());

-- No insert policy on purpose. Events are written by set_order_status() below,
-- which runs as the owner — so a row can never appear without the status
-- actually having changed, and the history cannot be edited into fiction.

-- ── Moving an order along ───────────────────────────────────────────────────
--
-- Replaces the version from 0008. Same rules — admins only, fulfilment only,
-- never payment — plus the event trail and an optional note.

create or replace function set_order_status(
  p_order_id uuid,
  p_status   order_status,
  p_note     text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_current order_status;
begin
  if not is_admin() then
    raise exception 'Only an admin may change fulfilment status.';
  end if;

  select status into v_current from orders where id = p_order_id for update;

  if not found then
    raise exception 'No such order.';
  end if;

  -- A note on its own is worth recording; the same status twice with nothing
  -- to say is not.
  if v_current = p_status and p_note is null then
    return;
  end if;

  update orders set status = p_status where id = p_order_id;

  insert into order_events (order_id, status, note)
  values (p_order_id, p_status, nullif(btrim(p_note), ''));
end;
$$;

-- The old two-argument signature would otherwise linger and be chosen by any
-- caller that has not been updated.
drop function if exists set_order_status(uuid, order_status);

-- ── Backfill ────────────────────────────────────────────────────────────────
--
-- Orders that already exist have a status and no history. Give each one an
-- opening event so their timeline does not start empty — dated to when the
-- order was placed, which is the only honest timestamp available.

insert into order_events (order_id, status, note, created_at)
select id, status, null, created_at
  from orders
 where not exists (
   select 1 from order_events e where e.order_id = orders.id
 );



-- ─────────────────────────────────────────────────────────────────────────
-- 0011_enquiry_replies.sql
-- ─────────────────────────────────────────────────────────────────────────

-- ── Replies to enquiries ────────────────────────────────────────────────────
--
-- What the atelier wrote back, kept beside what the customer asked. The point
-- is the same as the enquiries table itself: two people can see the same
-- thread, and "what did we tell her?" has an answer that does not live in one
-- person's sent folder.
--
-- A row is written only after the email has actually gone, so the history
-- never shows a reply the customer did not receive. Replies are a record, not
-- a draft: there is no update or delete policy, so what was sent stays as it
-- was sent.

create table enquiry_replies (
  id          uuid primary key default gen_random_uuid(),
  enquiry_id  uuid not null references enquiries (id) on delete cascade,
  subject     text not null,
  body        text not null,
  -- Who sent it. Kept as a name too, so the history still reads correctly
  -- after an admin's account is removed.
  sent_by     uuid references auth.users (id) on delete set null,
  sent_by_name text,
  -- The email service's id for the message, for tracing a delivery problem.
  provider_id text,
  created_at  timestamptz not null default now()
);

create index enquiry_replies_enquiry_idx
  on enquiry_replies (enquiry_id, created_at);

alter table enquiry_replies enable row level security;

create policy "admins read enquiry replies"
  on enquiry_replies for select
  using (is_admin());

create policy "admins write enquiry replies"
  on enquiry_replies for insert
  with check (is_admin());
