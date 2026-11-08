import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { getDictionary } from "@/i18n/server";
import { BookingForm } from "./booking-form";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getDictionary();
  return { title: meta.book, description: meta.bookDescription };
}

export default async function BookPage() {
  const t = (await getDictionary()).book;

  return (
    <Container className="py-16 md:py-28">
      <h1 className="text-4xl md:text-6xl">{t.title}</h1>

      <div className="mt-14 grid gap-16 md:grid-cols-[1fr_1.2fr]">
        <div className="max-w-md">
          <p className="text-cream-soft text-base leading-relaxed">{t.intro}</p>
          <p className="text-muted mt-6 text-sm leading-relaxed">{t.note}</p>
        </div>

        <BookingForm />
      </div>
    </Container>
  );
}
