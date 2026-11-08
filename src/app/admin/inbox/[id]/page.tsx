import Link from "next/link";
import { notFound } from "next/navigation";
import { Mail, Phone } from "lucide-react";

import { EnquiryReply } from "@/components/admin/enquiry-reply";
import { EnquiryStatusPicker } from "@/components/admin/enquiry-status";
import { isEmailConfigured } from "@/lib/email";
import { getEnquiry, getEnquiryReplies } from "@/lib/queries";

export default async function EnquiryDetail({
  params,
}: PageProps<"/admin/inbox/[id]">) {
  const { id } = await params;
  const [enquiry, replies] = await Promise.all([
    getEnquiry(id),
    getEnquiryReplies(id),
  ]);

  if (!enquiry) notFound();

  /*
   * Replies are written and sent from this page, and kept underneath the
   * message so everyone at the atelier sees the same thread. The mail-app
   * link stays for anything that needs an attachment.
   */
  const subject = `Re: ${enquiry.subject ?? "Your enquiry"}`;
  const mailAppHref = `mailto:${enquiry.email}?subject=${encodeURIComponent(subject)}`;

  return (
    <div className="px-5 py-10 md:px-12 md:py-12">
      <nav className="text-muted mb-8 text-[0.6rem] tracking-[0.2em] uppercase">
        <Link href="/admin/inbox" className="hover:text-cream">
          Enquiries
        </Link>
        <span className="mx-2">/</span>
        <span className="text-cream-soft">{enquiry.full_name}</span>
      </nav>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[clamp(1.4rem,5vw,2.2rem)]">
            {enquiry.subject ?? "No subject"}
          </h1>
          <p className="text-cream-soft mt-2 text-sm">{enquiry.full_name}</p>
        </div>

        <p className="text-muted text-xs">
          {new Date(enquiry.created_at).toLocaleString("en-NG", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </header>

      <div className="mt-6 flex flex-wrap items-center gap-5">
        <a
          href="#reply"
          className="bg-gold text-charcoal hover:bg-gold-light inline-flex h-10 items-center gap-2 rounded-md px-5 text-[0.65rem] font-medium tracking-[0.18em] uppercase transition-colors"
        >
          <Mail size={14} strokeWidth={1.75} aria-hidden />
          Reply
        </a>

        <span className="text-cream-soft text-sm">{enquiry.email}</span>

        {enquiry.phone && (
          <a
            href={`tel:${enquiry.phone}`}
            className="text-cream-soft hover:text-cream inline-flex items-center gap-2 text-sm"
          >
            <Phone size={13} strokeWidth={1.5} aria-hidden />
            {enquiry.phone}
          </a>
        )}

        <a
          href={mailAppHref}
          className="text-muted hover:text-cream text-xs underline underline-offset-4"
        >
          Open in my email app
        </a>
      </div>

      <blockquote className="border-gold/40 text-cream-soft mt-10 max-w-2xl border-l-2 pl-5 text-sm leading-relaxed whitespace-pre-line">
        {enquiry.message}
      </blockquote>

      {replies.length > 0 && (
        <ol className="mt-10 max-w-2xl space-y-6">
          {replies.map((reply) => (
            <li
              key={reply.id}
              className="border-line bg-surface/60 rounded-lg border px-5 py-4"
            >
              <p className="text-muted text-[0.6rem] tracking-[0.2em] uppercase">
                Reply from {reply.sent_by_name ?? "the atelier"} ·{" "}
                {new Date(reply.created_at).toLocaleString("en-NG", {
                  day: "numeric",
                  month: "long",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-cream-soft mt-1 text-xs">{reply.subject}</p>
              <p className="text-cream mt-3 text-sm leading-relaxed whitespace-pre-line">
                {reply.body}
              </p>
            </li>
          ))}
        </ol>
      )}

      <div id="reply" className="mt-12 scroll-mt-8">
        <EnquiryReply
          id={enquiry.id}
          to={enquiry.email}
          defaultSubject={subject}
          emailReady={isEmailConfigured()}
        />
      </div>

      <div className="border-line bg-surface mt-12 max-w-2xl rounded-lg border p-6">
        <p className="text-muted text-[0.6rem] tracking-[0.24em] uppercase">
          Mark this as
        </p>
        <div className="mt-4">
          <EnquiryStatusPicker id={enquiry.id} status={enquiry.status} />
        </div>
      </div>
    </div>
  );
}
