"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { useI18n } from "@/i18n/client";
import { useCart } from "@/store/cart";
import { formatNaira } from "@/lib/utils";

export function CartTable() {
  const { lines, subtotal, isHydrated, remove, setQuantity } = useCart();
  const { t } = useI18n();

  if (!isHydrated) {
    return <p className="text-muted py-24 text-sm">{t.bag.loading}</p>;
  }

  if (lines.length === 0) {
    return (
      <div className="border-line border-y py-28 text-center">
        <p className="text-muted text-sm">{t.bag.empty}</p>
        <ButtonLink href="/shop" variant="outline" className="mt-7">
          {t.bag.browse}
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="grid gap-14 lg:grid-cols-[1.6fr_1fr]">
      <ul className="border-line border-t">
        {lines.map((line) => (
          <li
            key={line.variantId}
            className="border-line flex gap-6 border-b py-8"
          >
            <Link
              href={`/shop/${line.slug}`}
              className="bg-surface relative h-40 w-28 shrink-0 overflow-hidden"
            >
              {line.image && (
                <Image
                  src={line.image}
                  alt={line.name}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              )}
            </Link>

            <div className="flex flex-1 flex-col justify-between">
              <div>
                <Link
                  href={`/shop/${line.slug}`}
                  className="hover:text-cream-soft font-sans text-base transition-colors"
                >
                  {line.name}
                </Link>
                <p className="text-muted mt-1.5 text-xs">{line.variantLabel}</p>
                <p className="text-cream-soft mt-3 text-sm tabular-nums">
                  {formatNaira(line.unitPrice)}
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="border-line flex items-center border">
                  <button
                    type="button"
                    aria-label={t.bag.decrease}
                    onClick={() =>
                      setQuantity(line.variantId, line.quantity - 1)
                    }
                    className="text-cream-soft hover:text-cream px-3 py-2"
                  >
                    <Minus size={13} strokeWidth={1.5} />
                  </button>
                  <span className="min-w-8 text-center text-xs tabular-nums">
                    {line.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label={t.bag.increase}
                    onClick={() =>
                      setQuantity(line.variantId, line.quantity + 1)
                    }
                    className="text-cream-soft hover:text-cream px-3 py-2"
                  >
                    <Plus size={13} strokeWidth={1.5} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => remove(line.variantId)}
                  className="text-muted hover:text-danger text-[0.65rem] tracking-[0.16em] uppercase transition-colors"
                >
                  {t.bag.remove}
                </button>
              </div>
            </div>

            <p className="shrink-0 text-sm tabular-nums">
              {formatNaira(line.unitPrice * line.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <aside className="bg-surface h-fit p-8 lg:sticky lg:top-32">
        <h2 className="font-sans text-[0.7rem] tracking-[0.24em] uppercase">
          {t.bag.summary}
        </h2>
        <div className="mt-7 flex justify-between text-sm">
          <span className="text-cream-soft">{t.bag.subtotal}</span>
          <span className="tabular-nums">{formatNaira(subtotal)}</span>
        </div>
        <p className="text-muted mt-3 text-xs">{t.bag.shippingNote}</p>
        <ButtonLink href="/checkout" size="lg" className="mt-8 w-full">
          {t.bag.checkout}
        </ButtonLink>
      </aside>
    </div>
  );
}
