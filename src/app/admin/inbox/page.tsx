import Link from "next/link";

import { getEnquiries } from "@/lib/queries";
import type { EnquiryStatus } from "@/types";

/*
 * The inbox.
 *
 * Unanswered messages carry a gold dot and read in full-strength text; answered
 * ones fade back. The difference is the entire job of this screen — anything
 * that makes a replied message look as loud as a new one is a bug.
 */

export const metadata = { title: "Enquiries" };

const LABEL: Record<EnquiryStatus, string> = {
  new: "New",
  replied: "Replied",
  closed: "Closed",
};

function ago(iso: string) {
  const minutes = Math.round((Date.now() - new Date(iso).valueOf()) / 60000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export default async function AdminInbox() {
  const enquiries = await getEnquiries();
  const unanswered = enquiries.filter(
    (enquiry) => enquiry.status === "new",
  ).length;

  return (
    <div className="px-5 py-10 md:px-12 md:py-12">
      <header>
        <h1 className="text-[clamp(1.4rem,5vw,2.2rem)]">Enquiries</h1>
        <p className="text-muted mt-2 text-sm">
          {enquiries.length} in the inbox
          {unanswered > 0 && ` · ${unanswered} unanswered`}
        </p>
      </header>

      {enquiries.length === 0 ? (
        <p className="border-line text-muted mt-10 rounded-lg border border-dashed px-6 py-20 text-center text-sm">
          Nothing in the inbox. Messages from the contact form land here instead
          of in an email account only one person can see.
        </p>
      ) : (
        <ul className="border-line mt-8 divide-y divide-[var(--color-line)] overflow-hidden rounded-lg border">
          {enquiries.map((enquiry) => {
            const unread = enquiry.status === "new";

            return (
              <li key={enquiry.id}>
                <Link
                  href={`/admin/inbox/${enquiry.id}`}
                  className="hover:bg-cream/[0.03] flex items-start gap-4 p-5 transition-colors"
                >
                  <span
                    aria-hidden
                    className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                      unread ? "bg-gold" : "bg-transparent"
                    }`}
                  />

                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline gap-x-3">
                      <span
                        className={
                          unread ? "text-cream text-sm" : "text-muted text-sm"
                        }
                      >
                        {enquiry.full_name}
                      </span>
                      <span className="text-muted text-[0.6rem] tracking-[0.16em] uppercase">
                        {LABEL[enquiry.status]}
                      </span>
                    </span>

                    <span
                      className={`mt-1 block truncate text-sm ${
                        unread ? "text-cream-soft" : "text-muted"
                      }`}
                    >
                      {enquiry.subject ?? enquiry.message}
                    </span>

                    <span className="text-muted mt-1 block truncate text-xs">
                      {enquiry.email}
                    </span>
                  </span>

                  <span className="text-muted shrink-0 text-[0.65rem]">
                    {ago(enquiry.created_at)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
