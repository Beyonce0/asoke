import { CalendarDays } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { EnquiryForm } from "@/components/shop/enquiry-form";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getDictionary } from "@/i18n/server";
import { contactChannels } from "@/lib/contact";
import type { SiteSettings } from "@/types";

/*
 * The last thing on the homepage before the footer: a way to ask.
 *
 * The form writes to the dashboard's Inbox, so a question asked here is seen
 * by everyone at the atelier rather than lost in one person's email. The
 * direct lines sit beside it for anyone who would rather message or call.
 */
export async function ContactSection({ settings }: { settings: SiteSettings }) {
  const dictionary = await getDictionary();
  const t = dictionary.home.reach;
  const labels = dictionary.contact;
  const channels = contactChannels(settings);

  return (
    <section
      id="contact"
      aria-label={t.label}
      className="bg-charcoal relative w-full py-24 md:py-36"
    >
      <Container className="grid gap-16 lg:grid-cols-[1fr_1.15fr] lg:gap-24">
        <div>
          <Reveal>
            <p className="text-gold text-[0.65rem] tracking-[0.32em] uppercase">
              {t.eyebrow}
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="mt-6 text-[clamp(1.9rem,4.4vw,3.5rem)] leading-tight">
              {t.title}
            </h2>
          </Reveal>

          <Reveal delay={0.14}>
            <p className="text-cream-soft mt-7 max-w-md text-base leading-relaxed">
              {t.body}
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <dl className="border-line mt-12 grid gap-7 border-t pt-10 sm:grid-cols-2">
              {channels.map((channel) => (
                <div key={channel.key}>
                  <dt className="text-muted text-[0.62rem] tracking-[0.24em] uppercase">
                    {labels[channel.key]}
                  </dt>
                  <dd className="mt-2">
                    <a
                      href={channel.href}
                      className="hover:text-gold text-base break-words transition-colors"
                    >
                      {channel.value}
                    </a>
                  </dd>
                </div>
              ))}

              {settings.opening_hours && (
                <div>
                  <dt className="text-muted text-[0.62rem] tracking-[0.24em] uppercase">
                    {t.hours}
                  </dt>
                  <dd className="text-cream-soft mt-2 text-sm leading-relaxed">
                    {settings.opening_hours}
                  </dd>
                </div>
              )}

              <div>
                <dt className="text-muted text-[0.62rem] tracking-[0.24em] uppercase">
                  {t.visit}
                </dt>
                <dd className="text-cream-soft mt-2 text-sm leading-relaxed">
                  {settings.address || labels.place}
                  <br />
                  {labels.byAppointment}
                </dd>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={0.26}>
            <ButtonLink
              href="/book"
              variant="gold"
              size="lg"
              className="group mt-12 w-full font-semibold sm:w-auto"
            >
              <CalendarDays
                className="size-4 transition-transform duration-300 group-hover:-rotate-6"
                strokeWidth={1.75}
                aria-hidden
              />
              {t.book}
            </ButtonLink>
          </Reveal>
        </div>

        {/* Surface, so the form lifts off the page the way the drawer does. */}
        <Reveal delay={0.12}>
          <div className="bg-surface border-gold/15 border p-7 sm:p-10">
            <EnquiryForm />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
