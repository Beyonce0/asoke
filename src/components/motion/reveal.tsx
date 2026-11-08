"use client";

import { useRef, type ElementType, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { DURATION, EASE, gsap, useGSAP } from "@/lib/gsap";

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Seconds to wait once the element enters the viewport. */
  delay?: number;
  /** Distance travelled, in pixels. */
  y?: number;
};

/**
 * Fades and lifts its children the first time they scroll into view.
 * Honours prefers-reduced-motion by rendering the final state immediately.
 */
export function Reveal({
  children,
  className,
  as: Tag = "div",
  delay = 0,
  y = 32,
}: RevealProps) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const target = scope.current;
      if (!target) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(target, { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        target,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          delay,
          duration: DURATION.base,
          ease: EASE.out,
          scrollTrigger: {
            trigger: target,
            start: "top 85%",
            once: true,
          },
        },
      );
    },
    { scope },
  );

  return (
    <Tag ref={scope} className={cn("opacity-0", className)}>
      {children}
    </Tag>
  );
}
