"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/client";
import { fill } from "@/i18n/config";
import { useCart } from "@/store/cart";
import { cn, formatNaira, variantLabel } from "@/lib/utils";
import type { ProductWithDetail } from "@/types";

export function AddToCart({ product }: { product: ProductWithDetail }) {
  const { add } = useCart();
  const { t } = useI18n();

  const variants = product.product_variants.filter((v) => v.is_active);
  const [selectedId, setSelectedId] = useState(variants[0]?.id ?? "");

  const selected = variants.find((v) => v.id === selectedId);
  const price = selected?.price_override ?? product.base_price;
  const isSoldOut = !selected || selected.stock < 1;

  if (variants.length === 0) {
    return (
      <div className="border-line text-muted mt-10 border-y py-6 text-sm">
        {t.product.unavailable}
      </div>
    );
  }

  return (
    <div className="mt-10">
      <p className="text-2xl tabular-nums">{formatNaira(price)}</p>

      {variants.length > 1 && (
        <fieldset className="mt-9">
          <legend className="text-muted text-[0.65rem] tracking-[0.24em] uppercase">
            {t.product.select}
          </legend>
          <div className="mt-4 flex flex-wrap gap-2">
            {variants.map((variant) => {
              const soldOut = variant.stock < 1;
              return (
                <button
                  key={variant.id}
                  type="button"
                  disabled={soldOut}
                  onClick={() => setSelectedId(variant.id)}
                  className={cn(
                    "border px-4 py-2.5 text-xs transition-colors",
                    variant.id === selectedId
                      ? "border-cream bg-navy text-cream"
                      : "border-line text-cream-soft hover:border-cream",
                    soldOut && "text-muted cursor-not-allowed line-through",
                  )}
                >
                  {variantLabel(variant.color, variant.size)}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      <Button
        size="lg"
        disabled={isSoldOut}
        className="mt-9 w-full sm:w-auto"
        onClick={() => {
          if (!selected) return;
          add({
            productId: product.id,
            variantId: selected.id,
            slug: product.slug,
            name: product.name,
            variantLabel: variantLabel(selected.color, selected.size),
            unitPrice: price,
            quantity: 1,
            image: product.product_images[0]?.url ?? null,
          });
        }}
      >
        {isSoldOut ? t.product.soldOut : t.product.addToBag}
      </Button>

      {selected && selected.stock > 0 && selected.stock <= 3 && (
        <p className="text-danger mt-4 text-xs">
          {fill(t.product.onlyLeft, { count: selected.stock })}
        </p>
      )}
    </div>
  );
}
