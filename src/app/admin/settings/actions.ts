"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin";

/*
 * The one settings row, updated in place.
 *
 * Every field is optional and empty means null, which the storefront reads as
 * "use what ships in the build". Clearing the hero film is therefore a way of
 * reverting to the one in the repository, not a way of breaking the front page.
 */

const optional = z
  .string()
  .trim()
  .max(500)
  .optional()
  .transform((value) => value || null);

const schema = z.object({
  email: optional,
  phone: optional,
  whatsapp: optional,
  address: optional,
  openingHours: optional,
  instagram: optional,
  heroImage: optional,
  heroVideoMp4: optional,
  heroVideoWebm: optional,
  craftImage: optional,
  turnaround: optional,
});

export type SettingsInput = z.input<typeof schema>;
export type Result = { ok: true } | { ok: false; error: string };

export async function saveSettings(input: SettingsInput): Promise<Result> {
  const parsed = schema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid." };
  }

  const settings = parsed.data;

  let supabase;
  try {
    ({ supabase } = await requireAdmin());
  } catch {
    return { ok: false, error: "You are not signed in as an admin." };
  }

  const { error } = await supabase
    .from("site_settings")
    .update({
      email: settings.email,
      phone: settings.phone,
      whatsapp: settings.whatsapp,
      address: settings.address,
      opening_hours: settings.openingHours,
      instagram: settings.instagram,
      hero_image: settings.heroImage,
      hero_video_mp4: settings.heroVideoMp4,
      hero_video_webm: settings.heroVideoWebm,
      craft_image: settings.craftImage,
      turnaround: settings.turnaround,
    })
    // The row is the table. `eq` on the constant key rather than a blanket
    // update, so a stray migration adding a second row could never be caught
    // by this by accident.
    .eq("id", true);

  if (error) return { ok: false, error: error.message };

  // Contact details are in the footer of every page, and the hero is on the
  // front one. Both are cached, so both have to be told.
  revalidatePath("/", "layout");

  return { ok: true };
}
