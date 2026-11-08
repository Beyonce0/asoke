"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  APPOINTMENT_KINDS,
  APPOINTMENT_SLOTS,
  BOOKING_WINDOW_DAYS,
  lagosDate,
  lagosToInstant,
} from "@/lib/appointments";
import { fill, intlTag } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { getDictionary, getLocale } from "@/i18n/server";
import { isConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export type BookingState = { error?: string; booked?: string };

const kinds = APPOINTMENT_KINDS.map((option) => option.kind) as [
  string,
  ...string[],
];

/** Built per request, so the messages arrive in the visitor's language. */
function bookingSchema(errors: Dictionary["book"]["errors"]) {
  return z.object({
    fullName: z.string().trim().min(2, errors.name).max(120),
    email: z.email(errors.email),
    phone: z.string().trim().max(40).optional(),
    kind: z.enum(kinds, errors.kind),
    date: z.iso.date(errors.date),
    time: z.enum(APPOINTMENT_SLOTS, errors.time),
    notes: z.string().trim().max(1000).optional(),
  });
}

/*
 * A request, not a booking. It lands as `requested` and the atelier confirms
 * or moves it from the dashboard — nothing here claims the hour is free.
 *
 * Written with the visitor's own client: the "anyone may request an
 * appointment" policy allows the insert and nothing else, so a signed-out
 * visitor can add a row but never read the diary back. That is also why the
 * insert has no `.select()` — asking for the row would be refused.
 */
export async function requestAppointment(
  _previous: BookingState,
  formData: FormData,
): Promise<BookingState> {
  const [locale, { book: t }] = await Promise.all([
    getLocale(),
    getDictionary(),
  ]);

  // A field no person sees. Anything that fills it in is a script; it gets a
  // thank-you as a person would, and nothing is written.
  if (formData.get("hp_extra")) {
    console.warn("[book:requestAppointment] spam trap filled; request dropped");
    return { booked: t.thanksTitle };
  }

  const parsed = bookingSchema(t.errors).safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    kind: formData.get("kind"),
    date: formData.get("date"),
    time: formData.get("time"),
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  const { fullName, email, phone, kind, date, time, notes } = parsed.data;

  const startsAt = lagosToInstant(`${date}T${time}`);
  if (!startsAt) return { error: t.errors.date };

  // The same bounds the date picker shows, compared as Lagos calendar dates.
  if (date < lagosDate(1)) {
    return { error: t.errors.tooSoon };
  }
  if (date > lagosDate(BOOKING_WINDOW_DAYS)) {
    return { error: fill(t.errors.tooFar, { days: BOOKING_WINDOW_DAYS }) };
  }

  if (!isConfigured) {
    return { error: t.errors.notConnected };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("appointments").insert({
    user_id: user?.id ?? null,
    full_name: fullName,
    email,
    phone: phone || null,
    kind,
    starts_at: startsAt.toISOString(),
    duration_minutes:
      APPOINTMENT_KINDS.find((option) => option.kind === kind)?.minutes ?? 60,
    notes: notes || null,
  });

  if (error) {
    console.error("[book:requestAppointment]", error.code, error.message);
    return { error: t.errors.failed };
  }

  revalidatePath("/admin/appointments");

  const when = startsAt.toLocaleString(intlTag(locale), {
    timeZone: "Africa/Lagos",
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

  return {
    booked: fill(t.thanksBody, {
      visit: t.kinds[kind as keyof typeof t.kinds],
      when,
    }),
  };
}
