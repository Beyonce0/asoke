import Link from "next/link";

import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { I18nProvider } from "@/i18n/client";
import { getDictionary, getLocale } from "@/i18n/server";

export default async function AuthLayout({ children }: LayoutProps<"/">) {
  const [locale, dictionary] = await Promise.all([
    getLocale(),
    getDictionary(),
  ]);

  return (
    <I18nProvider locale={locale} dictionary={dictionary}>
      <div className="flex min-h-dvh flex-col">
        <header className="relative flex justify-center py-10">
          <div className="absolute top-8 right-4 sm:right-8">
            <LanguageSwitcher />
          </div>
          <Link href="/" translate="no" className="wordmark text-xl">
            Àṣọké
          </Link>
        </header>

        <main className="flex flex-1 items-start justify-center px-6 pb-24">
          <div className="w-full max-w-sm">{children}</div>
        </main>
      </div>
    </I18nProvider>
  );
}
