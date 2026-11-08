"use client";

import Image from "next/image";
import Link from "next/link";

import { BagButton, sellableVariant } from "@/components/shop/bag-button";
import { useI18n } from "@/i18n/client";
import { formatNaira } from "@/lib/utils";
import type { ProductWithVariants } from "@/types";

/*
 * A card in a grid — the shop index, and "this season" on the homepage.
 *
 * It carries a bag button, so it is an `<article>` with two links rather than
 * one link wrapping everything: a button nested inside an anchor is invalid,
 * and the browser is free to do whatever it likes with the click.
 *
 * The picture is a click target for a pointer and nothing else; the accessible
 * link is the name, so a screen reader announces one link per card instead of
 * two to the same place.
 */
export function ProductCard({
  product,
  priority = false,
}: {
  product: ProductWithVariants;
  priority?: boolean;
}) {
  const { t } = useI18n();
  const image = product.product_images?.[0];

  // The same variant answers both questions on the card: what the button adds,
  // and what the price says it costs.
  const variant = sellableVariant(product);
  const href = `/shop/${product.slug}`;

  return (
    <article className="group">
      {/* 2:3 matches the atelier photographs, so nothing is cropped. */}
      <div className="bg-surface relative aspect-[2/3] overflow-hidden">
        {image ? (
          <Image
            src={image.url}
            alt={image.alt ?? product.name}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="text-muted flex h-full items-center justify-center text-[0.65rem] tracking-[0.2em] uppercase">
            {t.product.imageComing}
          </div>
        )}

        <Link
          href={href}
          aria-hidden
          tabIndex={-1}
          className="absolute inset-0"
        />
      </div>

      <div className="pt-4">
        <h3 className="font-sans text-sm font-normal">
          <Link href={href} className="hover:text-gold transition-colors">
            {product.name}
          </Link>
        </h3>

        <p className="text-cream-soft mt-1.5 text-sm tabular-nums">
          {formatNaira(variant?.price_override ?? product.base_price)}
        </p>

        {/*
          Under the price rather than beside the name: a card is only as wide
          as a third of the grid, and "Òwú Cream Bridal Set" alongside "Add to
          bag" wraps into a mess at the first breakpoint down. Sold-out pieces
          say so here instead — the button is the only place that state needs
          to be stated once it can speak.
        */}
        <BagButton
          product={product}
          variant={variant}
          showLabel
          className="mt-3"
        />
      </div>
    </article>
  );
}
