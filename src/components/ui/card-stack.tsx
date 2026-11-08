"use client";

import {
  Children,
  isValidElement,
  useCallback,
  useRef,
  type ReactNode,
} from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/*
 * A drifting row of cards that behaves like a stack when you point at it.
 *
 * ARRANGEMENT — the list is rendered REPEATS times in a row and the track
 * travels the width of exactly one copy before starting over. Because every
 * copy is identical, the jump back lands on a frame that looks the same, so
 * the seam is invisible. Travel is in pixels, not percent, so the speed stays
 * constant whatever the card count or screen width.
 *
 * INTERACTION — pointing at a card brings the whole strip to rest and lifts
 * that card out of the row: larger, sharp, in front. Its neighbours settle
 * back, blur and dim in proportion to how far they sit from it. Only one card
 * is ever forward, and moving between them hands the position over rather than
 * resetting through neutral.
 *
 * The focused card also carries `data-stack-side`, naming the side of it with
 * the most room left to the viewport edge. The strip clips horizontally, so a
 * card that wants to hang something beside it — a caption, a dialogue — has to
 * know which way to open or it gets cut off at the ends of the row. What to do
 * with that answer is the card's business, not this component's.
 *
 * Two things make it feel physical rather than like a CSS hover:
 *
 * - Every property is a transform or a filter, so nothing reflows. The active
 *   card grows *over* its neighbours instead of shoving them sideways.
 * - The tweens are interruptible. `overwrite: "auto"` means a card halfway
 *   forward reverses from wherever it actually is when the pointer moves on,
 *   instead of snapping to its end state first.
 *
 * The component is presentation only — it wraps whatever cards it is handed,
 * so the same behaviour can be reused anywhere without touching card design.
 */

/** Enough copies to overflow any sane viewport before the loop point. */
const REPEATS = 4;

/** Pixels per second. Slow — this is ambience, not a ticker. */
const SPEED = 38;

const DURATION = 0.7;
const EASE = "power3.out";

/** How far out of the row the focused card comes. */
const ACTIVE = { scale: 1.22, y: -26, blur: 0, brightness: 1, rotationY: 0 };

/** Everything level and sharp — the state with no pointer on the strip. */
const RESTING = { scale: 1, y: 0, blur: 0, brightness: 0.94, rotationY: 0 };

const DEPTH_LIMIT = 3;

/*
 * Layers. The scrim sits between the two, which is the whole trick: the active
 * card is lifted above it and stays sharp, while every other card — and the
 * ground behind them — falls behind it and is blurred and darkened as one.
 * Blurring each card individually could never darken the space between them.
 */
const LAYER = { recessed: 9, scrim: 20, active: 40 };

function depthFor(distance: number, side: number) {
  if (distance === 0) return { ...ACTIVE, z: LAYER.active };

  const depth = Math.min(distance, DEPTH_LIMIT);

  return {
    scale: 1 - 0.05 * depth,
    y: 2 + 6 * depth,
    blur: Math.min(1.6 * depth, 5),
    brightness: Math.max(0.4, 0.76 - 0.15 * (depth - 1)),
    // Tilted away from the card in front, which is what reads as depth.
    rotationY: side * (3 + 1.5 * depth),
    z: LAYER.recessed - depth,
  };
}

type CardStackProps = {
  children: ReactNode;
  className?: string;
  /** Card width. Overridable so the strip can be reused at any size. */
  cardClassName?: string;
  ariaLabel?: string;
};

