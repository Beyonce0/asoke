"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/client";
import { fill } from "@/i18n/config";
import { useCart } from "@/store/cart";
import { shippingFor } from "@/lib/shipping";
import { formatNaira } from "@/lib/utils";
import { startCheckout, type CheckoutState } from "./actions";

const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

const fieldClass =
  "border-line bg-transparent focus:border-cream h-12 w-full border px-4 text-sm outline-none transition-colors";

function SubmitButton() {
  const { pending } = useFormStatus();
  const { t } = useI18n();

  return (
    <Button type="submit" size="lg" disabled={pending} className="mt-8 w-full">
      {pending ? t.checkout.opening : t.checkout.pay}
    </Button>
  );
}

export function CheckoutForm() {
  const { lines, subtotal, isHydrated } = useCart();
  const { t } = useI18n();

  /*
   * Which state the cloth is going to, held here rather than left to the DOM,
   * because the delivery charge depends on it and the customer must see the
   * total change as they choose. Quoting a subtotal and charging a total is
   * how a shop loses an order at the Paystack screen.
   */
  const [deliverTo, setDeliverTo] = useState("");

  const shipping = deliverTo ? shippingFor(deliverTo) : null;
  const total = subtotal + (shipping ?? 0);
  const [state, formAction] = useActionState<CheckoutState, FormData>(
    startCheckout,
    {},
  );

  if (!isHydrated) {
    return <p className="text-muted py-24 text-sm">{t.bag.loading}</p>;
  }

  if (lines.length === 0) {
    return (
      <div className="border-line border-y py-24 text-center">
        <p className="text-muted text-sm">{t.bag.empty}</p>
        <Link
          href="/shop"
          className="text-cream mt-4 inline-block text-xs tracking-[0.2em] uppercase underline underline-offset-4"
        >
          {t.bag.browse}
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid gap-14 lg:grid-cols-[1.2fr_1fr]">
      {/* Prices are recomputed server side; this only names what to buy. */}
      <input
        type="hidden"
        name="lines"
        value={JSON.stringify(
          lines.map(({ variantId, quantity }) => ({ variantId, quantity })),
        )}
      />

      <div>
        <h2 className="font-sans text-[0.7rem] tracking-[0.24em] uppercase">
          {t.checkout.contact}
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder={t.checkout.email}
            className={`${fieldClass} sm:col-span-2`}
          />
          <input
            name="fullName"
            required
            autoComplete="name"
            placeholder={t.checkout.fullName}
            className={fieldClass}
          />
          <input
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder={t.checkout.phone}
            className={fieldClass}
          />
        </div>

        <h2 className="mt-12 font-sans text-[0.7rem] tracking-[0.24em] uppercase">
          {t.checkout.delivery}
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <input
            name="line1"
            required
            autoComplete="address-line1"
            placeholder={t.checkout.street}
            className={`${fieldClass} sm:col-span-2`}
          />
          <input
            name="line2"
            autoComplete="address-line2"
            placeholder={t.checkout.apartment}
            className={`${fieldClass} sm:col-span-2`}
          />
          <input
            name="city"
            required
            autoComplete="address-level2"
            placeholder={t.checkout.city}
            className={fieldClass}
          />
          <select
            name="state"
            required
            value={deliverTo}
            onChange={(event) => setDeliverTo(event.target.value)}
            className={fieldClass}
          >
            <option value="" disabled>
              {t.checkout.state}
            </option>
            {NIGERIAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
      </div>

      <aside className="bg-surface h-fit p-8 lg:sticky lg:top-32">
        <h2 className="font-sans text-[0.7rem] tracking-[0.24em] uppercase">
          {t.checkout.yourOrder}
        </h2>

        <ul className="mt-6 space-y-4">
          {lines.map((line) => (
            <li
              key={line.variantId}
              className="flex justify-between gap-4 text-sm"
            >
              <span className="text-cream-soft">
                {line.name}
                <span className="text-muted"> × {line.quantity}</span>
              </span>
              <span className="shrink-0 tabular-nums">
                {formatNaira(line.unitPrice * line.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <dl className="border-line mt-6 space-y-3 border-t pt-5 text-sm">
          <div className="flex justify-between">
            <dt className="text-cream-soft">{t.checkout.subtotal}</dt>
            <dd className="tabular-nums">{formatNaira(subtotal)}</dd>
          </div>

          <div className="flex justify-between">
            <dt className="text-cream-soft">
              {t.checkout.delivery}
              {deliverTo && <span className="text-muted"> · {deliverTo}</span>}
            </dt>
            <dd className="tabular-nums">
              {shipping === null ? (
                <span className="text-muted">{t.checkout.chooseState}</span>
              ) : (
                formatNaira(shipping)
              )}
            </dd>
          </div>

          {/*
            The number Paystack will ask for. Held back until a state is
            chosen rather than guessed at, because a total that changes after
            you have read it is worse than one that waits.
          */}
          <div className="border-line flex justify-between border-t pt-3 text-base">
            <dt>{t.checkout.total}</dt>
            <dd className="tabular-nums">
              {shipping === null ? (
                <span className="text-muted text-sm">
                  {fill(t.checkout.plusDelivery, {
                    amount: formatNaira(subtotal),
                  })}
                </span>
              ) : (
                formatNaira(total)
              )}
            </dd>
          </div>
        </dl>

        <p className="text-muted mt-4 text-xs leading-relaxed">
          {t.checkout.deliveryNote}
        </p>

        {state.error && (
          <p role="alert" className="text-danger mt-6 text-sm">
            {state.error}
          </p>
        )}

        <SubmitButton />

        <p className="text-muted mt-4 text-center text-[0.65rem]">
          {t.checkout.redirectNote}
        </p>
      </aside>
    </form>
  );
}
