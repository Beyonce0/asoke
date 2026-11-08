import Link from "next/link";

import { getBespokeRequests } from "@/lib/queries";
import { formatNaira } from "@/lib/utils";
import type { BespokeStatus } from "@/types";

/*
 * The commission queue.
 *
 * Ordered newest first and not grouped by status on purpose: an enquiry that
 * has sat untouched for a week is the most urgent thing on this screen, and
 * grouping would bury it under whatever is in production.
 */

export const metadata = { title: "Bespoke orders" };

const TONE: Record<BespokeStatus, string> = {
  new: "text-gold border-gold/40",
  reviewing: "text-cream border-line",
  consultation: "text-cream border-line",
  in_production: "text-cream border-line",
  completed: "text-success border-success/40",
  cancelled: "text-muted border-line",
};

const LABEL: Record<BespokeStatus, string> = {
  new: "New",
  reviewing: "Reviewing",
  consultation: "Consultation",
  in_production: "In production",
  completed: "Completed",
  cancelled: "Cancelled",
};

/** "14 December 2026" — the date the client has to be ready for. */
function eventDate(value: string | null) {
  if (!value) return null;

  return new Date(`${value}T00:00:00Z`).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function budget(min: number | null, max: number | null) {
  if (min && max) return `${formatNaira(min)} – ${formatNaira(max)}`;
  if (min) return `From ${formatNaira(min)}`;
  if (max) return `Up to ${formatNaira(max)}`;
  return "No budget given";
}

export default async function AdminBespoke() {
  const requests = await getBespokeRequests();
  const waiting = requests.filter((request) => request.status === "new").length;

  return (
    <div className="px-5 py-10 md:px-12 md:py-12">
      <header>
        <h1 className="text-[clamp(1.4rem,5vw,2.2rem)]">Bespoke orders</h1>
        <p className="text-muted mt-2 text-sm">
          {requests.length} {requests.length === 1 ? "enquiry" : "enquiries"}
          {waiting > 0 && ` · ${waiting} unanswered`}
        </p>
      </header>

      {requests.length === 0 ? (
        <p className="border-line text-muted mt-10 rounded-lg border border-dashed px-6 py-20 text-center text-sm">
          No commission enquiries yet. They arrive here from the bespoke form on
          the storefront.
        </p>
      ) : (
        <ul className="mt-8 space-y-3">
          {requests.map((request) => (
            <li key={request.id}>
              <Link
                href={`/admin/bespoke/${request.id}`}
                className="border-line bg-surface hover:border-gold/40 block rounded-lg border p-5 transition-colors"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-cream truncate">{request.full_name}</p>
                    <p className="text-muted mt-1 truncate text-xs">
                      {request.email}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full border px-3 py-1 text-[0.55rem] tracking-[0.18em] uppercase ${TONE[request.status]}`}
                  >
                    {LABEL[request.status]}
                  </span>
                </div>

                <dl className="text-cream-soft mt-4 grid gap-x-8 gap-y-2 text-xs sm:grid-cols-3">
                  <div>
                    <dt className="text-muted text-[0.55rem] tracking-[0.2em] uppercase">
                      Occasion
                    </dt>
                    <dd className="mt-1">{request.occasion ?? "Not set"}</dd>
                  </div>
                  <div>
                    <dt className="text-muted text-[0.55rem] tracking-[0.2em] uppercase">
                      Event
                    </dt>
                    <dd className="mt-1">
                      {eventDate(request.event_date) ?? "No date"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted text-[0.55rem] tracking-[0.2em] uppercase">
                      Budget
                    </dt>
                    <dd className="mt-1 tabular-nums">
                      {budget(request.budget_min, request.budget_max)}
                    </dd>
                  </div>
                </dl>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
