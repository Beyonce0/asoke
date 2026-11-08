"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import type { Dictionary } from "@/i18n/dictionaries/en";
import { getDictionary } from "@/i18n/server";
import { env } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; notice?: string };

/** Built per request, so the messages arrive in the visitor's language. */
function credentials(errors: Dictionary["auth"]["errors"]) {
  return z.object({
    email: z.email(errors.email),
    password: z.string().min(8, errors.password),
  });
}

/** Only allow same-site redirects — an open redirect here is a phishing hole. */
function safeNext(value: FormDataEntryValue | null) {
  return typeof value === "string" &&
    value.startsWith("/") &&
    !value.startsWith("//")
    ? value
    : "/account";
}

export async function signIn(
  _previous: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const t = (await getDictionary()).auth;

  const parsed = credentials(t.errors).safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    /*
     * The real reason goes to the server log, never to the screen. "No account
     * with that email" would let anyone test which addresses have accounts
     * here, so wrong password and unknown email deliberately read the same.
     *
     * The two exceptions below are not about credentials at all — telling
     * someone their password is wrong when the truth is "confirm your email"
     * or "you have tried too many times" sends them to reset a password that
     * was right all along.
     */
    console.error("[auth:signIn]", error.code ?? error.status, error.message);

    if (error.code === "email_not_confirmed") {
      return { error: t.errors.unconfirmed };
    }

    if (error.code === "over_request_rate_limit" || error.status === 429) {
      return { error: t.errors.rateLimit };
    }

    return { error: t.errors.mismatch };
  }

  revalidatePath("/", "layout");
  redirect(safeNext(formData.get("next")));
}

export async function signUp(
  _previous: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const t = (await getDictionary()).auth;

  const parsed = credentials(t.errors).safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  const fullName = String(formData.get("fullName") ?? "").trim();

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    ...parsed.data,
    options: {
      data: { full_name: fullName || null },
      emailRedirectTo: `${env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) return { error: error.message };

  return { notice: t.confirmNotice };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/");
}
