import type { SiteSettings } from "@/types";

/*
 * How to reach the atelier, as shown on the contact page and the homepage.
 *
 * Settings win wherever they are filled in; these are what shipped with the
 * build, so a shop that has never opened Settings still shows a full set of
 * ways in rather than an empty column.
 */
const SHIPPED = {
  email: "hello@asoke.ng",
  whatsapp: "+234 000 000 0000",
  instagram: "@asoke",
};

export type Channel = {
  key: "orders" | "whatsapp" | "instagram" | "phone";
  value: string;
  href: string;
};

export function contactChannels(settings: SiteSettings): Channel[] {
  const email = settings.email || SHIPPED.email;
  const whatsapp = settings.whatsapp || SHIPPED.whatsapp;
  const instagram = settings.instagram || SHIPPED.instagram;

  return [
    { key: "orders", value: email, href: `mailto:${email}` },
    ...(settings.phone
      ? [
          {
            key: "phone" as const,
            value: settings.phone,
            href: `tel:${settings.phone.replace(/\s/g, "")}`,
          },
        ]
      : []),
    {
      key: "whatsapp",
      value: whatsapp,
      // wa.me wants digits only: no spaces, no plus.
      href: `https://wa.me/${whatsapp.replace(/\D/g, "")}`,
    },
    {
      key: "instagram",
      value: instagram,
      href: `https://instagram.com/${instagram.replace(/^@/, "")}`,
    },
  ];
}
