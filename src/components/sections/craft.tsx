import Image from "next/image";

import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { getDictionary } from "@/i18n/server";

/*
 * The craft — where the cloth comes from, before it is a garment.
 *
 * This replaces the flat navy block that used to sit on the homepage. The copy
 * survived it; what it lacked was the photograph, and a section about handwork
 * with no picture of hands is an odd thing to ask anyone to believe.
 *
 * Charcoal, like everything around it. The photograph is nearly black to its
 * own edges, so it does not need a coloured wall to sit on — on charcoal the
 * frame stops being a rectangle pasted onto a panel and becomes a lit corner
 * of the same room the rest of the page is in.
 */

/*
 * The hands, in order. Set as a tracked line under the picture, it does the
 * work a caption would and reads as a process rather than a list.
 */
/** Overridable from Settings; falls back to the frame in the repository. */
const SHIPPED_IMAGE = "/images/craft.png";

export async function Craft({ image }: { image?: string | null }) {
  const t = (await getDictionary()).home.craft;

  return (
    <section
      id="craft"
      aria-label={t.label}
      className="bg-charcoal relative w-full py-24 md:py-32"
    >
      <Container className="grid items-center gap-14 lg:grid-cols-2 lg:gap-24">
        <Reveal>
          {/* 2:3, which is the frame's own ratio — the loom runs to the bottom
              left corner and the figure to the top right, so a squarer crop
              takes one end of the picture or the other. */}
          <div className="relative aspect-[2/3] overflow-hidden">
            <Image
              src={image || SHIPPED_IMAGE}
              alt={t.imageAlt}
              fill
              sizes="(min-width: 1024px) 45vw, 92vw"
              className="object-cover"
            />

            {/* Sinks the foot of the frame so the line of verbs below reads as
                part of the picture rather than a caption stuck under it. */}
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-1/3"
              style={{
                background:
                  "linear-gradient(to top, rgba(13,12,12,0.9), transparent)",
              }}
            />

            <ul className="absolute inset-x-0 bottom-0 flex flex-wrap gap-x-5 gap-y-2 p-6 md:p-8">
              {t.hands.map((hand) => (
                <li
                  key={hand}
                  className="text-cream-soft text-[0.6rem] tracking-[0.28em] uppercase"
                >
                  {hand}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="text-gold text-[0.65rem] tracking-[0.32em] uppercase">
              {t.eyebrow}
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="mt-7 text-[clamp(1.8rem,4vw,3.2rem)] leading-tight">
              {t.title}
            </h2>
          </Reveal>

          <Reveal delay={0.14}>
            <p className="text-cream-soft mt-8 text-base leading-relaxed">
              {t.body1}
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-cream-soft mt-6 text-base leading-relaxed">
              {t.body2}
            </p>
          </Reveal>

          <Reveal delay={0.26}>
            <ButtonLink href="/about" variant="gold" className="mt-10">
              {t.cta}
            </ButtonLink>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
