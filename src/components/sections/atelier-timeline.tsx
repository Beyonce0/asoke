"use client";

import { useRef } from "react";
import {
  MessagesSquare,
  Package,
  Scissors,
  Sparkles,
  SwatchBook,
} from "lucide-react";

import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { useI18n } from "@/i18n/client";
import { DURATION, EASE, gsap, useGSAP } from "@/lib/gsap";

/*
 * How long it takes, as a walk rather than an FAQ line.
 *
 * "7–14 working days" answers the question and tells you nothing about what
 * happens in them. Five marks on a drawn line answer it and show the work, and
 * the number underneath still lands for anyone who only came for that.
 *
 * The spine draws itself as the section arrives and the stops land along it —
 * the one moment on the page where an animation is carrying meaning rather
 * than decorating it, so it is worth the client component.
 *
 * Two spines exist in the markup, one per orientation, because a line that
 * runs down the page on a phone and across it on a desktop cannot be the same
 * element scaled on the same axis. Only ever one is displayed.
 */

/*
 * The mark on the line is the stage's own tool, not a numbered dot: shears for
 * tailoring, a swatch book for the cloth, a wrapped parcel for the road. It
 * reads at a glance and in any language, which a paragraph does not.
 *
 * Decorative, every one of them — the title beside each says the same thing in
 * words, so they are hidden from screen readers rather than described twice.
 */
const ICONS = [MessagesSquare, SwatchBook, Scissors, Sparkles, Package];

/*
 * The words — titles, copy, and the fallback turnaround used until the atelier
 * sets its own in Settings — live in the dictionary, in the same order.
 */

export function AtelierTimeline({
  turnaround,
}: {
  turnaround?: string | null;
}) {
  const scope = useRef<HTMLDivElement>(null);
  const t = useI18n().t.home.timeline;
  const stops = t.stops.map((stop, index) => ({ ...stop, Icon: ICONS[index] }));

  useGSAP(
    () => {
      const stops = gsap.utils.toArray<HTMLElement>("[data-stop]");
      const spines = gsap.utils.toArray<HTMLElement>("[data-spine]");
      if (stops.length === 0) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(stops, { opacity: 1, y: 0 });
        gsap.set(spines, { scaleX: 1, scaleY: 1 });
        return;
      }

      const timeline = gsap.timeline({
        scrollTrigger: { trigger: scope.current, start: "top 75%", once: true },
      });

      timeline
        // Each spine only ever grows along its own axis; the other stays at 1,
        // so one tween can drive both without knowing which is on screen.
        .fromTo(
          "[data-spine=horizontal]",
          { scaleX: 0 },
          { scaleX: 1, duration: DURATION.slow, ease: EASE.inOut },
        )
        .fromTo(
          "[data-spine=vertical]",
          { scaleY: 0 },
          { scaleY: 1, duration: DURATION.slow, ease: EASE.inOut },
          0,
        )
        .fromTo(
          stops,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.12,
            duration: DURATION.base,
            ease: EASE.out,
          },
          0.35,
        );
    },
    { scope },
  );

  return (
    <section
      id="atelier-timeline"
      aria-label={t.eyebrow}
      className="bg-charcoal relative w-full py-24 md:py-36"
    >
      <Container>
        <Reveal>
          <p className="text-gold text-[0.65rem] tracking-[0.32em] uppercase">
            {t.eyebrow}
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="mt-6 max-w-2xl text-[clamp(1.9rem,4.4vw,3.5rem)] leading-tight">
            {t.title}
          </h2>
        </Reveal>

        <div ref={scope} className="relative mt-16 lg:mt-24">
          {/* The spines run through the centre of the marks — 19.5px, so a
              1px line lands centred on a 40px circle rather than half a pixel
              off it. Both stop at the first and last mark rather than at the
              edge of the section, so the line reads as strung between them. */}
          <span
            aria-hidden
            data-spine="vertical"
            className="bg-line absolute top-5 bottom-5 left-[19.5px] w-px origin-top lg:hidden"
          />

          <span
            aria-hidden
            data-spine="horizontal"
            className="bg-line absolute top-[19.5px] right-0 left-0 hidden h-px origin-left lg:block"
          />

          <ol className="grid gap-12 lg:grid-cols-5 lg:gap-8">
            {stops.map((stop, index) => (
              <li
                key={stop.title}
                data-stop
                className="relative pl-16 opacity-0 lg:pt-16 lg:pl-0"
              >
                {/* The mark on the line. Filled with charcoal, so the spine
                    passes behind the tool rather than through it. */}
                <span
                  aria-hidden
                  className="border-gold/35 bg-charcoal text-gold absolute top-0 left-0 grid h-10 w-10 place-items-center rounded-full border"
                >
                  <stop.Icon size={16} strokeWidth={1.5} />
                </span>

                <p className="text-gold/85 text-[0.6rem] tracking-[0.28em] uppercase">
                  0{index + 1}
                </p>

                <h3 className="mt-3 text-lg leading-snug">{stop.title}</h3>

                <p className="text-cream-soft mt-2.5 text-[0.85rem] leading-relaxed">
                  {stop.copy}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <Reveal delay={0.1}>
          <div className="border-line mt-16 border-t pt-8 md:mt-20">
            <p className="text-cream text-sm">
              {t.turnaround}{" "}
              <span className="text-gold tabular-nums">
                {turnaround || t.defaultTurnaround}
              </span>
            </p>
            <p className="text-muted mt-2 max-w-xl text-[0.8rem] leading-relaxed">
              {t.note}
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
