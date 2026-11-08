"use client";

import Image from "next/image";
import { useRef } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useLenis } from "lenis/react";

import { ChromaVideo } from "@/components/motion/chroma-video";
import { useIntro } from "@/components/motion/intro";
import { ButtonLink } from "@/components/ui/button";
import { useI18n } from "@/i18n/client";
import { Container } from "@/components/ui/container";
import { GREEN_SCREEN } from "@/lib/chroma";
import { DURATION, EASE, SplitText, gsap, useGSAP } from "@/lib/gsap";

/*
 * The first screen. A courtyard at low sun, with the model composited into it.
 *
 * The footage is shot on green. `ChromaVideo` keys it out in a shader at play
 * time, so she stands in the scene rather than in a box — see that file for
 * why the key is done live rather than baked into the file.
 *
 * Placement is percentage-based against the section, so the composition holds
 * as the viewport changes. The offsets look lopsided because they are measured
 * against the source frame, where she fills 85.7% of the height, her feet sit
 * 91.8% down and her centre is 51.7% across.
 */
const MODEL = {
  // The key itself lives in `lib/chroma.ts` — one screen, one measurement,
  // shared with the turn clips on the product pages.
  ...GREEN_SCREEN,
  width: 720,
  height: 1280,
};

/*
 * The photograph and the film are overridable from Settings, and every one of
 * them falls back to what ships in the repository. A shop that has never
 * opened the dashboard renders exactly the site as designed.
 */
type HeroMedia = {
  image?: string | null;
  videoMp4?: string | null;
  videoWebm?: string | null;
};

const SHIPPED = {
  image: "/images/hero-courtyard.png",
  videoMp4: "/videos/model.mp4",
  videoWebm: "/videos/model.webm",
};

