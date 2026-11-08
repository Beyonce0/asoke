"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

// Registering twice is harmless, but keeping it in one module means every
// import site gets the same configured instance.
gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/** House easing. Long, weighted, cloth-like — never bouncy. */
export const EASE = {
  out: "power3.out",
  inOut: "power2.inOut",
  expo: "expo.out",
} as const;

export const DURATION = {
  fast: 0.4,
  base: 0.8,
  slow: 1.2,
} as const;

export { gsap, ScrollTrigger, SplitText, useGSAP };
