/*
 * The languages the storefront speaks.
 *
 * The choice lives in a cookie rather than the URL, so every address on the
 * site stays what it was — a link shared in Yorùbá opens the same page in
 * whatever language the person receiving it has chosen.
 *
 * Only the storefront's own words are translated. Product names, descriptions
 * and stories come from the database in the language they were written in.
 */

export const LOCALES = [
  { code: "en", name: "English", intl: "en-NG" },
  { code: "yo", name: "Yorùbá", intl: "yo-NG" },
  { code: "ig", name: "Igbo", intl: "ig-NG" },
  { code: "ha", name: "Hausa", intl: "ha-NG" },
  // ISO 639-3 has a code for Nigerian Pidgin, and CLDR formats dates in it.
  { code: "pcm", name: "Pidgin", intl: "pcm-NG" },
] as const;

export type Locale = (typeof LOCALES)[number]["code"];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_COOKIE = "locale";

export function isLocale(value: unknown): value is Locale {
  return LOCALES.some((locale) => locale.code === value);
}

/** The BCP 47 tag for `<html lang>` and for formatting dates. */
export function intlTag(locale: Locale) {
  return LOCALES.find((entry) => entry.code === locale)?.intl ?? "en-NG";
}

/** "Only {count} left" → "Only 2 left". Unknown names are left as written. */
export function fill(
  template: string,
  values: Record<string, string | number>,
) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
