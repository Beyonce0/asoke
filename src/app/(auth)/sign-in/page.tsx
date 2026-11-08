import type { Metadata } from "next";
import Link from "next/link";

import { AuthForm } from "@/components/ui/auth-form";
import { getDictionary } from "@/i18n/server";
import { signIn } from "../actions";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getDictionary();
  return { title: meta.signIn, robots: { index: false } };
}

export default async function SignInPage({
  searchParams,
}: PageProps<"/sign-in">) {
  const { next } = await searchParams;
  const t = (await getDictionary()).auth;

  return (
    <>
      <h1 className="text-center text-3xl">{t.signInTitle}</h1>
      <p className="text-muted mt-3 text-center text-sm">{t.signInSub}</p>

      <div className="mt-10">
        <AuthForm
          action={signIn}
          submitLabel={t.signIn}
          next={typeof next === "string" ? next : undefined}
        />
      </div>

      <p className="text-muted mt-8 text-center text-sm">
        {t.newHere}{" "}
        <Link
          href="/sign-up"
          className="text-cream underline underline-offset-4"
        >
          {t.createLink}
        </Link>
      </p>
    </>
  );
}
