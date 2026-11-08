"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

// Importing from lib/gsap is what registers ScrollTrigger, so the trigger
// below is live without naming the plugin here.
import { gsap, useGSAP } from "@/lib/gsap";
import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";
import { useI18n } from "@/i18n/client";

/*
 * The lineup plate, with the range statement laid over it.
 *
 * The photograph is sliced into five vertical panels that rise in sequence and
 * lock into one continuous image. That is not an arbitrary transition: aso-oke
 * is woven in narrow strips and joined by hand, so the section assembles
 * itself the way the cloth does — and the figures fall into roughly five
 * clusters, so the seams land between them rather than through anyone.
 *
 * The copy sits on the picture from md up, over a scrim on the left, the same
 * way the hero handles it. Below that breakpoint the plate is only about 310px
 * tall on a phone, and five lines of paragraph laid over that band is not
 * readable at any scrim strength — so there it drops underneath instead.
 *
 * To swap the photograph, drop the file in public/images/ and change the
 * constant. Its ground is #0A0B0C, within three values of the house charcoal,
 * so the picture needs no scrim of its own — only the feather at top and
 * bottom, which stops the plate reading as a rectangle pasted onto the page.
 */
const PLATE_SRC = "/images/lineup.png";

const PANELS = [0, 1, 2, 3, 4];

function RangeCopy() {
  const { t } = useI18n();

  return (
    <>
      <p className="text-gold text-[0.65rem] tracking-[0.32em] uppercase">
        {t.home.showcase.eyebrow}
      </p>

      <h2 className="mt-6 text-[clamp(1.8rem,3.6vw,3.25rem)] leading-tight">
        {t.home.showcase.title}
      </h2>

      <p className="text-cream-soft mt-6 text-[0.95rem] leading-relaxed">
        {t.home.showcase.body}
      </p>
    </>
  );
}

export function Showcase() {
  const scope = useRef<HTMLElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  useGSAP(
    () => {
      const plate = plateRef.current;
      if (!plate) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set("[data-plate-panel]", { yPercent: 0 });
        gsap.set("[data-plate-inner]", { yPercent: 0 });
        gsap.set("[data-plate-copy]", { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set("[data-plate-panel]", { yPercent: 102 });
      gsap.set("[data-plate-inner]", { yPercent: -30 });
      gsap.set("[data-plate-copy]", { autoAlpha: 0, y: 22 });

      gsap
        .timeline({
          // Triggered on the plate itself, not the section, so it starts as
          // the picture arrives rather than when the copy above it does.
          scrollTrigger: { trigger: plate, start: "top 88%", once: true },
        })
        .to("[data-plate-panel]", {
          yPercent: 0,
          duration: 1.3,
          ease: "expo.out",
          stagger: 0.09,
        })
        // The image inside travels the opposite way, so each strip looks like
        // it is settling into place rather than sliding as a flat card.
        .to(
          "[data-plate-inner]",
          { yPercent: 0, duration: 1.5, ease: "expo.out", stagger: 0.09 },
          0,
        )
        // The writing lands once the cloth has joined, not before.
        .to(
          "[data-plate-copy]",
          { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out" },
          "-=0.75",
        );
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      // The hero's scroll cue targets this.
      id="lineup"
      aria-label={t.home.showcase.label}
      // Breathing room above the plate so it lands clear of the hero rather
      // than butting straight against it.
      className="bg-charcoal relative w-full overflow-hidden pt-16 md:pt-28"
    >
      <div ref={plateRef} className="relative">
        {/*
          The box keeps the picture's own height, never the viewport's, so the
          figures are always whole — head to toe, no vertical crop, whatever
          the window is doing.
            md+     1672/941, the frame as shot. Nothing is cropped at all.
            mobile  1190/941, which trims only the empty near-black margins.
                    The figures live between x=250 and x=1380 of 1672, so this
                    buys back height on a phone without losing anyone.
        */}
        <div className="relative aspect-[1190/941] w-full md:aspect-[1672/941]">
          <div className="absolute inset-0 flex">
            {PANELS.map((index) => (
              <div
                key={index}
                data-plate-panel
                className="relative h-full flex-1 overflow-hidden"
              >
                <div data-plate-inner className="absolute inset-0">
                  {/*
                    Each panel holds the whole photograph at 500% width, shifted
                    by one panel. Reassembled they are pixel-continuous, but
                    each can be animated on its own.
                  */}
                  <div
                    className="absolute inset-y-0 left-0 w-[500%]"
                    style={{ transform: `translateX(-${index * 20}%)` }}
                  >
                    <Image
                      src={PLATE_SRC}
                      alt={index === 0 ? t.home.showcase.plateAlt : ""}
                      fill
                      quality={85}
                      sizes="100vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/*
          Scrim for the overlaid copy. The picture is near-black at the left
          edge already, so this only has to carry the ramp across the first
          figure. It sits above the panels and outside them, or it would be
          clipped and dragged by the reveal.
        */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(to right, rgba(13,12,12,0.95) 0%, rgba(13,12,12,0.88) 26%, rgba(13,12,12,0.55) 42%, rgba(13,12,12,0.12) 58%, transparent 70%)",
          }}
        />

        <div className="absolute inset-0 hidden items-center md:flex">
          <Container>
            <div data-plate-copy className="max-w-lg lg:max-w-xl">
              <RangeCopy />
            </div>
          </Container>
        </div>

        {/*
          Feather. The picture's ground and the page are within three values of
          each other, so fading the top and bottom edges makes the plate
          dissolve into the page instead of ending on a visible line.
        */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-24 md:h-36"
          style={{
            background: "linear-gradient(to bottom, #0d0c0c, transparent)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28 md:h-44"
          style={{
            background: "linear-gradient(to top, #0d0c0c, transparent)",
          }}
        />
      </div>

      {/* Phone fallback for the copy above — see the note at the top. */}
      <Container className="pt-10 md:hidden">
        <Reveal className="max-w-xl">
          <RangeCopy />
        </Reveal>
      </Container>

      <Container className="relative pt-10 pb-28 md:pt-12 md:pb-40">
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted text-[0.62rem] tracking-[0.3em] uppercase">
            {t.home.showcase.footnote}
          </p>

          <Link
            href="/shop"
            className="text-cream hover:text-gold inline-block shrink-0 border-b border-current pb-1.5 text-[0.7rem] tracking-[0.2em] uppercase transition-colors"
          >
            {t.home.showcase.cta}
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
