"use client";

import Image from "next/image";
import Link from "next/link";

import { BagButton, sellableVariant } from "@/components/shop/bag-button";
import { CardStack } from "@/components/ui/card-stack";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { useI18n } from "@/i18n/client";
import { formatNaira } from "@/lib/utils";
import type { ProductWithVariants } from "@/types";

/*
 * The pieces, as an interactive stack.
 *
 * The card design lives here; the interaction lives in `CardStack`, which is
 * deliberately unaware of what it is holding so the same behaviour can be
 * dropped around a lookbook or a collection index without being rewritten.
 *
 * Everything on a card comes from the row — picture, name, description, price,
 * stock. Nothing is hard-coded, so the strip is whatever the shop has
 * published, in the order it published it.
 *
 * THE DIALOGUE — pointing at a card opens a plate beside it: rule-led lines,
 * the way a museum caption sits next to the work rather than on it. Beside,
 * not below, because the arch is already tall; anything hung under it pushes
 * the caption off the fold.
 *
 * It opens toward whichever side of the viewport has room, reading
 * `data-stack-side` off the wrapper `CardStack` puts around each card. Without
 * that the panel on the rightmost card would open into the clipped edge of
 * the strip and be sliced in half.
 *
 * The `beside:` variant (see `globals.css`) is the whole gate — wide enough,
 * and a pointer to open it with. Everywhere else the same content sits in
 * normal flow under the arch, always visible, because a screen that cannot
 * hover would otherwise never show it.
 */

/*
 * An arch rather than a rectangle. It rhymes with the courtyard doorway and
 * stair in the hero photograph, and it is the traditional crop for a standing
 * figure — the curve sits where the head has room and the shoulders fall away.
 *
 * Elliptical radii, not a circle: `50% 38%` means half the width across but
 * only 38% of the height down, so the arch stays tall and narrow instead of
 * turning into a dome and eating a third of the picture.
 */
const ARCH = {
  borderTopLeftRadius: "50% 38%",
  borderTopRightRadius: "50% 38%",
  borderBottomLeftRadius: "0.25rem",
  borderBottomRightRadius: "0.25rem",
} as const;

