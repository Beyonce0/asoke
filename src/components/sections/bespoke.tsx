import { Package, Ruler, Scissors, SwatchBook } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { getDictionary } from "@/i18n/server";

/*
 * Bespoke, as four stages rather than a paragraph.
 *
 * A commission is the most expensive thing the house sells and the least
 * self-explanatory, so the section's whole job is to make an unfamiliar process
 * feel walkable: four steps, numbered, each one a single decision. Nobody reads
 * "we also make bespoke" and knows what is being asked of them.
 *
 * The numbers are set large and in gold because they are the structure — the
 * eye should be able to count them from across the page before reading a word.
 * Each rule then runs out to the tool for that stage.
 *
 * The glyphs are deliberately the same ones the atelier timeline uses for the
 * same acts — cloth, shears, parcel. Two marks for one idea would read as two
 * different ideas, and the two sections describe the same workshop.
 */

/* The tool beside each step, in the order the dictionary lists the steps. */
const ICONS = [SwatchBook, Ruler, Scissors, Package];

export async function Bespoke() {
  const t = (await getDictionary()).home.bespoke;
  const stages = t.stages.map((stage, index) => ({
    ...stage,
    Icon: ICONS[index],
  }));

  return (
    <section
      id="bespoke"
      aria-label={t.eyebrow}
      className="bg-charcoal relative w-full py-24 md:py-36"
    >
      <Container>
        <Reveal>
          <p className="text-gold text-[0.65rem] tracking-[0.32em] uppercase">
            {t.eyebrow}
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="mt-6 max-w-3xl text-[clamp(1.9rem,4.4vw,3.5rem)] leading-tight">
            {t.title}
          </h2>
        </Reveal>

        <Reveal delay={0.14}>
          <p className="text-cream-soft mt-7 max-w-xl text-base leading-relaxed">
            {t.body}
          </p>
        </Reveal>

        <div className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
          {stages.map((stage, index) => (
            <Reveal key={stage.title} delay={(index % 4) * 0.08}>
              <article>
                <p className="font-display text-gold/85 text-[2.6rem] leading-none">
                  0{index + 1}
                </p>

                {/* The hairline is the join between the number and the step it
                    numbers — the same gold rule the product plates use — and it
                    runs out to the tool rather than stopping in mid-air. The
                    tool is decorative; the title below says it in words. */}
                <div className="mt-6 flex items-center gap-3">
                  <span aria-hidden className="bg-gold/40 h-px w-10" />
                  <stage.Icon
                    size={18}
                    strokeWidth={1.5}
                    className="text-gold"
                    aria-hidden
                  />
                </div>

                <h3 className="mt-6 text-xl leading-snug">{stage.title}</h3>

                <p className="text-cream-soft mt-3.5 text-[0.85rem] leading-relaxed">
                  {stage.copy}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <ButtonLink
            href="/contact#enquire"
            variant="gold"
            size="lg"
            className="mt-16"
          >
            {t.cta}
          </ButtonLink>
        </Reveal>
      </Container>
    </section>
  );
}
