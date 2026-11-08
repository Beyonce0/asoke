import Link from "next/link";
import { notFound } from "next/navigation";

import { OrderStatusPicker } from "@/components/admin/order-status";
import { stageFor, stageTone } from "@/lib/fulfilment";
import { getAdminOrder } from "@/lib/queries";
import { formatNaira } from "@/lib/utils";

/*
 * One order, as a receipt.
 *
 * The lines are snapshots: `name_snapshot` and `unit_price` are what the piece
 * was called and what it cost on the day, not what it is called now. That is
 * why an order still reads correctly after a product is renamed, repriced, or
 * deleted outright.
 */

/** The shipping address is jsonb, so it arrives as whatever was written. */
function addressLines(value: unknown): string[] {
  if (!value || typeof value !== "object") return [];

  const address = value as Record<string, unknown>;
  const order = [
    "full_name",
    "phone",
    "line1",
    "line2",
    "city",
    "state",
    "country",
  ];

  return order
    .map((key) => address[key])
    .filter((line): line is string => typeof line === "string" && line !== "");
}

export default async function OrderDetail({
  params,
}: PageProps<"/admin/orders/[id]">) {
  const { id } = await params;
  const order = await getAdminOrder(id);

  if (!order) notFound();

  const address = addressLines(order.shipping_address);

  return (
    <div className="px-5 py-10 md:px-12 md:py-12">
      <nav className="text-muted mb-8 text-[0.6rem] tracking-[0.2em] uppercase">
        <Link href="/admin/orders" className="hover:text-cream">
          Orders
        </Link>
        <span className="mx-2">/</span>
        <span className="text-cream-soft font-mono">{order.reference}</span>
      </nav>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-mono text-[clamp(1.1rem,4vw,1.6rem)]">
            {order.reference}
          </h1>
          <a
            href={`mailto:${order.email}`}
            className="text-gold mt-2 inline-block text-sm hover:underline"
          >
            {order.email}
          </a>
        </div>

        <div className="text-right">
          <p className="text-cream text-xl tabular-nums">
            {formatNaira(order.total)}
          </p>
          <p
            className={`mt-1 text-[0.6rem] tracking-[0.2em] uppercase ${
              order.payment_status === "paid" ? "text-success" : "text-muted"
            }`}
          >
            {order.payment_status}
            {order.paid_at &&
              ` · ${new Date(order.paid_at).toLocaleDateString("en-NG", {
                day: "numeric",
                month: "short",
              })}`}
          </p>
        </div>
      </header>

      <div className="border-line bg-surface mt-10 rounded-lg border p-6">
        <p className="text-muted text-[0.6rem] tracking-[0.24em] uppercase">
          Fulfilment
        </p>
        <div className="mt-4">
          <OrderStatusPicker
            id={order.id}
            status={order.status}
            isBespoke={order.isBespoke}
          />
        </div>
        <p className="text-muted mt-4 text-xs">
          Payment is settled by Paystack and cannot be changed from here.
        </p>

        {order.order_events.length > 0 && (
          <div className="border-line mt-6 border-t pt-6">
            <p className="text-muted text-[0.6rem] tracking-[0.24em] uppercase">
              History
            </p>

            {/*
              Oldest first, the way a story is told. Every row here was written
              by set_order_status() — nothing can appear in it without the
              status having actually moved, and nothing can be edited after.
            */}
            <ol className="mt-4 space-y-3">
              {order.order_events.map((event) => (
                <li key={event.id} className="flex gap-4 text-sm">
                  <span className="text-muted w-28 shrink-0 text-xs tabular-nums">
                    {new Date(event.created_at).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>

                  <span className="min-w-0">
                    <span
                      className={`block text-[0.65rem] tracking-[0.16em] uppercase ${stageTone(event.status)}`}
                    >
                      {stageFor(event.status).label}
                    </span>
                    {event.note && (
                      <span className="text-cream-soft mt-1 block text-xs leading-relaxed">
                        {event.note}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_18rem]">
        <section>
          <h2 className="text-muted text-[0.55rem] tracking-[0.22em] uppercase">
            What was ordered
          </h2>

          <ul className="border-line mt-4 divide-y divide-[var(--color-line)] rounded-lg border">
            {order.order_items.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-4 p-4"
              >
                <div className="min-w-0">
                  <p className="text-cream text-sm">{item.name_snapshot}</p>
                  {item.variant_label && (
                    <p className="text-muted mt-1 text-xs">
                      {item.variant_label}
                    </p>
                  )}
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-cream-soft text-sm tabular-nums">
                    {formatNaira(item.unit_price * item.quantity)}
                  </p>
                  <p className="text-muted mt-1 text-xs tabular-nums">
                    {item.quantity} × {formatNaira(item.unit_price)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <dl className="mt-5 ml-auto max-w-xs space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="text-cream-soft tabular-nums">
                {formatNaira(order.subtotal)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd className="text-cream-soft tabular-nums">
                {formatNaira(order.shipping_fee)}
              </dd>
            </div>
            <div className="border-line flex justify-between border-t pt-2">
              <dt className="text-cream">Total</dt>
              <dd className="text-cream tabular-nums">
                {formatNaira(order.total)}
              </dd>
            </div>
          </dl>
        </section>

        <section>
          <h2 className="text-muted text-[0.55rem] tracking-[0.22em] uppercase">
            Ship to
          </h2>

          {address.length > 0 ? (
            <address className="text-cream-soft mt-4 text-sm leading-relaxed not-italic">
              {address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          ) : (
            <p className="text-muted mt-4 text-sm">No address recorded.</p>
          )}

          {order.paystack_reference && (
            <>
              <h2 className="text-muted mt-8 text-[0.55rem] tracking-[0.22em] uppercase">
                Paystack
              </h2>
              <p className="text-cream-soft mt-3 font-mono text-xs break-all">
                {order.paystack_reference}
              </p>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
