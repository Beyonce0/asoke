import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { getDictionary } from "@/i18n/server";

/*
 * One cloth, five people wearing it.
 *
 * The versatility argument is made twice on this page and only one of them is
 * a picture: the strip up top shows five women, and this is where that idea is
 * said out loud and turned into a door — each moment leads into the shop
 * already filtered for it.
 *
 * Where a moment maps onto a real collection it links to that collection, and
 * where it does not it opens the shop whole. Nothing here invents a filter the
 * catalogue cannot honour.
 */

/* Where each moment leads, in the order the dictionary lists them. */
const LINKS = [
  { href: "/shop?collection=bridal", image: "/images/looks/look-04.jpg" },
  {
    href: "/shop?collection=ready-to-wear",
    image: "/images/looks/look-01.jpg",
  },
  { href: "/shop?collection=scarves", image: "/images/looks/look-05.jpg" },
  {
    href: "/shop?collection=ready-to-wear",
    image: "/images/looks/look-02.jpg",
  },
];

export async function Moments() {
  const t = (await getDictionary()).home.moments;
  const moments = t.items.map((item, index) => ({ ...item, ...LINKS[index] }));

  return (
    <section
      id="moments"
      aria-label={t.eyebrow}
      className="bg-surface relative w-full py-24 md:py-36"
    >
      <Container>
        <Reveal>
          <p className="text-gold text-[0.65rem] tracking-[0.32em] uppercase">
            {t.eyebrow}
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="mt-6 max-w-2xl text-[clamp(1.9rem,4.4vw,3.5rem)] leading-tight">
            {t.title}
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {moments.map((moment, index) => (
            <Reveal key={moment.label} delay={(index % 4) * 0.07}>
              <Link href={moment.href} className="group block">
                <div className="bg-charcoal relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={moment.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 23vw, (min-width: 640px) 45vw, 90vw"
                    className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.05]"
                  />

                  {/* Holds the label legible over whatever the frame is
                      doing underneath it. */}
                  <div
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-1/2"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(13,12,12,0.85), transparent)",
                    }}
                  />
                </div>

                <h3 className="group-hover:text-gold mt-4 font-sans text-[0.65rem] tracking-[0.28em] uppercase transition-colors">
                  {moment.label}
                </h3>

                <p className="text-cream-soft mt-2 text-[0.8rem] leading-relaxed">
                  {moment.copy}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
