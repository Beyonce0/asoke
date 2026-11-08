"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLenis } from "lenis/react";

import { useI18n } from "@/i18n/client";
import { gsap, useGSAP } from "@/lib/gsap";

/*
 * The opening curtain.
 *
 * A full-bleed charcoal panel carrying the wordmark, the line beneath it, and
 * a hairline of antique gold that fills as the page loads. It is painted in
 * the site's own background so the lift reveals the showcase photograph with
 * no jump in colour — the two grounds are within a few values of each other.
 *
 * It renders in the server HTML, so there is never a flash of the storefront
 * before it appears.
 */

/** Flip to show a small gold percentage under the rule. */
const SHOW_PERCENTAGE = false;

/** Floor on how long the panel stays, so a warm cache does not make it blink. */
const MIN_VISIBLE_MS = 1900;

/** Ceiling, so a stalled image can never trap the visitor behind the panel. */
const MAX_WAIT_MS = 5000;

const WORDMARK = Array.from("ÀṢỌKÉ".normalize("NFC"));

type IntroValue = { isIntroDone: boolean };

const IntroContext = createContext<IntroValue>({ isIntroDone: true });

/** Lets the hero hold its animation until the curtain starts lifting. */
export function useIntro() {
  return useContext(IntroContext);
}

export function IntroProvider({ children }: { children: ReactNode }) {
  const [isIntroDone, setIntroDone] = useState(false);
  const value = useMemo<IntroValue>(() => ({ isIntroDone }), [isIntroDone]);

  return (
    <IntroContext value={value}>
      <IntroCurtain onHandoff={() => setIntroDone(true)} />
      {children}
    </IntroContext>
  );
}

function whenLoaded() {
  if (document.readyState === "complete") return Promise.resolve();
  return new Promise<void>((resolve) => {
    window.addEventListener("load", () => resolve(), { once: true });
  });
}

