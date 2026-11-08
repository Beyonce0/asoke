import Link from "next/link";

import { Hero } from "@/components/sections/hero";
import { Showcase } from "@/components/sections/showcase";
import { Pieces } from "@/components/sections/pieces";
import { Bespoke } from "@/components/sections/bespoke";
import { Craft } from "@/components/sections/craft";
import { AtelierTimeline } from "@/components/sections/atelier-timeline";
import { Moments } from "@/components/sections/moments";
import { ContactSection } from "@/components/sections/contact";
import { ProductGrid } from "@/components/shop/product-grid";
import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";
import { getDictionary, getLocale } from "@/i18n/server";
import {
  getFeaturedProducts,
  getShowcaseProducts,
  getSiteSettings,
} from "@/lib/queries";

export default async function HomePage() {
  const [featured, pieces, settings, locale, t] = await Promise.all([
    getFeaturedProducts(6),
    getShowcaseProducts(5),
    getSiteSettings(),
    getLocale(),
    getDictionary(),
  ]);

  return (
    <>
      {/* Curtain → hero. The curtain lifts straight into the courtyard. */}
      {/*
        Keyed on the language: the heading is split into animated lines once
        it is on screen, and new words poured into the old split would land in
        the wrong lines. A fresh mount splits — and plays — them again.
      */}
      <Hero
        key={locale}
        media={{
          image: settings.hero_image,
          videoMp4: settings.hero_video_mp4,
          videoWebm: settings.hero_video_webm,
        }}
      />

      {/* Then the lineup plate, assembling itself on scroll. */}
      <Showcase />

      {/* Then the pieces themselves, drifting past and buyable in place. */}
      <Pieces products={pieces} />

      <Container className="pt-4">
        <Reveal className="mb-12 flex items-end justify-between gap-6">
          <h2 className="text-3xl md:text-5xl">{t.home.thisSeason}</h2>
          <Link
            href="/shop"
            className="text-cream-soft hover:text-cream shrink-0 pb-2 text-[0.7rem] tracking-[0.2em] uppercase transition-colors"
          >
            {t.home.viewAll}
          </Link>
        </Reveal>

        <ProductGrid products={featured} />
      </Container>

      {/*
        Then the house itself, in the order a customer meets it: what we can
        make for you, how it is made, how long it takes, and who it is for.

        The old inline navy block lived here and said "The craft" in four
        lines; `Craft` is that block with the photograph it always wanted, so
        there is only ever one section by that name.
      */}
      <Bespoke />
      <Craft image={settings.craft_image} />
      <AtelierTimeline turnaround={settings.turnaround} />
      <Moments />
      <ContactSection settings={settings} />
    </>
  );
}
