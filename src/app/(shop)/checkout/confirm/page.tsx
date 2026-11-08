import type { Metadata } from "next";

import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getDictionary } from "@/i18n/server";
import { fulfillOrder } from "@/lib/orders";
import { ClearCart } from "./clear-cart";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getDictionary();
  return { title: meta.confirm, robots: { index: false } };
}

export default async function ConfirmPage({
  searchParams,
}: PageProps<"/checkout/confirm">) {
  const params = await searchParams;
  const t = (await getDictionary()).confirm;

  // Paystack sends `reference`; older integrations receive `trxref`.
  const raw = params.reference ?? params.trxref;
  const reference = Array.isArray(raw) ? raw[0] : raw;

  const result = reference
    ? await fulfillOrder(reference)
    : ({ ok: false, reason: "unknown-order" } as const);

  if (!result.ok) {
    return (
      <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <p className="text-danger text-[0.65rem] tracking-[0.32em] uppercase">
          {t.failedEyebrow}
        </p>
        <h1 className="mt-6 max-w-xl text-3xl md:text-5xl">{t.failedTitle}</h1>
        <p className="text-cream-soft mt-6 max-w-md text-sm leading-relaxed">
          {t.failures[result.reason]}
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/checkout">{t.tryAgain}</ButtonLink>
          <ButtonLink href="/contact" variant="outline">
            {t.contactUs}
          </ButtonLink>
        </div>
      </Container>
    );
  }

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <ClearCart />

      <p className="text-muted text-[0.65rem] tracking-[0.32em] uppercase">
        {t.okEyebrow}
      </p>
      <h1 className="mt-6 max-w-2xl text-3xl md:text-5xl">{t.okTitle}</h1>
      <p className="text-cream-soft mt-6 max-w-md text-sm leading-relaxed">
        {t.okBefore}{" "}
        <span className="text-cream font-medium">{result.reference}</span>.{" "}
        {t.okAfter}
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/account/orders">{t.viewOrders}</ButtonLink>
        <ButtonLink href="/shop" variant="outline">
          {t.continue}
        </ButtonLink>
      </div>
    </Container>
  );
}
