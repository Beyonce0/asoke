import Link from "next/link";
import { notFound } from "next/navigation";

import { CollectionForm } from "@/components/admin/collection-form";
import { DeleteRow } from "@/components/admin/delete-row";
import { deleteCollection } from "@/app/admin/collections/actions";
import { getCollection } from "@/lib/queries";

export default async function EditCollection({
  params,
}: PageProps<"/admin/collections/[id]">) {
  const { id } = await params;
  const collection = await getCollection(id);

  if (!collection) notFound();

  return (
    <div className="px-5 py-10 md:px-12 md:py-12">
      <nav className="text-muted mb-8 text-[0.6rem] tracking-[0.2em] uppercase">
        <Link href="/admin/collections" className="hover:text-cream">
          Collections
        </Link>
        <span className="mx-2">/</span>
        <span className="text-cream-soft">{collection.name}</span>
      </nav>

      <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[clamp(1.4rem,5vw,2.2rem)]">{collection.name}</h1>

        <DeleteRow
          id={collection.id}
          name={collection.name}
          action={deleteCollection}
          redirectTo="/admin/collections"
          note="Pieces in it are kept. They simply stop being filed under anything."
        />
      </header>

      <CollectionForm collection={collection} />
    </div>
  );
}
