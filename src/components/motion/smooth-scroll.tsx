"use client";

import { useEffect, type ReactNode } from "react";
import { ReactLenis, useLenis } from "lenis/react";

import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Drives Lenis from GSAP's ticker instead of its own rAF loop, so smooth
 * scrolling and every ScrollTrigger animation advance on the same frame.
 * Running two loops is what causes the classic one-frame scroll jitter.
 *
 * Keyed on the instance, not run once on mount. `ReactLenis` creates Lenis in
 * its own effect and hands it out on the next render, so a mount-only effect
 * finds nothing, returns, and never runs again — leaving a Lenis that eats
 * every wheel and trackpad event with no loop to turn them into scrolling.
 */
function LenisDriver() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    lenis.on("scroll", ScrollTrigger.update);

    // Lenis reports seconds, gsap.ticker reports milliseconds.
    const raf = (time: number) => lenis.raf(time * 1000);

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(raf);
    };
  }, [lenis]);

  return null;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        autoRaf: false,
        duration: 1.15,
        // Slightly overdamped exponential — settles without overshoot.
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        // Native momentum on touch feels better than an emulated one.
        syncTouch: false,
      }}
    >
      <LenisDriver />
      {children}
    </ReactLenis>
  );
}