function after(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function IntroCurtain({ onHandoff }: { onHandoff: () => void }) {
  const { t } = useI18n();
  const root = useRef<HTMLDivElement>(null);
  const [isRemoved, setRemoved] = useState(false);
  const [isActive, setActive] = useState(true);
  const lenis = useLenis();

  // Lenis is created by a parent effect, which runs after this one, so the
  // instance arrives on a later pass. Reacting to it covers both orders.
  useEffect(() => {
    if (!lenis) return;
    if (isActive) lenis.stop();
    else lenis.start();
  }, [lenis, isActive]);

  useEffect(() => {
    const html = document.documentElement;
    if (isActive) html.setAttribute("data-intro-active", "");
    else html.removeAttribute("data-intro-active");

    return () => html.removeAttribute("data-intro-active");
  }, [isActive]);

  useGSAP(
    () => {
      const mountedAt = performance.now();
      let cancelled = false;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduced) {
        // No theatre. Hand over immediately and get out of the way.
        setActive(false);
        setRemoved(true);
        onHandoff();
        return;
      }

      const counter = { value: 0 };

      // Typography first. Animating the wordmark before the webfont resolves
      // would play the whole reveal in Georgia and then snap to Playfair.
      document.fonts.ready.then(() => {
        if (cancelled) return;

        const enter = gsap
          .timeline()
          .to("[data-intro-letter]", {
            autoAlpha: 1,
            y: 0,
            duration: 1.05,
            ease: "power3.out",
            stagger: 0.06,
          })
          .fromTo(
            "[data-intro-wordmark]",
            { letterSpacing: "0.52em" },
            { letterSpacing: "0.28em", duration: 1.7, ease: "expo.out" },
            0,
          )
          .to(
            "[data-intro-tagline]",
            { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out" },
            0.45,
          )
          // Stops short of full — the last stretch is earned by being ready.
          .to(
            "[data-intro-rule-fill]",
            { scaleX: 0.74, duration: 1.6, ease: "power1.inOut" },
            0.3,
          );

        if (SHOW_PERCENTAGE) {
          enter.to(
            counter,
            {
              value: 74,
              duration: 1.6,
              ease: "power1.inOut",
              onUpdate: () => {
                const node = root.current?.querySelector("[data-intro-count]");
                if (node) node.textContent = String(Math.round(counter.value));
              },
            },
            0.3,
          );
        }

        // Measured from mount, not from fonts-ready, so a cold cache does not
        // add the font wait on top of the minimum.
        const remaining = Math.max(
          0,
          MIN_VISIBLE_MS - (performance.now() - mountedAt),
        );

        Promise.race([
          Promise.all([whenLoaded(), after(remaining)]),
          after(MAX_WAIT_MS),
        ]).then(() => {
          if (cancelled) return;

          const exit = gsap.timeline();

          exit
            .to("[data-intro-rule-fill]", {
              scaleX: 1,
              duration: 0.5,
              ease: "power2.out",
            })
            .to(
              ["[data-intro-letter]", "[data-intro-tagline]"],
              {
                autoAlpha: 0,
                y: -14,
                duration: 0.55,
                ease: "power2.in",
                stagger: 0.025,
              },
              "-=0.2",
            )
            .to(
              "[data-intro-rule]",
              { autoAlpha: 0, duration: 0.35, ease: "power2.in" },
              "-=0.4",
            )
            .to(
              root.current,
              {
                yPercent: -100,
                duration: 1.1,
                ease: "expo.inOut",
                // Hand off as the panel starts to lift, so the hero is already
                // moving by the time it is uncovered.
                onStart: onHandoff,
                onComplete: () => {
                  setActive(false);
                  setRemoved(true);
                },
              },
              "-=0.05",
            );

          if (SHOW_PERCENTAGE) {
            exit.to(
              counter,
              {
                value: 100,
                duration: 0.5,
                ease: "power2.out",
                onUpdate: () => {
                  const node =
                    root.current?.querySelector("[data-intro-count]");
                  if (node)
                    node.textContent = String(Math.round(counter.value));
                },
              },
              0,
            );
          }
        });
      });

      return () => {
        cancelled = true;
      };
    },
    { scope: root },
  );

  if (isRemoved) return null;

  return (
    <div
      ref={root}
      data-intro-panel
      aria-hidden
      className="bg-charcoal fixed inset-0 z-[100] flex flex-col items-center justify-center"
    >
      {/* Without JavaScript the panel would never lift. */}
      <noscript>
        <style>{`[data-intro-panel]{display:none!important}`}</style>
      </noscript>

      {/*
        Sizes are viewport-proportional so the composition holds at any width,
        tuned to sit at ~2.8vw wordmark / 15vw rule on a desktop screen.
      */}
      <p
        data-intro-wordmark
        translate="no"
        className="wordmark text-cream text-[clamp(2rem,2.8vw,3.6rem)] leading-none"
      >
        {WORDMARK.map((letter, index) => (
          <span
            key={`${letter}-${index}`}
            data-intro-letter
            className="inline-block translate-y-[0.4em] opacity-0"
          >
            {letter}
          </span>
        ))}
      </p>

      <p
        data-intro-tagline
        className="text-cream/45 mt-6 translate-y-2 text-[0.6rem] tracking-[0.42em] uppercase opacity-0"
      >
        {t.brand.tagline}
      </p>

      <div
        data-intro-rule
        className="bg-cream/12 relative mt-13 h-[2px] w-[clamp(11rem,15vw,18rem)] overflow-hidden"
      >
        <span
          data-intro-rule-fill
          className="bg-gold absolute inset-0 block origin-left scale-x-0"
        />
      </div>

      {SHOW_PERCENTAGE && (
        <p
          data-intro-count
          className="text-gold mt-5 text-[0.6rem] tracking-[0.3em] tabular-nums"
        >
          0
        </p>
      )}
    </div>
  );
}
