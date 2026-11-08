/*
 * What a client can book, and when.
 *
 * Shared by the storefront form and the action behind it, so the list a client
 * picks from and the list the server accepts can never drift apart. The
 * duration rides on the kind rather than being asked for — a client does not
 * know how long a fitting takes, the atelier does.
 */

export const APPOINTMENT_KINDS = [
  { kind: "Bespoke consultation", minutes: 60 },
  { kind: "Fabric consultation", minutes: 45 },
  { kind: "Wedding consultation", minutes: 90 },
  { kind: "Fitting", minutes: 60 },
] as const;

export type AppointmentKind = (typeof APPOINTMENT_KINDS)[number]["kind"];

/**
 * The hours a request may start at, Lagos wall-clock. Every booking arrives as
 * `requested` and the atelier confirms or moves it, so this only keeps
 * requests inside a sensible day — it is not a promise of availability.
 */
export const APPOINTMENT_SLOTS = [
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
] as const;

/** How far ahead the diary opens. */
export const BOOKING_WINDOW_DAYS = 120;

/**
 * A Lagos wall-clock string ("2026-08-20T14:30") as a UTC instant.
 *
 * Lagos is UTC+1 and does not observe daylight saving, which makes this exact.
 * Read against the atelier's zone, never the server's or the client's: a
 * booking made at 10:00 in Lagos must not become 11:00 because the deployment
 * moved to Frankfurt or the client is in London.
 */
export function lagosToInstant(local: string) {
  const parsed = new Date(`${local}:00+01:00`);
  return Number.isNaN(parsed.valueOf()) ? null : parsed;
}

/** Today's date in Lagos as "YYYY-MM-DD", whatever zone this runs in. */
export function lagosDate(offsetDays = 0) {
  const at = new Date(Date.now() + offsetDays * 86_400_000);
  return at.toLocaleDateString("en-CA", { timeZone: "Africa/Lagos" });
}
