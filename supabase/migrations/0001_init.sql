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
