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
