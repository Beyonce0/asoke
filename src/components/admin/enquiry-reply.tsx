"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Check, Send } from "lucide-react";

import { sendEnquiryReply } from "@/app/admin/inbox/reply-actions";

const field =
  "border-line bg-charcoal text-cream placeholder:text-muted/60 focus:border-gold/60 w-full rounded-md border px-3.5 py-2.5 text-sm outline-none transition-colors";
const label = "text-muted block text-[0.6rem] tracking-[0.24em] uppercase";

/*
 * Write back without leaving the dashboard. The customer's message is quoted
 * under the reply automatically, so this box is only for the answer itself.
 *
 * This is the second route, for follow-ups and for anything the AI cannot
 * handle. The first reply to every enquiry goes out through the Make
 * automation's approval email, so the note below sends the owner to the
 * Enquiry Log sheet before writing, to avoid answering a customer twice.
 */
export function EnquiryReply({
  id,
  to,
  defaultSubject,
  emailReady,
}: {
  id: string;
  to: string;
  defaultSubject: string;
  /** False until RESEND_API_KEY is set; the box still shows, and says why it cannot send. */
  emailReady: boolean;
}) {
  const router = useRouter();
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, startTransition] = useTransition();

  const submit = () => {
    setError(null);
    setSent(false);

    startTransition(async () => {
      const result = await sendEnquiryReply({ id, subject, body });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setBody("");
      setSent(true);
      router.refresh();
    });
  };

  return (
    <div className="border-line bg-surface max-w-2xl rounded-lg border p-6">
      <p className={label}>Reply by email</p>
      <p className="text-cream-soft mt-2 text-sm">
        To <span className="text-cream">{to}</span>
      </p>

      <p className="border-gold/30 bg-gold/10 text-cream-soft mt-4 rounded-md border px-4 py-3 text-xs leading-relaxed">
        The first reply goes out through the AI approval email. Check the
        Enquiry Log sheet first: if Status is Sent, this customer already has a
        reply.
      </p>

      <div className="mt-5 space-y-4">
        <div>
          <label className={label} htmlFor="reply-subject">
            Subject
          </label>
          <input
            id="reply-subject"
            value={subject}
            maxLength={200}
            onChange={(event) => setSubject(event.target.value)}
            className={`${field} mt-2`}
          />
        </div>

        <div>
          <label className={label} htmlFor="reply-body">
            Message
          </label>
          <textarea
            id="reply-body"
            rows={7}
            value={body}
            onChange={(event) => {
              setBody(event.target.value);
              setSent(false);
            }}
            placeholder="Write your reply. Their original message is added underneath automatically."
            className={`${field} mt-2 resize-y leading-relaxed`}
          />
        </div>

        {!emailReady && (
          <p className="border-gold/30 bg-gold/10 text-cream-soft rounded-md border px-4 py-3 text-sm">
            Email is not set up yet, so replies cannot be sent. Add your Resend
            key to <code className="text-gold">.env.local</code> and restart the
            site.
          </p>
        )}

        {error && (
          <p
            role="alert"
            className="border-danger/40 bg-danger/10 text-danger rounded-md border px-4 py-3 text-sm"
          >
            {error}
          </p>
        )}

        {sent && (
          <p
            role="status"
            className="text-success inline-flex items-center gap-2 text-sm"
          >
            <Check size={15} strokeWidth={1.75} aria-hidden />
            Reply sent and marked as replied.
          </p>
        )}

        <button
          type="button"
          disabled={pending || !emailReady || body.trim().length < 2}
          onClick={submit}
          className="bg-gold text-charcoal hover:bg-gold-light inline-flex h-11 w-full items-center justify-center gap-2 rounded-md px-7 text-xs font-medium tracking-[0.18em] uppercase transition-colors disabled:opacity-50 sm:w-auto"
        >
          <Send size={14} strokeWidth={1.75} aria-hidden />
          {pending ? "Sending…" : "Send reply"}
        </button>
      </div>
    </div>
  );
}
