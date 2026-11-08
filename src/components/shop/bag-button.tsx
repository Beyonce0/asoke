"use client";

import { Plus } from "lucide-react";

import { useI18n } from "@/i18n/client";
import { fill } from "@/i18n/config";
import { useCart } from "@/store/cart";
import { cn, variantLabel } from "@/lib/utils";
import type { ProductVariant, ProductWithVariants } from "@/types";

/*
 * Quick-add, for the places that show a piece without room to choose from it.
 *
 * A cart line is keyed by variant, so something has to be picked. This takes
 * the first one in stock, and the caller is expected to price from the same
 * variant — hence `sellableVariant` being exported and the variant coming in
 * as a prop rather than being found in here. A button that adds one thing
 * while the label above it quotes the price of another is the bug this shape
 * is built to make impossible.
 *
 * A PLUS, NEVER A BAG. The bag glyph already means one thing on this site — the
 * one in the header opens the bag you have — and a second meaning for the same
 * mark turns "put this in" into "go and look". The plus only ever adds.
 *
 * Two shapes for two amounts of room: `showLabel` spells it out where a card
 * has the width for it, and the bare round button carries the same sentence in
 * its `aria-label` where it does not.
 *
 * The drawer opens on add, which is the confirmation — there is no need for
 * the button to flash a tick of its own.
 */

/** The first variant that can actually be sold, or null if none can. */
export function sellableVariant(product: ProductWithVariants) {
  return (
    product.product_variants.find(
      (variant) => variant.is_active && variant.stock > 0,
    ) ?? null
  );
}

export function BagButton({
  product,
  variant,
  showLabel = false,
  className,
}: {
  product: ProductWithVariants;
  variant: ProductVariant | null;
  /** Spell out "Add to bag" beside the plus. For cards with room. */
  showLabel?: boolean;
  className?: string;
}) {
  const { add } = useCart();
  const { t } = useI18n();
  const soldOut = !variant;

  return (
    <button
      type="button"
      disabled={soldOut}
      aria-label={fill(soldOut ? t.product.soldOutNamed : t.product.addNamed, {
        name: product.name,
      })}
      onClick={() => {
        if (!variant) return;

        add({
          productId: product.id,
          variantId: variant.id,
          slug: product.slug,
          name: product.name,
          variantLabel: variantLabel(variant.color, variant.size),
          // Display only. Checkout re-reads every price from the database.
          unitPrice: variant.price_override ?? product.base_price,
          quantity: 1,
          image: product.product_images[0]?.url ?? null,
        });
      }}
      className={cn(
        "transition-colors duration-300",
        showLabel
          ? "inline-flex items-center gap-2 border-b pb-1 text-[0.6rem] tracking-[0.24em] uppercase"
          : "grid h-10 w-10 shrink-0 place-items-center rounded-full border",
        soldOut
          ? "border-line text-muted cursor-not-allowed"
          : showLabel
            ? "text-cream hover:text-gold border-current"
            : // Charcoal on gold, never cream — cream on gold is 2.2:1.
              "border-gold/40 text-gold hover:bg-gold hover:text-charcoal focus-visible:bg-gold focus-visible:text-charcoal",
        className,
      )}
    >
      <Plus size={showLabel ? 12 : 16} strokeWidth={1.75} aria-hidden />
      {showLabel && (soldOut ? t.product.soldOut : t.product.addToBag)}
    </button>
  );
}
