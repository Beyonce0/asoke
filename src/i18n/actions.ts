"use server";

import { cookies } from "next/headers";

import { LOCALE_COOKIE, isLocale } from "./config";

/*
 * Remembers the choice for a year. Setting a cookie from a server action makes
 * Next re-render the current page, so the new language arrives without a
 * reload and without losing the bag or the scroll position.
 */
export async function setLocale(value: string) {
  if (!isLocale(value)) return;

  (await cookies()).set(LOCALE_COOKIE, value, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
