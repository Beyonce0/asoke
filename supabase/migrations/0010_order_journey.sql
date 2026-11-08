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
