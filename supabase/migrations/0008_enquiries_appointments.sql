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
