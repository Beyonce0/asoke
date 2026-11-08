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
