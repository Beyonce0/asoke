import Link from "next/link";

import { getDictionary } from "@/i18n/server";

export default async function NotFound() {
  const t = (await getDictionary()).notFound;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="text-muted text-[0.65rem] tracking-[0.32em] uppercase">
        404
      </p>
      <h1 className="mt-6 max-w-lg text-3xl md:text-5xl">{t.title}</h1>
      <Link
        href="/"
        className="text-cream mt-10 text-xs tracking-[0.2em] uppercase underline underline-offset-4"
      >
        {t.home}
      </Link>
    </div>
  );
}
