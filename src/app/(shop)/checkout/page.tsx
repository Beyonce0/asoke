import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { getDictionary } from "@/i18n/server";
import { CheckoutForm } from "./checkout-form";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getDictionary();
  return { title: meta.checkout, robots: { index: false } };
}

export default async function CheckoutPage() {
  const t = await getDictionary();

  return (
    <Container className="py-16 md:py-24">
      <h1 className="text-4xl md:text-6xl">{t.checkout.title}</h1>
      <div className="mt-14">
        <CheckoutForm />
      </div>
    </Container>
  );
}