export function CardStack({
  children,
  className,
  cardClassName = "w-[264px] sm:w-[300px] lg:w-[352px]",
  ariaLabel,
}: CardStackProps) {
  const scope = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef<(active: number | null) => void>(() => {});

  const cards = Children.toArray(children).filter(isValidElement);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track || cards.length === 0) return;

      const items = gsap.utils.toArray<HTMLElement>("[data-stack-item]");
      if (items.length === 0) return;

      /*
       * Only the first pass is real content; the rest exist to make the loop
       * seamless. They stay clickable — a visitor reaches for whichever copy
       * is in front of them — but everything in them comes out of the tab
       * order, so nobody walks the same cards four times, and no focusable
       * node is left sitting inside an `aria-hidden` subtree.
       *
       * Swept from the DOM rather than passed down as a prop: a card may hold
       * any number of links and buttons, and only the leaf that actually takes
       * focus can be fixed.
       */
      items.forEach((item) => {
        if (item.dataset.stackCopy === "0") return;

        item
          .querySelectorAll<HTMLElement>("a, button, input, select, textarea")
          .forEach((node) => {
            node.tabIndex = -1;
          });
      });

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      /*
       * Which side of the focused card has the most room. Measured from the
       * card's centre, which is the point the lift scales out of, so the
       * answer does not change as the card grows under the pointer.
       *
       * Written on the way in and never cleared. Clearing it on the way out
       * would flip whatever is hanging beside the card to the other side
       * halfway through its own fade — and a stale answer on a card nobody is
       * pointing at costs nothing, because it is re-measured before that card
       * can show anything again.
       */
      const sides = (active: number | null) => {
        const item = active === null ? undefined : items[active];
        if (!item) return;

        const box = item.getBoundingClientRect();
        const centre = box.left + box.width / 2;

        item.dataset.stackSide =
          centre < window.innerWidth / 2 ? "right" : "left";
      };

      // Reduced motion keeps the strip still, but a card that opens beside
      // itself still has to open the way it has room for.
      if (reduced) {
        focusRef.current = sides;
        return;
      }

      // ── The travel ────────────────────────────────────────────────────
      let loop: gsap.core.Tween | undefined;

      const build = () => {
        const wasStopped = loop?.timeScale() === 0;
        loop?.kill();
        gsap.set(track, { x: 0 });

        const distance = track.scrollWidth / REPEATS;
        if (distance <= 0) return;

        loop = gsap.fromTo(
          track,
          { x: -distance },
          { x: 0, duration: distance / SPEED, ease: "none", repeat: -1 },
        );

        // A resize mid-hover must not restart the travel under the pointer.
        if (wasStopped) loop.timeScale(0);
      };

      build();

      // Card widths are breakpoint-driven, so the loop distance moves with
      // the viewport and the tween has to be rebuilt against the new width.
      const observer = new ResizeObserver(() => build());
      observer.observe(track);

      // ── The stack ─────────────────────────────────────────────────────
      focusRef.current = (active) => {
        sides(active);

        gsap.to(loop ?? {}, {
          timeScale: active === null ? 1 : 0,
          duration: 0.45,
          ease: "power2.out",
          overwrite: "auto",
        });

        gsap.to("[data-stack-scrim]", {
          autoAlpha: active === null ? 0 : 1,
          duration: DURATION,
          ease: EASE,
          overwrite: "auto",
        });

        items.forEach((item, index) => {
          const state =
            active === null
              ? { ...RESTING, z: 10 }
              : depthFor(Math.abs(index - active), index < active ? -1 : 1);

          // z-index must not tween — the card has to be in front for the
          // whole journey, not only once it arrives.
          gsap.set(item, { zIndex: state.z });

          gsap.to(item, {
            scale: state.scale,
            y: state.y,
            rotationY: state.rotationY,
            filter: `blur(${state.blur}px) brightness(${state.brightness})`,
            duration: DURATION,
            ease: EASE,
            overwrite: "auto",
          });
        });
      };

      focusRef.current(null);

      return () => {
        observer.disconnect();
        loop?.kill();
      };
    },
    { scope, dependencies: [cards.length] },
  );

  const focus = useCallback((active: number | null) => {
    focusRef.current(active);
  }, []);

  return (
    <div
      ref={scope}
      className={cn("relative", className)}
      onMouseLeave={() => focus(null)}
    >
      <div
        role="list"
        aria-label={ariaLabel}
        // Room above and below for the card that lifts out of the row. Only
        // the horizontal axis clips — `clip`, unlike `hidden`, leaves the
        // other axis visible — so the lift is never cut, only the ends of the
        // strip are.
        className="overflow-x-clip pt-10 pb-8 md:pt-16 md:pb-24"
        style={{ perspective: "1600px" }}
      >
        <div ref={trackRef} className="relative flex w-max gap-6 md:gap-8">
          {/*
            The backdrop. It lives inside the track rather than beside it
            because the track is transformed, and a transform makes a stacking
            context — a scrim outside it could only sit wholly above or wholly
            below every card, never between them.

            It spans the full track, so whatever section of the strip happens
            to be on screen is covered.
          */}
          <div
            data-stack-scrim
            aria-hidden
            // The bleed matches the strip's own padding exactly, so the scrim
            // reaches past the cards and whatever they hang beside them, but
            // stops before it touches the heading above or the next section.
            className="bg-charcoal/60 pointer-events-none absolute inset-x-0 -top-10 -bottom-8 opacity-0 backdrop-blur-[3px] md:-top-16 md:-bottom-24"
            style={{ zIndex: LAYER.scrim }}
          />
          {Array.from({ length: REPEATS }).flatMap((_, copy) =>
            cards.map((card, index) => {
              const position = copy * cards.length + index;

              return (
                <div
                  key={`${copy}-${index}`}
                  data-stack-item
                  data-stack-copy={copy}
                  role="listitem"
                  className={cn(
                    "shrink-0 will-change-[transform,filter]",
                    cardClassName,
                  )}
                  // Duplicates are out of the accessibility tree; their
                  // focusables are stripped above. `inert` would be tidier and
                  // would also kill the clicks, which is the one thing the
                  // duplicates are there to keep.
                  aria-hidden={copy > 0}
                  onMouseEnter={() => focus(position)}
                  onFocusCapture={() => focus(position)}
                >
                  {card}
                </div>
              );
            }),
          )}
        </div>
      </div>
    </div>
  );
}
