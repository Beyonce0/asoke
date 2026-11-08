import Link from "next/link";
import { notFound } from "next/navigation";

import { BespokeStatusPicker } from "@/components/admin/bespoke-status";
import { getBespokeRequest } from "@/lib/queries";
import { formatNaira } from "@/lib/utils";

/*
 * One commission, as the client wrote it.
 *
 * Read-only apart from the status: this is a record of what somebody asked
 * for, and an atelier that can edit the brief after the fact has no brief.
 */

function eventDate(value: string | null) {
  if (!value) return "No date given";

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

export default async function BespokeDetail({
  params,
}: PageProps<"/admin/bespoke/[id]">) {
  const { id } = await params;
  const request = await getBespokeRequest(id);

  if (!request) notFound();

  const facts = [
    { label: "Occasion", value: request.occasion ?? "Not set" },
    { label: "Event date", value: eventDate(request.event_date) },
    { label: "Desired outfit", value: request.outfit ?? "Not set" },
    { label: "Fabric", value: request.fabric_preference ?? "Undecided" },
    { label: "Budget", value: budget(request.budget_min, request.budget_max) },
    { label: "Phone", value: request.phone ?? "Not given" },
  ];

  return (
    <div className="px-5 py-10 md:px-12 md:py-12">
      <nav className="text-muted mb-8 text-[0.6rem] tracking-[0.2em] uppercase">
        <Link href="/admin/bespoke" className="hover:text-cream">
          Bespoke
        </Link>
        <span className="mx-2">/</span>
        <span className="text-cream-soft">{request.full_name}</span>
      </nav>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[clamp(1.4rem,5vw,2.2rem)]">
            {request.full_name}
          </h1>
          <a
            href={`mailto:${request.email}`}
            className="text-gold mt-2 inline-block text-sm hover:underline"
          >
            {request.email}
          </a>
        </div>

        <p className="text-muted text-xs">
          Enquired{" "}
          {new Date(request.created_at).toLocaleDateString("en-NG", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </header>

      <div className="border-line bg-surface mt-10 rounded-lg border p-6">
        <BespokeStatusPicker id={request.id} status={request.status} />
      </div>

      <dl className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {facts.map((fact) => (
          <div key={fact.label}>
            <dt className="text-muted text-[0.55rem] tracking-[0.22em] uppercase">
              {fact.label}
            </dt>
            <dd className="text-cream mt-2 text-sm">{fact.value}</dd>
          </div>
        ))}
      </dl>

      {request.message && (
        <section className="mt-12 max-w-2xl">
          <h2 className="text-muted text-[0.55rem] tracking-[0.22em] uppercase">
            In their words
          </h2>
          <blockquote className="border-gold/40 text-cream-soft mt-4 border-l-2 pl-5 text-sm leading-relaxed whitespace-pre-line">
            {request.message}
          </blockquote>
        </section>
      )}

      {request.reference_images.length > 0 && (
        <section className="mt-12">
          <h2 className="text-muted text-[0.55rem] tracking-[0.22em] uppercase">
            Reference images
          </h2>
          {/*
            Paths, not URLs. These live in the private bucket, so showing them
            means signing each one — which belongs in a server component that
            can hold the credentials, not in an <img> tag here.
          */}
          <ul className="text-cream-soft mt-4 space-y-1 font-mono text-xs">
            {request.reference_images.map((path) => (
              <li key={path}>{path}</li>
            ))}
          </ul>
          <p className="text-muted mt-3 text-xs">
            Signed previews arrive with the storefront bespoke form.
          </p>
        </section>
      )}
    </div>
  );
}
