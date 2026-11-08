"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Check, Globe } from "lucide-react";

import { setLocale } from "@/i18n/actions";
import { useI18n } from "@/i18n/client";
import { LOCALES } from "@/i18n/config";
import { cn } from "@/lib/utils";

/*
 * Each language is listed in its own name — someone looking for Hausa is
 * looking for the word "Hausa", not for whatever the current language calls
 * it — and tagged with `lang` so a screen reader pronounces it properly.
 */
export function LanguageSwitcher() {
  const { locale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-label={t.language.label}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "text-cream-soft hover:text-cream flex items-center gap-1.5 p-2 transition-colors",
          isPending && "opacity-50",
        )}
      >
        <Globe size={18} strokeWidth={1.5} aria-hidden />
        <span className="hidden text-[0.6rem] tracking-[0.2em] uppercase sm:inline">
          {locale}
        </span>
      </button>

      {open && (
        <ul
          aria-label={t.language.label}
          className="border-line bg-surface absolute top-full right-0 z-10 mt-2 min-w-44 border py-2 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)]"
        >
          {LOCALES.map((option) => {
            const isActive = option.code === locale;

            return (
              <li key={option.code}>
                <button
                  type="button"
                  lang={option.code}
                  aria-current={isActive ? "true" : undefined}
                  disabled={isPending}
                  onClick={() => {
                    setOpen(false);
                    if (isActive) return;
                    startTransition(() => setLocale(option.code));
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-6 px-5 py-2.5 text-left text-sm transition-colors",
                    isActive
                      ? "text-gold"
                      : "text-cream-soft hover:bg-charcoal/60 hover:text-cream",
                  )}
                >
                  {option.name}
                  {isActive && (
                    <Check size={14} strokeWidth={1.75} aria-hidden />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
