"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, User } from "lucide-react";

import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Container } from "@/components/ui/container";
import { useI18n } from "@/i18n/client";
import { fill } from "@/i18n/config";
import { useCart } from "@/store/cart";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/shop", key: "shop" },
  { href: "/shop?collection=scarves", key: "scarves" },
  { href: "/about", key: "craft" },
  { href: "/book", key: "book" },
  { href: "/contact", key: "contact" },
] as const;

export function Header() {
  const { count, isHydrated, setOpen } = useCart();
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /*
   * The bag is seeded from localStorage, which the server never saw. Every
   * render that happens before `isHydrated` flips has to match the empty cart
   * the server sent — text, attributes and all — or React finds the tree it
   * hydrated disagreeing with the one it built and gives up on patching it.
   *
   * The badge below is already gated. This is the same gate for the label,
   * which is not visible but is still an attribute React compares.
   */
  const bagCount = isHydrated ? count : 0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    // Transparent over the hero photograph, then it takes on a ground once
    // there is content behind it. The hero's top scrim keeps this readable.
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-line/70 bg-charcoal/85 border-b backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <Container className="flex h-[var(--header-height)] items-center justify-between">
        <button
          type="button"
          aria-label={t.nav.openMenu}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="text-cream -ml-2 p-2 xl:hidden"
        >
          <Menu size={20} strokeWidth={1.5} />
        </button>

        {/*
          The full row only from xl. The wordmark is centred absolutely, so the
          row has half the header to fit in, and five links in Hausa or Igbo
          run into it on a laptop. Below xl the menu button carries them.
        */}
        <nav className="hidden items-center gap-7 xl:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-cream-soft hover:text-cream text-[0.7rem] tracking-[0.2em] uppercase transition-colors"
            >
              {t.nav[link.key]}
            </Link>
          ))}
        </nav>

        {/*
          The lockup. Tracked type pushes a trailing space onto the last
          letter, which drags optically-centred text off centre — the matching
          left padding on each line puts it back.
        */}
        <Link
          href="/"
          aria-label={fill(t.nav.home, { tagline: t.brand.tagline })}
          className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center leading-none"
        >
          <span
            translate="no"
            className="wordmark text-cream pl-[0.28em] text-lg md:text-xl"
          >
            Àṣọké
          </span>
          <span className="text-gold/75 mt-[0.45rem] pl-[0.42em] text-[0.4rem] tracking-[0.42em] uppercase md:text-[0.45rem]">
            {t.brand.tagline}
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <LanguageSwitcher />

          <Link
            href="/account"
            aria-label={t.nav.account}
            className="text-cream-soft hover:text-cream p-2 transition-colors"
          >
            <User size={19} strokeWidth={1.5} />
          </Link>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={
              bagCount === 1
                ? t.nav.bagOne
                : fill(t.nav.bagMany, { count: bagCount })
            }
            className="text-cream-soft hover:text-cream relative -mr-2 p-2 transition-colors"
          >
            <ShoppingBag size={19} strokeWidth={1.5} />
            {bagCount > 0 && (
              <span className="bg-gold text-charcoal absolute top-0 right-0 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[0.6rem] font-medium tabular-nums">
                {bagCount}
              </span>
            )}
          </button>
        </div>
      </Container>

      {menuOpen && (
        <nav className="border-line bg-charcoal border-t xl:hidden">
          <Container className="flex flex-col py-2">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                // Closing here rather than on a route-change effect keeps the
                // drawer's lifetime tied to the interaction that opened it.
                onClick={() => setMenuOpen(false)}
                className="border-line/60 text-cream-soft border-b py-4 text-xs tracking-[0.2em] uppercase last:border-0"
              >
                {t.nav[link.key]}
              </Link>
            ))}
          </Container>
        </nav>
      )}
    </header>
  );
}
