import type { Metadata } from "next";

import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { getDictionary } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getDictionary();
  return { title: meta.craft, description: meta.craftDescription };
}

export default async function AboutPage() {
  const t = (await getDictionary()).about;

  return (
    <>
      <Container className="py-16 md:py-28">
        <Reveal>
          <p className="text-muted text-[0.65rem] tracking-[0.32em] uppercase">
            {t.eyebrow}
          </p>
          <h1 className="mt-8 max-w-4xl text-[clamp(2.25rem,6vw,5rem)]">
            {t.title}
          </h1>
        </Reveal>

        <Reveal delay={0.15} className="mt-14 max-w-2xl">
          <p className="text-cream-soft text-lg leading-relaxed">{t.intro}</p>
        </Reveal>
      </Container>

      <Container className="pb-24">
        <div className="grid gap-16 md:grid-cols-3 md:gap-10">
          {t.chapters.map((chapter, index) => (
            <Reveal key={chapter.title} delay={index * 0.1}>
              <p className="text-gold font-display text-3xl">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="border-line mt-5 border-t pt-5 text-2xl">
                {chapter.title}
              </h2>
              <p className="text-cream-soft mt-4 text-sm leading-relaxed">
                {chapter.body}
              </p>
            </Reveal>
          ))}
        </div>
      </Container>

      <section className="bg-surface">
        <Container className="py-24 text-center">
          <Reveal>
            <h2 className="mx-auto max-w-2xl text-3xl md:text-4xl">
              {t.closing}
            </h2>
            <ButtonLink href="/shop" size="lg" className="mt-10">
              {t.cta}
            </ButtonLink>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