export function Pieces({ products }: { products: ProductWithVariants[] }) {
  const { t } = useI18n();

  if (products.length === 0) return null;

  return (
    <section
      id="pieces"
      aria-label={t.home.pieces.label}
      className="bg-charcoal relative w-full py-24 md:py-36"
    >
      <Container>
        <Reveal>
          <p className="text-gold text-[0.65rem] tracking-[0.32em] uppercase">
            {t.home.pieces.eyebrow}
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="mt-6 max-w-2xl text-[clamp(1.9rem,4.4vw,3.5rem)] leading-tight">
            {t.home.pieces.title}
          </h2>
        </Reveal>
      </Container>

      <div className="mt-10 md:mt-16">
        <CardStack ariaLabel={t.home.pieces.label}>
          {products.map((product) => {
            const image = product.product_images[0];
            // One variant answers both questions on the card: what the bag
            // button adds, and what the price says it costs.
            const variant = sellableVariant(product);
            const href = `/shop/${product.slug}`;

            return (
              // `relative` is load-bearing: the dialogue beside it is
              // positioned against this, and without it the panel would anchor
              // to whatever ancestor happened to be positioned.
              <article key={product.id} className="group relative block">
                <div
                  className="bg-surface border-gold/15 group-hover:border-gold/45 relative aspect-[2/3] overflow-hidden border transition-colors duration-500"
                  style={ARCH}
                >
                  {image && (
                    <Image
                      src={image.url}
                      alt={image.alt ?? product.name}
                      fill
                      sizes="(min-width: 1024px) 352px, (min-width: 640px) 300px, 264px"
                      className="object-cover"
                    />
                  )}

                  {/* Sinks the foot of the picture on hover, so the card
                      darkens into the plate instead of ending at a hard
                      edge. */}
                  <div
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-2/5 opacity-0 transition-opacity duration-500 group-focus-within:opacity-100 group-hover:opacity-100"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(13,12,12,0.85), transparent)",
                    }}
                  />

                  {/* The picture is a click target for a pointer and nothing
                      more. The accessible link is the name in the plate, so
                      this one is kept out of the tree — two links to one
                      product would be announced twice. */}
                  <Link
                    href={href}
                    aria-hidden
                    tabIndex={-1}
                    className="absolute inset-0"
                  />
                </div>

                {/*
                  The positioner. Where it leaves the flow it pins to the middle
                  of the arch's outer edge, and the padding — not a margin or an
                  offset — opens the gap, so flipping sides is one swap of which
                  edge it hangs from.
                */}
                <div className="beside:pointer-events-none beside:absolute beside:top-1/2 beside:left-full beside:mt-0 beside:w-[17.5rem] beside:-translate-y-1/2 beside:pl-6 beside:[[data-stack-side=left]_&]:right-full beside:[[data-stack-side=left]_&]:left-auto beside:[[data-stack-side=left]_&]:pr-6 beside:[[data-stack-side=left]_&]:pl-0 relative mt-4">
                  {/*
                    The plate. Charcoal rather than `surface`, so it reads as a
                    hole cut in the photograph behind it rather than a card
                    floating on top of one.

                    It reveals on `focus-within` rather than on the card taking
                    focus, because the focus now lands on the link and the
                    button inside it — they must not be reachable while the
                    plate they sit on is still invisible.
                  */}
                  <div className="border-gold/20 bg-charcoal/95 beside:pointer-events-none beside:translate-x-2 beside:scale-[0.97] beside:opacity-0 beside:group-hover:pointer-events-auto beside:group-hover:translate-x-0 beside:group-hover:scale-100 beside:group-hover:opacity-100 beside:group-focus-within:pointer-events-auto beside:group-focus-within:translate-x-0 beside:group-focus-within:scale-100 beside:group-focus-within:opacity-100 rounded-xl border px-6 py-7 shadow-[0_30px_80px_-28px_rgba(0,0,0,0.95)] backdrop-blur-md transition-all duration-500 ease-out">
                    {/*
                      Rule, then line. The rules are the caption's spine: gold
                      and long for the name, shorter and dimmer as the lines
                      get quieter, so the eye walks down them in order.
                    */}
                    <div className="flex items-center gap-4">
                      <span
                        aria-hidden
                        className="bg-gold h-px w-10 shrink-0"
                      />
                      <h3 className="font-display text-[1.6rem] italic">
                        <Link
                          href={href}
                          className="hover:text-gold transition-colors"
                        >
                          {product.name}
                        </Link>
                      </h3>
                    </div>

                    {product.description && (
                      <div className="mt-4 flex items-start gap-4">
                        <span
                          aria-hidden
                          // Aligned to the first line rather than the block, so
                          // a description that wraps does not drag it down.
                          className="bg-cream/30 mt-[0.62em] h-px w-7 shrink-0"
                        />
                        <p className="text-cream-soft line-clamp-3 text-[0.8rem] leading-relaxed">
                          {product.description}
                        </p>
                      </div>
                    )}

                    <div className="mt-5 flex items-center gap-4">
                      <span
                        aria-hidden
                        className="bg-cream/20 h-px w-7 shrink-0"
                      />

                      {variant ? (
                        <p className="text-cream text-sm tabular-nums">
                          {formatNaira(
                            variant.price_override ?? product.base_price,
                          )}
                        </p>
                      ) : (
                        <p className="text-muted text-[0.65rem] tracking-[0.24em] uppercase">
                          {t.product.soldOut}
                        </p>
                      )}

                      <BagButton
                        product={product}
                        variant={variant}
                        className="ml-auto"
                      />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </CardStack>
      </div>
    </section>
  );
}
