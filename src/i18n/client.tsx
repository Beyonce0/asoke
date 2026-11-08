"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries/en";

/*
 * Client components read the same dictionary the server chose. Only the active
 * language crosses to the browser — the provider is handed one dictionary, not
 * all five.
 */
const I18nContext = createContext<{ locale: Locale; t: Dictionary } | null>(
  null,
);

export function I18nProvider({
  locale,
  dictionary,
  children,
}: {
  locale: Locale;
  dictionary: Dictionary;
  children: ReactNode;
}) {
  return (
    <I18nContext.Provider value={{ locale, t: dictionary }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside <I18nProvider>.");
  return context;
}
