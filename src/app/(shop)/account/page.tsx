import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getDictionary } from "@/i18n/server";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/(auth)/actions";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getDictionary();
  return { title: meta.account, robots: { index: false } };
}

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware already gates this, but a page that reads user data should
  // never depend on the gate staying in place.
  if (!user) redirect("/sign-in?next=/account");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, role")
    .eq("id", user.id)
    .maybeSingle();

  /*
   * The only door from the shop into the dashboard. Rendered for admins alone
   * — not as security, since `/admin` checks the role itself and RLS refuses
   * the data regardless, but because a link a customer cannot use is a link
   * that only invites them to try.
   */
  const isAdmin = profile?.role === "admin";
  const t = (await getDictionary()).account;

  return (
    <Container className="py-16 md:py-24">
      <h1 className="text-4xl md:text-6xl">
        {profile?.full_name?.split(" ")[0] ?? t.title}
      </h1>

      <div className="mt-14 grid gap-10 md:grid-cols-2 lg:max-w-4xl">
        <section className="border-line border-t pt-6">
          <h2 className="text-muted font-sans text-[0.65rem] tracking-[0.24em] uppercase">
            {t.details}
          </h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">{t.email}</dt>
              <dd className="text-right">{user.email}</dd>
            </div>
            {profile?.phone && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted">{t.phone}</dt>
                <dd>{profile.phone}</dd>
              </div>
            )}
          </dl>

          <form action={signOut} className="mt-8">
            <Button type="submit" variant="outline" size="sm">
              {t.signOut}
            </Button>
          </form>
        </section>

        <section className="border-line border-t pt-6">
          <h2 className="text-muted font-sans text-[0.65rem] tracking-[0.24em] uppercase">
            {t.orders}
          </h2>
          <p className="text-cream-soft mt-5 text-sm leading-relaxed">
            {t.ordersBody}
          </p>
          <Link
            href="/account/orders"
            className="text-cream mt-6 inline-block text-xs tracking-[0.2em] uppercase underline underline-offset-4"
          >
            {t.viewOrders}
          </Link>
        </section>

        {isAdmin && (
          <section className="border-gold/30 border-t pt-6 md:col-span-2">
            <h2 className="text-gold font-sans text-[0.65rem] tracking-[0.24em] uppercase">
              {t.atelier}
            </h2>
            <p className="text-cream-soft mt-5 text-sm leading-relaxed">
              {t.atelierBody}
            </p>
            <Link
              href="/admin"
              className="bg-gold text-charcoal hover:bg-gold-light mt-6 inline-flex h-11 items-center rounded-md px-6 text-xs font-medium tracking-[0.18em] uppercase transition-colors"
            >
              {t.dashboard}
            </Link>
          </section>
        )}
      </div>
    </Container>
  );
}
