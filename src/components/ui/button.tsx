import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center gap-2 rounded-none text-xs font-medium uppercase tracking-[0.18em] transition-colors duration-300 disabled:pointer-events-none disabled:opacity-45";

const variants = {
  // Burgundy is the primary accent, and cream on it reads at 9.9:1.
  primary: "bg-burgundy text-cream hover:bg-burgundy-light",
  // Gold needs a dark label: base on gold is 7.3:1, cream on gold only 2.2:1.
  gold: "bg-gold text-charcoal hover:bg-gold-light",
  navy: "bg-navy text-cream hover:bg-navy-light",
  outline:
    "border border-cream/35 text-cream hover:border-cream hover:bg-cream hover:text-charcoal",
  ghost: "text-cream-soft hover:text-cream",
} as const;

const sizes = {
  sm: "h-9 px-4",
  md: "h-11 px-7",
  lg: "h-14 px-10",
} as const;

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

function classes(variant: Variant, size: Size, className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return <button className={classes(variant, size, className)} {...props} />;
}

/** Same surface as Button, but navigates. Keeps the two visually identical. */
export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return <Link className={classes(variant, size, className)} {...props} />;
}
