import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";

import { getCollections } from "@/lib/queries";

export const metadata = { title: "Collections" };

export default async function AdminCollections() {
  const collections = await getCollections();

  return (
    <div className="px-5 py-10 md:px-12 md:py-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[clamp(1.4rem,5vw,2.2rem)]">Collections</h1>
          <p className="text-muted mt-2 text-sm">
            How the shop is grouped. Order decides what comes first.
          </p>
        </div>

        <Link
          href="/admin/collections/new"
          className="bg-gold text-charcoal hover:bg-gold-light inline-flex h-11 w-full items-center justify-center gap-2 rounded-md px-6 text-xs font-medium tracking-[0.18em] uppercase transition-colors sm:w-auto"
        >
          <Plus size={14} strokeWidth={2} aria-hidden />
          Add collection
        </Link>
      </header>

      {collections.length === 0 ? (
        <p className="border-line text-muted mt-10 rounded-lg border border-dashed px-6 py-20 text-center text-sm">
          No collections yet. Pieces can live without one, but the storefront
          has nothing to group them by.
        </p>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <li key={collection.id}>
              <Link
                href={`/admin/collections/${collection.id}`}
                className="border-line bg-surface hover:border-gold/40 group block overflow-hidden rounded-lg border transition-colors"
              >
                <div className="bg-charcoal relative aspect-[3/2]">
                  {collection.hero_image && (
                    <Image
                      src={collection.hero_image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <h2 className="text-cream group-hover:text-gold text-base transition-colors">
                      {collection.name}
                    </h2>
                    <span className="text-muted shrink-0 text-[0.6rem] tracking-[0.2em] uppercase">
                      {collection.sort_order}
                    </span>
                  </div>

                  <p className="text-cream-soft mt-2 line-clamp-2 text-xs leading-relaxed">
                    {collection.description ?? "No description"}
                  </p>

                  <p className="text-muted mt-3 truncate font-mono text-[0.65rem]">
                    /shop?collection={collection.slug}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
