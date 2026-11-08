import "server-only";

/*
 * Hands one website enquiry to the ÀṢỌKÉ intake scenario in Make
 * ("ÀṢỌKÉ – enquiry intake"). Make classifies it, logs it in the Enquiry Log
 * Google Sheet and emails the owner a draft reply to approve. That approval
 * email is the main route for the first reply to every enquiry.
 *
 * Server only, and the webhook URL lives in MAKE_ENQUIRY_WEBHOOK_URL: anyone
 * holding it can post fake enquiries, so it must never reach the browser.
 *
 * Called after the enquiry is already saved to the database, so a failure
 * here never loses a message. It is logged, and the owner still has the
 * enquiry in admin → Enquiries.
 */

export type MakeEnquiry = {
  fullName: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  /** English name of the site language the visitor was using, e.g. "Yorùbá". */
  language: string;
};

export async function sendEnquiryToMake(
  enquiry: MakeEnquiry,
): Promise<boolean> {
  const url = process.env.MAKE_ENQUIRY_WEBHOOK_URL;
  if (!url) {
    console.error(
      "[make] MAKE_ENQUIRY_WEBHOOK_URL is not set; enquiry not forwarded",
    );
    return false;
  }

  // The scenario has no subject field, so the subject heads the message.
  const subject = enquiry.subject?.trim();
  const body = enquiry.message.trim();
  const message = subject ? `Subject: ${subject}\n\n${body}` : body;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // These names must match what the scenario reads.
      body: JSON.stringify({
        name: enquiry.fullName.trim(),
        email: enquiry.email.trim(),
        phone: enquiry.phone?.trim() ?? "",
        message,
        language: enquiry.language,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });

    // Make answers 200 "Accepted" straight away, with nothing else to read.
    if (!response.ok) {
      console.error("[make] webhook refused the enquiry", response.status);
    }
    return response.ok;
  } catch (error) {
    console.error("[make] could not reach the webhook", error);
    return false;
  }
}
