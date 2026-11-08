import "server-only";

import { cookies } from "next/headers";

import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, type Locale } from "./config";
import { en, type Dictionary } from "./dictionaries/en";
import { ha } from "./dictionaries/ha";
import { ig } from "./dictionaries/ig";
import { pcm } from "./dictionaries/pcm";
import { yo } from "./dictionaries/yo";

const DICTIONARIES: Record<Locale, Dictionary> = { en, yo, ig, ha, pcm };

/*
 * The visitor's language, from the cookie the switcher sets.
 *
 * Reading a cookie makes the page render per request rather than from a
 * prebuilt copy — the price of serving one URL in five languages without a
 * flash of English first.
 */
export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export async function getDictionary(): Promise<Dictionary> {
  return DICTIONARIES[await getLocale()];
}
