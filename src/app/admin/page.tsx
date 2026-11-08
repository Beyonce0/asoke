import Link from "next/link";

import { isConfigured } from "@/lib/env";
import { getAdminOverview } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
import { cn, formatNaira } from "@/lib/utils";

/*
 * The dashboard. Everything on it is a live count — nothing is stubbed, so an
 * empty shop reads as an empty shop rather than as a broken screen.
 *
 * Sections that do not exist yet simply are not here. A card counting
 * appointments before there is an appointments table would be a lie with a
 * number on it.
 */

function greeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const STATUS_TONE: Record<string, string> = {
  pending: "text-muted",
  processing: "text-gold",
  shipped: "text-cream",
  delivered: "text-success",
  cancelled: "text-danger",
};

/** Whoever is signed in, by first name. Nobody is, in preview. */
async function adminName() {
  if (!isConfigured) return "Admin";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return "Admin";

  const { data } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  return data?.full_name?.split(" ")[0] ?? "Admin";
}

export default async function AdminDashboard() {
  const [{ products, drafts, orders, awaiting, paid, recent }, name] =
    await Promise.all([getAdminOverview(), adminName()]);

  const cards = [
    {
      label: "Products",
      value: String(products),
      note: drafts > 0 ? `${drafts} in draft` : "All published",
    },
    {
      label: "Orders",
      value: String(orders),
      note:
        awaiting > 0 ? `${awaiting} awaiting fulfilment` : "Nothing to ship",
    },
    { label: "Paid to date", value: formatNaira(paid), note: "Settled orders" },
  ];

  return (
    <div className="px-5 py-10 md:px-12 md:py-12">
      <header>
        <h1 className="text-[clamp(1.4rem,5vw,2.4rem)]">
          {greeting(new Date().getHours())}, {name}.
        </h1>
        <p className="text-muted mt-2 text-sm">Here is the atelier today.</p>
      </header>

      {/*
        Two across on a phone rather than one. These are short numbers, and a
        single column would push the orders below three screens of scrolling.
        The third card takes the full width of the second row on its own.
      */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-10 lg:grid-cols-3">
        {cards.map((card, index) => (
          <div
            key={card.label}
            className={cn(
              "border-line bg-surface rounded-lg border p-4 sm:p-6",
              index === 2 && "col-span-2 lg:col-span-1",
            )}
          >
            <p className="text-muted text-[0.55rem] tracking-[0.24em] uppercase sm:text-[0.6rem] sm:tracking-[0.28em]">
              {card.label}
            </p>
            <p className="text-cream mt-3 text-2xl tabular-nums sm:mt-4 sm:text-3xl">
              {card.value}
            </p>
            <p className="text-cream-soft mt-1.5 text-xs sm:mt-2">
              {card.note}
            </p>
          </div>
        ))}
      </div>

      <section className="mt-12 md:mt-14">
        <h2 className="font-sans text-[0.65rem] tracking-[0.28em] uppercase">
          Recent orders
        </h2>

        {recent.length === 0 ? (
          <p className="border-line text-muted mt-5 rounded-lg border border-dashed px-6 py-12 text-center text-sm">
            No orders yet. They will appear here the moment Paystack settles
            one.
          </p>
        ) : (
          <>
            {/*
              A phone gets a stack, not a table pushed sideways. Same five
              facts, arranged for a column: who and what on the left, money and
              state on the right, where a thumb can reach them.
            */}
            <ul className="mt-5 space-y-3 sm:hidden">
              {recent.map((order) => (
                <li
                  key={order.id}
                  className="border-line bg-surface flex items-start justify-between gap-4 rounded-lg border p-4"
                >
                  <div className="min-w-0">
                    <p className="text-cream-soft truncate text-sm">
                      {order.email}
                    </p>
                    <p className="text-muted mt-1 truncate font-mono text-[0.65rem]">
                      {order.reference}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-cream text-sm tabular-nums">
                      {formatNaira(order.total)}
                    </p>
                    <p
                      className={`mt-1 text-[0.6rem] uppercase ${STATUS_TONE[order.status] ?? "text-muted"}`}
                    >
                      {order.status}
                    </p>
                    <p
                      className={
                        order.payment_status === "paid"
                          ? "text-success text-[0.6rem] uppercase"
                          : "text-muted text-[0.6rem] uppercase"
                      }
                    >
                      {order.payment_status}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-line mt-5 hidden overflow-x-auto rounded-lg border sm:block">
              <table className="w-full min-w-[38rem] text-left text-sm">
                <thead className="border-line text-muted border-b">
                  <tr className="[&>th]:px-5 [&>th]:py-3.5 [&>th]:text-[0.6rem] [&>th]:font-normal [&>th]:tracking-[0.2em] [&>th]:uppercase">
                    <th>Reference</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Payment</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody className="[&>tr:not(:last-child)]:border-line [&>tr:not(:last-child)]:border-b">
                  {recent.map((order) => (
                    <tr key={order.id} className="[&>td]:px-5 [&>td]:py-4">
                      <td className="text-cream-soft font-mono text-xs">
                        {order.reference}
                      </td>
                      <td className="text-cream-soft">{order.email}</td>
                      <td className="text-cream tabular-nums">
                        {formatNaira(order.total)}
                      </td>
                      <td
                        className={
                          order.payment_status === "paid"
                            ? "text-success text-xs uppercase"
                            : "text-muted text-xs uppercase"
                        }
                      >
                        {order.payment_status}
                      </td>
                      <td
                        className={`text-xs uppercase ${STATUS_TONE[order.status] ?? "text-muted"}`}
                      >
                        {order.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      <p className="text-muted mt-12 text-xs leading-relaxed">
        Products, collections and the media library land next. Until then the
        catalogue is still read from{" "}
        <Link href="/shop" className="text-gold hover:underline">
          the storefront
        </Link>{" "}
        only.
      </p>
    </div>
  );
}
