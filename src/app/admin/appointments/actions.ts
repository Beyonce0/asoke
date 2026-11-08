"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin";
import { lagosToInstant } from "@/lib/appointments";

/*
 * Confirm, move, or drop.
 *
 * Moving one is the interesting case: the hour comes in from a browser as a
 * local wall-clock string with no zone attached, so it is read against the
 * atelier's own timezone rather than the server's. A booking made at 10:00 in
 * Lagos must not become 11:00 because the deployment moved to Frankfurt.
 */

const schema = z.object({
  id: z.uuid(),
  status: z
    .enum(["requested", "confirmed", "completed", "cancelled"])
    .optional(),
  /** "2026-08-20T14:30" from a datetime-local input. Optional. */
  startsAt: z.string().trim().optional(),
});

export type Result = { ok: true } | { ok: false; error: string };

export async function updateAppointment(
  input: z.input<typeof schema>,
): Promise<Result> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid request." };

  const { id, status, startsAt } = parsed.data;

  const patch: { status?: typeof status; starts_at?: string } = {};

  if (status) patch.status = status;

  if (startsAt) {
    const instant = lagosToInstant(startsAt);
    if (!instant) return { ok: false, error: "That is not a valid time." };
    patch.starts_at = instant.toISOString();
  }

  if (Object.keys(patch).length === 0) {
    return { ok: false, error: "Nothing to change." };
  }

  let supabase;
  try {
    ({ supabase } = await requireAdmin());
  } catch {
    return { ok: false, error: "You are not signed in as an admin." };
  }

  const { error } = await supabase
    .from("appointments")
    .update(patch)
    .eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/appointments");

  return { ok: true };
}
