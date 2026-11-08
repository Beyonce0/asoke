"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin";
import { escapeHtml, sendEmail } from "@/lib/email";

/*
 * Answer an enquiry by email, from the dashboard.
 *
 * The order matters. The email goes first; only once the service has accepted
 * it is the reply written to the history and the enquiry marked replied. A
 * failed send leaves no trace, so the history never claims a reply the
 * customer did not get.
 */

const schema = z.object({
  id: z.uuid(),
  subject: z.string().trim().min(1, "Add a subject.").max(200),
  body: z.string().trim().min(2, "Write a reply first.").max(10000),
});

export type ReplyResult = { ok: true } | { ok: false; error: string };

export async function sendEnquiryReply(
  input: z.input<typeof schema>,
): Promise<ReplyResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Check the reply.",
    };
  }

  let admin;
  try {
    admin = await requireAdmin();
  } catch {
    return { ok: false, error: "You are not signed in as an admin." };
  }
  const { supabase, user } = admin;
  const { id, subject, body } = parsed.data;

  const [{ data: enquiry }, { data: profile }] = await Promise.all([
    supabase.from("enquiries").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle(),
  ]);

  if (!enquiry) return { ok: false, error: "That enquiry no longer exists." };

  // Check the history can be written before anything is sent. Without this, a
  // project missing migration 0011 would email the customer and then fail to
  // record it, inviting a second send.
  const { error: historyError } = await supabase
    .from("enquiry_replies")
    .select("id")
    .limit(1);

  if (historyError) {
    console.error("[inbox:reply] history unavailable", historyError);
    return {
      ok: false,
      error:
        "Replies cannot be saved yet. Run supabase/migrations/0011_enquiry_replies.sql in the Supabase SQL editor, then try again. Nothing was sent.",
    };
  }

  const asked = new Date(enquiry.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Lagos",
  });

  // The customer's own words go underneath, so the reply makes sense on its
  // own in their inbox, the way any mail client quotes a thread.
  const text = [
    body,
    "",
    "ÀṢỌKÉ",
    "",
    `On ${asked}, ${enquiry.full_name} wrote:`,
    ...enquiry.message.split("\n").map((line) => `> ${line}`),
  ].join("\n");

  const html = `<!doctype html>
<html><body style="margin:0;padding:32px 16px;background:#f6f3ee;font-family:Helvetica,Arial,sans-serif;color:#1c1917">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;padding:36px 32px;border-top:3px solid #b89b5e">
    <p style="margin:0 0 28px;font-family:Georgia,serif;font-size:20px;letter-spacing:0.28em">ÀṢỌKÉ</p>
    <div style="font-size:15px;line-height:1.7;white-space:pre-line">${escapeHtml(body)}</div>
    <div style="margin-top:36px;padding-top:20px;border-top:1px solid #e7e2da;font-size:13px;line-height:1.6;color:#78716c">
      <p style="margin:0 0 8px">On ${escapeHtml(asked)}, ${escapeHtml(enquiry.full_name)} wrote:</p>
      <div style="padding-left:12px;border-left:2px solid #e7e2da;white-space:pre-line">${escapeHtml(enquiry.message)}</div>
    </div>
  </div>
</body></html>`;

  const sent = await sendEmail({ to: enquiry.email, subject, text, html });
  if (!sent.ok) return { ok: false, error: sent.error };

  const { error: recordError } = await supabase.from("enquiry_replies").insert({
    enquiry_id: id,
    subject,
    body,
    sent_by: user.id,
    sent_by_name: profile?.full_name ?? user.email ?? null,
    provider_id: sent.id,
  });

  // The customer has the email either way. Say so plainly, rather than
  // inviting a second send that would reach them twice.
  if (recordError) {
    console.error("[inbox:reply] sent but not recorded", recordError);
    return {
      ok: false,
      error: `The email was sent, but it could not be saved to the history (${recordError.message}). Do not send it again.`,
    };
  }

  await supabase.from("enquiries").update({ status: "replied" }).eq("id", id);

  revalidatePath("/admin/inbox");
  revalidatePath(`/admin/inbox/${id}`);
  revalidatePath("/admin");

  return { ok: true };
}
