"use client";

import { ProductCard } from "@/components/shop/product-card";
import { Reveal } from "@/components/motion/reveal";
import { useI18n } from "@/i18n/client";
import type { ProductWithVariants } from "@/types";

export function ProductGrid({
  products,
  emptyMessage,
}: {
  products: ProductWithVariants[];
  emptyMessage?: string;
}) {
  const { t } = useI18n();

  if (products.length === 0) {
    return (
      <div className="border-line text-muted border-y py-24 text-center text-sm">
        {emptyMessage ?? t.product.emptyGrid}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => (
        <Reveal key={product.id} delay={(index % 3) * 0.08}>
          <ProductCard product={product} priority={index < 3} />
        </Reveal>
      ))}
    </div>
  );
}
