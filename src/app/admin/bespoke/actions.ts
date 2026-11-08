"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin";

/*
 * The only thing the atelier may change about an enquiry is where it has got
 * to. Everything else is the client's own words, and the dashboard is not a
 * place to quietly edit what somebody asked for.
 *
 * The database agrees rather than taking this file's word for it: the Update
 * type carries `status` alone, and the RLS policy admits the write only for an
 * admin.
 */

const schema = z.object({
  id: z.uuid(),
  status: z.enum([
    "new",
    "reviewing",
    "consultation",
    "in_production",
    "completed",
    "cancelled",
  ]),
});

export type Result = { ok: true } | { ok: false; error: string };

export async function setBespokeStatus(
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
    .from("bespoke_requests")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/bespoke");
  revalidatePath(`/admin/bespoke/${parsed.data.id}`);

  return { ok: true };
}
