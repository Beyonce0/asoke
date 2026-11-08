import type { Metadata } from "next";
import Link from "next/link";

import { AuthForm } from "@/components/ui/auth-form";
import { getDictionary } from "@/i18n/server";
import { signUp } from "../actions";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getDictionary();
  return { title: meta.signUp, robots: { index: false } };
}

export default async function SignUpPage() {
  const t = (await getDictionary()).auth;

  return (
    <>
      <h1 className="text-center text-3xl">{t.signUpTitle}</h1>
      <p className="text-muted mt-3 text-center text-sm">{t.signUpSub}</p>

      <div className="mt-10">
        <AuthForm action={signUp} submitLabel={t.createAccount} withName />
      </div>

      <p className="text-muted mt-8 text-center text-sm">
        {t.haveOne}{" "}
        <Link
          href="/sign-in"
          className="text-cream underline underline-offset-4"
        >
          {t.signIn}
        </Link>
      </p>
    </>
  );
}
