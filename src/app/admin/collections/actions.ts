"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin";
import { slugify } from "@/lib/utils";

/*
 * A collection is how the shop groups pieces, and its slug is a public URL —
 * /shop?collection=bridal. Renaming one is free; re-slugging one breaks every
 * link anybody has shared, which is why the field is editable but separate
 * from the name rather than derived from it on every save.
 */

const schema = z.object({
  id: z.uuid().optional(),
  name: z.string().trim().min(2, "Give the collection a name."),
  slug: z.string().trim().optional(),
  description: z.string().trim().max(600).optional(),
  heroImage: z.string().trim().nullable(),
  sortOrder: z.coerce.number().int().min(0).max(999),
});

export type CollectionInput = z.input<typeof schema>;
export type Result = { ok: true; id: string } | { ok: false; error: string };

export async function saveCollection(input: CollectionInput): Promise<Result> {
  const parsed = schema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid." };
  }

  const collection = parsed.data;
  const slug = collection.slug?.trim() || slugify(collection.name);

  let supabase;
  try {
    ({ supabase } = await requireAdmin());
  } catch {
    return { ok: false, error: "You are not signed in as an admin." };
  }

  const row = {
    name: collection.name,
    slug,
    description: collection.description || null,
    hero_image: collection.heroImage || null,
    sort_order: collection.sortOrder,
  };

  const saved = collection.id
    ? await supabase
        .from("collections")
        .update(row)
        .eq("id", collection.id)
        .select("id")
        .maybeSingle()
    : await supabase.from("collections").insert(row).select("id").maybeSingle();

  if (saved.error || !saved.data) {
    const message =
      saved.error?.code === "23505"
        ? `The slug "${slug}" is already taken.`
        : (saved.error?.message ?? "Could not save the collection.");

    return { ok: false, error: message };
  }

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/collections");

  return { ok: true, id: saved.data.id };
}

export async function deleteCollection(id: string): Promise<Result> {
  let supabase;
  try {
    ({ supabase } = await requireAdmin());
  } catch {
    return { ok: false, error: "You are not signed in as an admin." };
  }

  /*
   * Products in it are not deleted with it — `products.collection_id` falls to
   * null, so a piece survives its collection being reorganised and simply
   * stops being filed under anything. That is the schema's decision, not this
   * action's, and it is the right one: cloth outlives a marketing category.
   */
  const { error } = await supabase.from("collections").delete().eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/collections");

  return { ok: true, id };
}
