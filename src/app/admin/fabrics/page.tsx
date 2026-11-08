import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";

import { getFabrics } from "@/lib/queries";
import { formatNaira } from "@/lib/utils";

/*
 * The shelf.
 *
 * Metres arrive as strings — `numeric` holds more precision than a JS number,
 * so PostgREST refuses to narrow it. Parse only to compare, never to store.
 */

export const metadata = { title: "Fabrics" };

export default async function AdminFabrics() {
  const fabrics = await getFabrics(true);

  const total = fabrics.reduce(
    (sum, fabric) => sum + Number(fabric.metres_available),
    0,
  );

  return (
    <div className="px-5 py-10 md:px-12 md:py-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[clamp(1.4rem,5vw,2.2rem)]">Fabrics</h1>
          <p className="text-muted mt-2 text-sm">
            {fabrics.length} on the shelf · {total.toFixed(2)}m in total
          </p>
        </div>

        <Link
          href="/admin/fabrics/new"
          className="bg-gold text-charcoal hover:bg-gold-light inline-flex h-11 w-full items-center justify-center gap-2 rounded-md px-6 text-xs font-medium tracking-[0.18em] uppercase transition-colors sm:w-auto"
        >
          <Plus size={14} strokeWidth={2} aria-hidden />
          Add fabric
        </Link>
      </header>

      {fabrics.length === 0 ? (
        <p className="border-line text-muted mt-10 rounded-lg border border-dashed px-6 py-20 text-center text-sm">
          No cloth recorded yet. This is the list a commission starts from.
        </p>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fabrics.map((fabric) => {
            const metres = Number(fabric.metres_available);

            return (
              <li key={fabric.id}>
                <Link
                  href={`/admin/fabrics/${fabric.id}`}
                  className="border-line bg-surface hover:border-gold/40 group flex gap-4 rounded-lg border p-4 transition-colors"
                >
                  <span className="bg-charcoal relative block h-24 w-24 shrink-0 overflow-hidden rounded">
                    {fabric.image && (
                      <Image
                        src={fabric.image}
                        alt=""
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    )}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="text-cream group-hover:text-gold truncate transition-colors">
                        {fabric.name}
                      </span>
                      {!fabric.is_active && (
                        <span className="text-muted shrink-0 text-[0.55rem] tracking-[0.2em] uppercase">
                          Retired
                        </span>
                      )}
                    </span>

                    <span className="text-muted mt-1 block truncate text-xs">
                      {fabric.origin ?? "Not set"}
                      {fabric.width_cm ? ` · ${fabric.width_cm}cm` : ""}
                    </span>

                    <span className="text-cream-soft mt-3 block text-sm tabular-nums">
                      {fabric.price_per_metre
                        ? `${formatNaira(fabric.price_per_metre)}/m`
                        : "No price set"}
                    </span>

                    <span
                      className={`mt-1 block text-xs tabular-nums ${
                        metres === 0
                          ? "text-danger"
                          : metres < 5
                            ? "text-gold"
                            : "text-muted"
                      }`}
                    >
                      {metres === 0
                        ? "Off the loom"
                        : `${fabric.metres_available}m available`}
                    </span>
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
