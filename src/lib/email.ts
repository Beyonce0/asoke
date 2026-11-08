import "server-only";

/*
 * Outgoing mail, through Resend.
 *
 * Called with a plain `fetch` rather than the SDK: it is one endpoint, and the
 * shop does not need a dependency to make one POST.
 *
 * Three settings, all server-only:
 *
 *   RESEND_API_KEY   The key from resend.com. Without it, sending is refused
 *                    with a clear message rather than failing somewhere deep.
 *   EMAIL_FROM       Who the mail is from. Must be on a domain verified in
 *                    Resend, e.g. "ÀṢỌKÉ <hello@asoke.ng>". Until a domain is
 *                    verified, Resend's own test sender is used, and Resend
 *                    will only deliver to the address that owns the account.
 *   EMAIL_REPLY_TO   Where the customer's answer goes when they press reply:
 *                    the atelier's real inbox. Optional.
 */

const ENDPOINT = "https://api.resend.com/emails";
const TEST_SENDER = "ÀṢỌKÉ <onboarding@resend.dev>";

export type SendResult =
  { ok: true; id: string | null } | { ok: false; error: string };

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html: string;
}): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;

  if (!key) {
    return {
      ok: false,
      error:
        "Email is not set up yet. Add RESEND_API_KEY to .env.local and restart the site.",
    };
  }

  const replyTo = process.env.EMAIL_REPLY_TO?.trim();

  let response: Response;
  try {
    response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM?.trim() || TEST_SENDER,
        to: [to],
        subject,
        text,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });
  } catch (error) {
    console.error("[email] Resend unreachable", error);
    return {
      ok: false,
      error: "The email service could not be reached. Try again in a moment.",
    };
  }

  const payload = (await response.json().catch(() => null)) as {
    id?: string;
    message?: string;
  } | null;

  if (!response.ok) {
    console.error("[email] Resend refused", response.status, payload);
    // Resend's own wording is specific and actionable ("You can only send
    // testing emails to your own email address…"), so it is shown as is.
    return {
      ok: false,
      error:
        payload?.message ??
        `The email service refused the message (${response.status}).`,
    };
  }

  return { ok: true, id: payload?.id ?? null };
}

/** Text for HTML, so nothing an admin or customer typed is read as markup. */
export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
