import Link from "next/link";

import { stageFor, stageTone } from "@/lib/fulfilment";
import { getAdminOrders } from "@/lib/queries";
import { formatNaira } from "@/lib/utils";
import type { PaymentStatus } from "@/types";

/*
 * Every order the shop has taken.
 *
 * Two states, kept visually apart on purpose: payment is what Paystack says,
 * fulfilment is what the atelier has done. Conflating them is how an unpaid
 * order gets posted.
 */

export const metadata = { title: "Orders" };

const PAYMENT: Record<PaymentStatus, string> = {
  pending: "text-muted",
  paid: "text-success",
  failed: "text-danger",
  refunded: "text-cream-soft",
};

export default async function AdminOrders() {
  const orders = await getAdminOrders();

  const toShip = orders.filter(
    (order) => order.payment_status === "paid" && order.status === "processing",
  ).length;

  return (
    <div className="px-5 py-10 md:px-12 md:py-12">
      <header>
        <h1 className="text-[clamp(1.4rem,5vw,2.2rem)]">Orders</h1>
        <p className="text-muted mt-2 text-sm">
          {orders.length} in total
          {toShip > 0 && ` · ${toShip} paid and waiting to ship`}
        </p>
      </header>

      {orders.length === 0 ? (
        <p className="border-line text-muted mt-10 rounded-lg border border-dashed px-6 py-20 text-center text-sm">
          No orders yet. They appear the moment Paystack settles one.
        </p>
      ) : (
        <>
          <ul className="mt-8 space-y-3 sm:hidden">
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="border-line bg-surface flex items-start justify-between gap-4 rounded-lg border p-4"
                >
                  <span className="min-w-0">
                    <span className="text-cream-soft block truncate text-sm">
                      {order.email}
                    </span>
                    <span className="text-muted mt-1 block truncate font-mono text-[0.65rem]">
                      {order.reference}
                    </span>
                  </span>

                  <span className="shrink-0 text-right">
                    <span className="text-cream block text-sm tabular-nums">
                      {formatNaira(order.total)}
                    </span>
                    <span
                      className={`mt-1 block text-[0.6rem] uppercase ${PAYMENT[order.payment_status]}`}
                    >
                      {order.payment_status}
                    </span>
                    <span
                      className={`block text-[0.6rem] uppercase ${stageTone(order.status)}`}
                    >
                      {stageFor(order.status).label}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="border-line mt-8 hidden overflow-x-auto rounded-lg border sm:block">
            <table className="w-full min-w-[44rem] text-left text-sm">
              <thead className="border-line text-muted border-b">
                <tr className="[&>th]:px-5 [&>th]:py-3.5 [&>th]:text-[0.6rem] [&>th]:font-normal [&>th]:tracking-[0.2em] [&>th]:uppercase">
                  <th>Reference</th>
                  <th>Customer</th>
                  <th>Placed</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Fulfilment</th>
                </tr>
              </thead>

              <tbody className="[&>tr:not(:last-child)]:border-line [&>tr:not(:last-child)]:border-b">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-cream/[0.03] [&>td]:px-5 [&>td]:py-3.5"
                  >
                    <td>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-cream-soft hover:text-gold font-mono text-xs transition-colors"
                      >
                        {order.reference}
                      </Link>
                    </td>
                    <td className="text-cream-soft">{order.email}</td>
                    <td className="text-muted text-xs">
                      {new Date(order.created_at).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                    <td className="text-cream tabular-nums">
                      {formatNaira(order.total)}
                    </td>
                    <td
                      className={`text-xs uppercase ${PAYMENT[order.payment_status]}`}
                    >
                      {order.payment_status}
                    </td>
                    <td
                      className={`text-xs uppercase ${stageTone(order.status)}`}
                    >
                      {stageFor(order.status).label}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
