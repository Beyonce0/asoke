"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin";

/*
 * An enquiry has one editable fact: whether anyone has dealt with it.
 *
 * Replies are sent from `reply-actions.ts`, which marks the enquiry replied
 * itself. This is for setting the status by hand, so nothing is answered twice
 * or not at all.
 */

const schema = z.object({
  id: z.uuid(),
  status: z.enum(["new", "replied", "closed"]),
});

export type Result = { ok: true } | { ok: false; error: string };

export async function setEnquiryStatus(
  input: z.input<typeof schema>,
): Promise<Result> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Unknown status." };

  let supabase;
  try {
    ({ supabase } = await requireAdmin());
  } catch {
    return { ok: false, error: "You are not signed in as an admin." };
  }

  const { error } = await supabase
    .from("enquiries")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/inbox");
  revalidatePath(`/admin/inbox/${parsed.data.id}`);

  return { ok: true };
}
