import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { intlTag } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/server";
import { stageTone } from "@/lib/fulfilment";
import { createClient } from "@/lib/supabase/server";
import { formatNaira } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getDictionary();
  return { title: meta.orders, robots: { index: false } };
}

export default async function OrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in?next=/account/orders");

  const [locale, { orders: t }] = await Promise.all([
    getLocale(),
    getDictionary(),
  ]);
  const dateTag = intlTag(locale);

  // Row level security scopes this to the signed-in user; no filter needed,
  // but it is stated anyway so the intent survives a policy change.
  const { data: orders } = await supabase
    .from("orders")
    .select(
      "id, reference, total, status, payment_status, created_at, order_items(*), order_events(*)",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .order("created_at", { referencedTable: "order_events", ascending: true });

  if (!orders || orders.length === 0) {
    return (
      <Container className="py-16 md:py-24">
        <h1 className="text-4xl md:text-6xl">{t.title}</h1>
        <div className="border-line mt-14 border-y py-24 text-center">
          <p className="text-muted text-sm">{t.none}</p>
          <ButtonLink href="/shop" variant="outline" className="mt-7">
            {t.browse}
          </ButtonLink>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-16 md:py-24">
      <h1 className="text-4xl md:text-6xl">{t.title}</h1>

      <ul className="border-line mt-14 border-t">
        {orders.map((order) => (
          <li key={order.id} className="border-line border-b py-8">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <div>
                <p className="font-sans text-sm">{order.reference}</p>
                <p className="text-muted mt-1.5 text-xs">
                  {new Date(order.created_at).toLocaleDateString(dateTag, {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm tabular-nums">
                  {formatNaira(order.total)}
                </p>
                <p
                  className={`mt-1.5 text-[0.65rem] tracking-[0.16em] uppercase ${stageTone(order.status)}`}
                >
                  {t.stages[order.status]}
                </p>
              </div>
            </div>

            {/*
              The most recent thing the atelier said about this order. A status
              tells a customer where their cloth is; a note tells them what
              happened to it, which is what someone waiting on a wedding date
              actually wants to read.
            */}
            {(() => {
              const spoken = [...order.order_events]
                .reverse()
                .find((event) => event.note);

              return spoken ? (
                <p className="border-gold/30 text-cream-soft mt-5 border-l-2 pl-4 text-sm leading-relaxed">
                  {spoken.note}
                  <span className="text-muted mt-1 block text-xs">
                    {new Date(spoken.created_at).toLocaleDateString(dateTag, {
                      day: "numeric",
                      month: "long",
                    })}
                  </span>
                </p>
              ) : null;
            })()}

            <ul className="text-cream-soft mt-5 space-y-1.5 text-sm">
              {order.order_items.map((item) => (
                <li key={item.id}>
                  {item.name_snapshot}
                  {item.variant_label && (
                    <span className="text-muted"> · {item.variant_label}</span>
                  )}
                  <span className="text-muted"> × {item.quantity}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </Container>
  );
}
