import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";

import { intlTag } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/server";
import { env } from "@/lib/env";

import "./globals.css";

/*
 * The `vietnamese` subset is not optional here: Yoruba's ẹ (U+1EB9) and
 * ọ (U+1ECD) live in that Unicode block. Without it the brand's own name
 * renders with fallback glyphs.
 */
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext", "vietnamese"],
  // Italic is a separate file, not a slant of the roman. Without asking for it
  // the browser fakes one by shearing the upright, which on a high-contrast
  // display serif looks obviously wrong.
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext", "vietnamese"],
  display: "swap",
});

/*
 * The tab title carries the tagline in the visitor's language. The description
 * stays in English: it is written for search engines and link previews, which
 * do not carry the visitor's cookie.
 */
export async function generateMetadata(): Promise<Metadata> {
  const { brand } = await getDictionary();

  return {
    ...metadata,
    title: { default: `ÀṢỌKÉ · ${brand.tagline}`, template: "%s · ÀṢỌKÉ" },
  };
}

const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  other: { google: "notranslate" },
  description:
    "Handwoven aso-oke, cut for the modern woman. Scarves and ready-to-wear made from cloth woven on Yoruba looms.",
  openGraph: {
    title: "ÀṢỌKÉ · Woven For Her",
    description:
      "Handwoven aso-oke, cut for the modern woman. Scarves and ready-to-wear made from cloth woven on Yoruba looms.",
    type: "website",
    locale: "en_NG",
  },
};

export const viewport: Viewport = {
  // Matches the intro panel, so the browser chrome does not flash ivory
  // before the loader paints.
  themeColor: "#0d0c0c",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();

  return (
    <html
      lang={intlTag(locale)}
      // The site translates itself. A browser translator layered on top
      // rewrites the brand ("Àṣọké" came back as "Axéké") and fights the
      // picker, so it is switched off for the whole document.
      translate="no"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      {/*
        Deliberately bare. The cart, Lenis and the intro curtain belong to the
        storefront and live in `(shop)/layout.tsx` — the admin runs in the same
        app and must not inherit a curtain over its screen, a hijacked scroll,
        or a shopping bag it has no use for.
      */}
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
