"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { fill } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { getDictionary } from "@/i18n/server";
import { isConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export type EnquiryState = { error?: string; sent?: string };

/** Built per request, so the messages arrive in the visitor's language. */
function enquirySchema(errors: Dictionary["enquiry"]["errors"]) {
  return z.object({
    fullName: z.string().trim().min(2, errors.name).max(120),
    email: z.email(errors.email),
    phone: z.string().trim().max(40).optional(),
    subject: z.string().trim().max(160).optional(),
    message: z.string().trim().min(10, errors.message).max(4000),
  });
}

/*
 * A message to the atelier, landing in the dashboard's Inbox as `new`.
 *
 * Written with the visitor's own client: the "anyone may write to the
 * atelier" policy allows the insert and nothing else, so a signed-out visitor
 * can add a row but never read the inbox back. That is also why the insert has
 * no `.select()`; asking for the row would be refused.
 */
export async function sendEnquiry(
  _previous: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const t = (await getDictionary()).enquiry;

  // A field no person sees. Anything that fills it in is a script; it gets a
  // thank-you as a person would, and nothing is written.
  if (formData.get("hp_extra")) {
    console.warn("[contact:sendEnquiry] spam trap filled; message dropped");
    return { sent: t.thanksTitle };
  }

  const parsed = enquirySchema(t.errors).safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    subject: formData.get("subject") || undefined,
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  const { fullName, email, phone, subject, message } = parsed.data;

  if (!isConfigured) return { error: t.errors.notConnected };

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("enquiries").insert({
    user_id: user?.id ?? null,
    full_name: fullName,
    email,
    phone: phone || null,
    subject: subject || null,
    message,
  });

  if (error) {
    console.error("[contact:sendEnquiry]", error.code, error.message);
    return { error: t.errors.failed };
  }

  revalidatePath("/admin/inbox");
  revalidatePath("/admin");

  return {
    sent: fill(t.thanksBody, { name: fullName.split(" ")[0], email }),
  };
}
