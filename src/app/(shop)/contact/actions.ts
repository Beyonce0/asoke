"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { z } from "zod";

import { englishName, fill } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { getDictionary, getLocale } from "@/i18n/server";
import { isConfigured } from "@/lib/env";
import { getSiteSettings } from "@/lib/queries";
import { sendEnquiryToMake } from "@/lib/send-enquiry-to-make";
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
 * A message to the atelier. Two destinations, in this order:
 *
 *   1. The database, so it lands in admin → Enquiries as `new`. This is the
 *      record, and the only step whose failure the visitor is told about.
 *   2. Make, which drafts the first reply for the owner to approve. Sent in
 *      `after()`, once the visitor already has their thank-you, so a slow or
 *      unreachable webhook never keeps them waiting or fails their message.
 *      A failure there is logged; the enquiry is still in the inbox.
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
  const [locale, { enquiry: t }] = await Promise.all([
    getLocale(),
    getDictionary(),
  ]);

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

  // The one failure the visitor hears about: nothing was saved, so they are
  // pointed at email instead. The address follows Settings when it is set.
  if (error) {
    console.error("[contact:sendEnquiry]", error.code, error.message);
    const settings = await getSiteSettings();
    return {
      error: fill(t.errors.failed, {
        email: settings.email || "hello@asoke.ng",
      }),
    };
  }

  revalidatePath("/admin/inbox");
  revalidatePath("/admin");

  after(async () => {
    const forwarded = await sendEnquiryToMake({
      fullName,
      email,
      phone,
      subject,
      message,
      language: englishName(locale),
    });

    if (!forwarded) {
      console.error(
        `[contact:sendEnquiry] saved but NOT forwarded to Make: ${email}. Reply from admin → Enquiries.`,
      );
    }
  });

  return {
    sent: fill(t.thanksBody, { name: fullName.split(" ")[0], email }),
  };
}
