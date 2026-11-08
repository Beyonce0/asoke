"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin";
import { slugify } from "@/lib/utils";

/*
 * Cloth, written down.
 *
 * TWO KINDS OF NUMBER, AND THEY ARE NOT THE SAME. The price per metre is money
 * and becomes an integer number of kobo, exactly like everything else in this
 * codebase. The metres are a measurement and stay decimal — 2.5m is a real
 * length and rounding it to 3 would be lying about the shelf.
 */

const money = z
  .string()
  .trim()
  .transform((value) => value.replace(/[^\d.]/g, ""))
  .transform((value) => (value === "" ? null : Math.round(Number(value) * 100)))
  .refine((kobo) => kobo === null || (Number.isFinite(kobo) && kobo >= 0), {
    message: "Price must be a number.",
  });

const metres = z
  .string()
  .trim()
  .transform((value) => value.replace(/[^\d.]/g, ""))
  .refine((value) => value === "" || Number.isFinite(Number(value)), {
    message: "Metres must be a number.",
  })
  // Two decimals, matching numeric(10,2). Sent as a string so no float ever
  // stands between what was typed and what is stored.
  .transform((value) => (value === "" ? "0" : Number(value).toFixed(2)));

const schema = z.object({
  id: z.uuid().optional(),
  name: z.string().trim().min(2, "Give the cloth a name."),
  slug: z.string().trim().optional(),
  origin: z.string().trim().max(120).optional(),
  pattern: z.string().trim().max(160).optional(),
  /** Typed as one line — "Bronze, Gold" — and split on the way in. */
  colours: z.string().trim().max(300).optional(),
  width: z.string().trim().optional(),
  pricePerMetre: money,
  metresAvailable: metres,
  description: z.string().trim().max(1200).optional(),
  image: z.string().trim().nullable(),
  isActive: z.boolean(),
});

export type FabricInput = z.input<typeof schema>;
export type Result = { ok: true; id: string } | { ok: false; error: string };

export async function saveFabric(input: FabricInput): Promise<Result> {
  const parsed = schema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid." };
  }

  const fabric = parsed.data;
  const slug = fabric.slug?.trim() || slugify(fabric.name);

  const width = fabric.width?.replace(/[^\d]/g, "");

  let supabase;
  try {
    ({ supabase } = await requireAdmin());
  } catch {
    return { ok: false, error: "You are not signed in as an admin." };
  }

  const row = {
    name: fabric.name,
    slug,
    origin: fabric.origin || null,
    pattern: fabric.pattern || null,
    colours: (fabric.colours ?? "")
      .split(",")
      .map((colour) => colour.trim())
      .filter(Boolean),
    width_cm: width ? Number(width) : null,
    price_per_metre: fabric.pricePerMetre,
    metres_available: fabric.metresAvailable,
    description: fabric.description || null,
    image: fabric.image || null,
    is_active: fabric.isActive,
  };

  const saved = fabric.id
    ? await supabase
        .from("fabrics")
        .update(row)
        .eq("id", fabric.id)
        .select("id")
        .maybeSingle()
    : await supabase.from("fabrics").insert(row).select("id").maybeSingle();

  if (saved.error || !saved.data) {
    const message =
      saved.error?.code === "23505"
        ? `The slug "${slug}" is already taken.`
        : (saved.error?.message ?? "Could not save the cloth.");

    return { ok: false, error: message };
  }

  revalidatePath("/admin/fabrics");

  return { ok: true, id: saved.data.id };
}

export async function deleteFabric(id: string): Promise<Result> {
  let supabase;
  try {
    ({ supabase } = await requireAdmin());
  } catch {
    return { ok: false, error: "You are not signed in as an admin." };
  }

  const { error } = await supabase.from("fabrics").delete().eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/fabrics");

  return { ok: true, id };
}
