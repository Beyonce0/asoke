import Link from "next/link";

import { Container } from "@/components/ui/container";
import { getDictionary } from "@/i18n/server";
import { getSiteSettings } from "@/lib/queries";

const COLUMNS = [
  {
    title: "shop",
    links: [
      { href: "/shop", label: "allPieces" },
      { href: "/shop?collection=scarves", label: "scarves" },
      { href: "/shop?collection=ready-to-wear", label: "readyToWear" },
    ],
  },
  {
    title: "house",
    links: [
      { href: "/about", label: "craft" },
      { href: "/book", label: "book" },
      { href: "/contact", label: "contact" },
    ],
  },
  {
    title: "care",
    links: [
      { href: "/shipping", label: "shipping" },
      { href: "/returns", label: "returns" },
      { href: "/privacy", label: "privacy" },
    ],
  },
] as const;

/*
 * Contact details come from Settings and each one is rendered only if it is
 * set — an atelier with no WhatsApp number shows no WhatsApp line, rather than
 * a label with nothing after it.
 */
export async function Footer() {
  const [settings, t] = await Promise.all([getSiteSettings(), getDictionary()]);

  const reach = [
    settings.email && {
      href: `mailto:${settings.email}`,
      label: settings.email,
    },
    settings.phone && { href: `tel:${settings.phone}`, label: settings.phone },
    settings.whatsapp && {
      // wa.me wants digits only — no spaces, no plus.
      href: `https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`,
      label: "WhatsApp",
    },
    settings.instagram && {
      href: `https://instagram.com/${settings.instagram.replace(/^@/, "")}`,
      label: settings.instagram,
    },
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <footer className="bg-navy text-cream mt-32">
      <Container className="py-20">
        <div className="grid gap-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <p translate="no" className="wordmark text-2xl">
              Àṣọké
            </p>
            <p className="text-cream/55 mt-5 max-w-xs text-sm leading-relaxed">
              {t.footer.blurb}
            </p>

            {reach.length > 0 && (
              <ul className="mt-7 space-y-2 text-sm">
                {reach.map((line) => (
                  <li key={line.href}>
                    <a
                      href={line.href}
                      className="text-cream/70 hover:text-cream transition-colors"
                    >
                      {line.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}

            {settings.address && (
              <p className="text-cream/40 mt-5 max-w-xs text-xs leading-relaxed">
                {settings.address}
              </p>
            )}

            {settings.opening_hours && (
              <p className="text-cream/40 mt-2 max-w-xs text-xs leading-relaxed">
                {settings.opening_hours}
              </p>
            )}
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-cream/40 font-sans text-[0.65rem] tracking-[0.24em] uppercase">
                {t.footer[column.title]}
              </h3>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-cream/75 hover:text-gold-light text-sm transition-colors"
                    >
                      {t.footer[link.label]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-cream/12 text-cream/40 mt-20 flex flex-col gap-3 border-t pt-8 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} <span translate="no">ÀṢỌKÉ</span>.{" "}
            {t.footer.tagline}
          </p>
          <p>{t.footer.place}</p>
        </div>
      </Container>
    </footer>
  );
}