export function Hero({ media }: { media?: HeroMedia }) {
  const scope = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { isIntroDone } = useIntro();
  const { t } = useI18n();
  const lenis = useLenis();

  /*
   * Hand the jump to Lenis so a click travels with the same easing as a drag.
   * Falling back to scrollIntoView keeps it working if Lenis has not attached
   * yet, or has been switched off for reduced motion.
   */
  const goToNextSection = () => {
    const target = document.getElementById("lineup");
    if (!target) return;

    if (lenis) lenis.scrollTo(target, { duration: 1.5 });
    else target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useGSAP(
    () => {
      const heading = headingRef.current;
      if (!heading) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(["[data-hero-fade]", "[data-hero-model]"], {
          opacity: 1,
          y: 0,
        });
        gsap.set(heading, { opacity: 1 });
        return;
      }

      gsap.set("[data-hero-fade]", { opacity: 0, y: 24 });
      gsap.set("[data-hero-rule]", { scaleX: 0 });
      gsap.set("[data-hero-model]", { opacity: 0, y: 40 });
      gsap.set("[data-hero-scene]", { scale: 1.06 });

      // Hold everything until the curtain starts lifting, or it plays unseen.
      if (!isIntroDone) return;

      let split: SplitText | undefined;

      // Splitting before the webfont settles measures the fallback metrics and
      // leaves the lines broken at the wrong words.
      document.fonts.ready.then(() => {
        gsap.set(heading, { opacity: 1 });

        split = SplitText.create(heading, {
          type: "lines",
          mask: "lines",
          linesClass: "block",
        });

        gsap
          .timeline()
          // The scene settles out of a slow push-in, so the reveal has depth
          // rather than simply appearing.
          .to(
            "[data-hero-scene]",
            { scale: 1, duration: 2.4, ease: "power2.out" },
            0,
          )
          .to(
            "[data-hero-model]",
            { opacity: 1, y: 0, duration: 1.6, ease: EASE.expo },
            0.25,
          )
          .from(
            split.lines,
            {
              yPercent: 110,
              duration: DURATION.slow,
              ease: EASE.expo,
              stagger: 0.09,
            },
            0.15,
          )
          .to(
            "[data-hero-fade]",
            {
              opacity: 1,
              y: 0,
              duration: DURATION.base,
              ease: EASE.out,
              stagger: 0.12,
            },
            "-=0.7",
          )
          .to(
            "[data-hero-rule]",
            { scaleX: 1, duration: DURATION.slow, ease: EASE.inOut },
            "-=0.9",
          );
      });

      /*
       * Scroll cue: a short gold segment falling down the rule, over and over.
       * A bar that grows and snaps back reads as a progress meter; something
       * travelling downward reads as a direction, which is the actual message.
       */
      gsap.fromTo(
        "[data-hero-cue-fill]",
        { yPercent: -140 },
        {
          yPercent: 420,
          duration: 1.9,
          ease: "power1.inOut",
          repeat: -1,
          repeatDelay: 0.35,
        },
      );

      return () => split?.revert();
    },
    { scope, dependencies: [isIntroDone] },
  );

  return (
    <section
      ref={scope}
      // Cancels the sticky header's space in flow so this really is one screen.
      className="relative mt-[calc(var(--header-height)*-1)] h-dvh w-full overflow-hidden"
    >
      <div data-hero-scene className="absolute inset-0">
        <Image
          src={media?.image || SHIPPED.image}
          alt=""
          fill
          priority
          quality={85}
          sizes="100vw"
          className="object-cover object-[62%_center] md:object-center"
        />
      </div>

      {/*
        Scrims. The courtyard wall is warm and bright, and cream type on it
        would sit at about 2:1. These pull it down to a readable ground without
        turning the photograph grey.

        Both run left-to-right, because on a phone the model is full height on
        the right rather than stacked below — so the copy needs a dark left,
        not a dark top. The mobile ramp is steeper: the text crosses further
        into her before it runs out.
      */}
      <div
        aria-hidden
        className="absolute inset-0 md:hidden"
        style={{
          background:
            "linear-gradient(100deg, rgba(13,12,12,0.95) 0%, rgba(13,12,12,0.86) 34%, rgba(13,12,12,0.5) 62%, rgba(13,12,12,0.2) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 hidden md:block"
        style={{
          background:
            "linear-gradient(to right, rgba(13,12,12,0.88) 0%, rgba(13,12,12,0.55) 34%, rgba(13,12,12,0.05) 62%)",
        }}
      />

      {/* Gives the transparent header something to sit on. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-40"
        style={{
          background:
            "linear-gradient(to bottom, rgba(13,12,12,0.7), transparent)",
        }}
      />

      {/* Blends the photograph into the charcoal page beneath it. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-32"
        style={{
          background: "linear-gradient(to bottom, transparent, #0d0c0c)",
        }}
      />

      <div
        data-hero-model
        /*
         * Derived, not eyeballed. In the source frame she fills 85.7% of the
         * height, her feet sit 91.8% down, and her centre is 51.7% across.
         *
         * `left` plus a -51.7% self-translate pins her *centre* to a fraction
         * of the viewport, and that holds at any aspect ratio — anchoring the
         * box edge instead would drift as the phone got wider or narrower.
         *
         *   mobile   centre 65% across,   76% of the height, feet at 91%
         *   desktop  centre 73.7% across, 84% of the height, feet at 94%
         */
        className="pointer-events-none absolute bottom-[1.4%] left-[65%] aspect-[720/1280] h-[89%] -translate-x-[51.7%] md:bottom-[-2%] md:left-[73.7%] md:h-[98%]"
      >
        {/*
          Contact shadow. Without one she reads as pasted onto the photograph
          rather than standing on the paving.
        */}
        <div
          aria-hidden
          className="absolute top-[91.8%] left-[51.7%] h-[2.4%] w-[19%] -translate-x-1/2 -translate-y-1/2 blur-[6px]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(28,16,8,0.55) 0%, rgba(28,16,8,0.28) 45%, transparent 72%)",
          }}
        />

        <ChromaVideo
          /*
            WebM first: where a browser supports it the file is smaller, and
            where it does not the MP4 below is picked up instead. Both are
            green-screen source for the shader either way.
          */
          sources={[
            {
              src: media?.videoWebm || SHIPPED.videoWebm,
              type: "video/webm",
            },
            { src: media?.videoMp4 || SHIPPED.videoMp4, type: "video/mp4" },
          ]}
          width={MODEL.width}
          height={MODEL.height}
          keyColor={MODEL.keyColor}
          similarity={MODEL.similarity}
          smoothness={MODEL.smoothness}
          className="h-full w-full"
        />
      </div>

      <Container className="relative z-10 flex h-full flex-col justify-center">
        <div className="max-w-[19rem] sm:max-w-md md:max-w-xl">
          <p
            data-hero-fade
            className="text-gold text-[0.65rem] tracking-[0.32em] uppercase"
          >
            {t.home.hero.eyebrow}
          </p>

          {/*
            Second clause in italic, the way the reference sets it. SplitText
            masks by line, and the <em> rides along inside whichever line it
            lands on, so the break point can move freely with the viewport.
          */}
          <h1
            ref={headingRef}
            className="text-cream mt-6 text-[clamp(2.5rem,6.5vw,5.5rem)] font-normal opacity-0"
          >
            {t.home.hero.titleLead}{" "}
            <em className="text-cream/95 italic">{t.home.hero.titleTail}</em>
          </h1>

          <div
            data-hero-rule
            className="bg-gold/40 mt-9 h-px w-full origin-left"
            aria-hidden
          />

          <p
            data-hero-fade
            className="text-cream-soft mt-8 max-w-md text-base leading-relaxed"
          >
            {t.home.hero.body}
          </p>

          <div data-hero-fade className="mt-10 flex flex-wrap gap-3">
            {/* Gold fill with a dark label — 7.3:1, where cream would be 2.2. */}
            <ButtonLink href="/shop" variant="gold" size="lg" className="group">
              {t.home.hero.explore}
              <ArrowRight
                size={15}
                strokeWidth={1.75}
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </ButtonLink>
            <ButtonLink href="/about" variant="outline" size="lg">
              {t.home.hero.craft}
            </ButtonLink>
          </div>
        </div>
      </Container>

      {/*
        Scroll cue. Sits above the model so it never lands on her skirt, and
        carries data-hero-fade so it arrives with the rest of the copy rather
        than being the one thing already on screen.

        It is a real button, not decoration: pressing it hands the scroll to
        Lenis, so clicking gets the same eased travel as dragging does.
      */}
      <div className="absolute inset-x-0 bottom-7 z-20 flex justify-center md:bottom-9">
        <button
          type="button"
          data-hero-fade
          data-hero-cue
          onClick={goToNextSection}
          className="group flex cursor-pointer flex-col items-center gap-2.5 bg-transparent p-1"
        >
          <span className="text-cream/50 group-hover:text-gold text-[0.55rem] tracking-[0.34em] uppercase transition-colors">
            {t.home.hero.scroll}
          </span>

          <span className="bg-cream/15 relative block h-11 w-px overflow-hidden">
            <span
              data-hero-cue-fill
              className="bg-gold absolute inset-x-0 top-0 block h-1/3"
            />
          </span>

          <ChevronDown
            size={15}
            strokeWidth={1.25}
            className="text-cream/45 group-hover:text-gold transition-colors"
            aria-hidden
          />
          <span className="sr-only">{t.home.hero.scrollLabel}</span>
        </button>
      </div>
    </section>
  );
}
