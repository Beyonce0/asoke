import type { Metadata } from "next";
import { CalendarDays } from "lucide-react";

import { EnquiryForm } from "@/components/shop/enquiry-form";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getDictionary } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getDictionary();
  return { title: meta.contact, description: meta.contactDescription };
}

const CHANNELS = [
  {
    key: "orders",
    value: "hello@asoke.ng",
    href: "mailto:hello@asoke.ng",
  },
  {
    key: "whatsapp",
    value: "+234 000 000 0000",
    href: "https://wa.me/2340000000000",
  },
  { key: "instagram", value: "@asoke", href: "https://instagram.com/asoke" },
] as const;

export default async function ContactPage() {
  const dictionary = await getDictionary();
  const t = dictionary.contact;

  return (
    <Container className="py-16 md:py-28">
      <h1 className="text-4xl md:text-6xl">{t.title}</h1>

      <div className="mt-14 grid gap-16 md:grid-cols-2">
        <div className="max-w-md">
          <p className="text-cream-soft text-base leading-relaxed">{t.intro}</p>

          <dl className="mt-12 space-y-8">
            {CHANNELS.map((channel) => (
              <div key={channel.key}>
                <dt className="text-muted text-[0.65rem] tracking-[0.24em] uppercase">
                  {t[channel.key]}
                </dt>
                <dd className="mt-2">
                  <a
                    href={channel.href}
                    className="hover:text-gold text-lg transition-colors"
                  >
                    {channel.value}
                  </a>
                </dd>
              </div>
            ))}
          </dl>

          <div className="bg-surface mt-14 p-8 sm:p-10">
            <h2 className="font-sans text-[0.7rem] tracking-[0.24em] uppercase">
              {t.atelier}
            </h2>
            <address className="text-cream-soft mt-5 text-sm leading-relaxed not-italic">
              {t.place}
              <br />
              {t.byAppointment}
            </address>
            <ButtonLink
              href="/book"
              variant="gold"
              size="lg"
              className="group mt-8 w-full font-semibold sm:w-auto"
            >
              <CalendarDays
                className="size-4 transition-transform duration-300 group-hover:-rotate-6"
                strokeWidth={1.75}
                aria-hidden
              />
              {t.book}
            </ButtonLink>
            <p className="text-muted mt-8 text-xs leading-relaxed">
              {t.shipping}
            </p>
          </div>
        </div>

        {/*
          The same form and the same action as the homepage section, so a
          message sent from either lands in the same inbox and the same Make
          scenario. "Begin a commission" links here, to #enquire.
        */}
        <div id="enquire" className="scroll-mt-28">
          <h2 className="text-2xl md:text-3xl">
            {dictionary.home.reach.title}
          </h2>
          <div className="bg-surface border-gold/15 mt-6 border p-7 sm:p-10">
            <EnquiryForm />
          </div>
        </div>
      </div>
    </Container>
  );
}
