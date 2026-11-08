import Link from "next/link";
import { notFound } from "next/navigation";

import { DeleteRow } from "@/components/admin/delete-row";
import { FabricForm } from "@/components/admin/fabric-form";
import { deleteFabric } from "@/app/admin/fabrics/actions";
import { getFabric } from "@/lib/queries";

export default async function EditFabric({
  params,
}: PageProps<"/admin/fabrics/[id]">) {
  const { id } = await params;
  const fabric = await getFabric(id);

  if (!fabric) notFound();

  return (
    <div className="px-5 py-10 md:px-12 md:py-12">
      <nav className="text-muted mb-8 text-[0.6rem] tracking-[0.2em] uppercase">
        <Link href="/admin/fabrics" className="hover:text-cream">
          Fabrics
        </Link>
        <span className="mx-2">/</span>
        <span className="text-cream-soft">{fabric.name}</span>
      </nav>

      <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[clamp(1.4rem,5vw,2.2rem)]">{fabric.name}</h1>

        <DeleteRow
          id={fabric.id}
          name={fabric.name}
          action={deleteFabric}
          redirectTo="/admin/fabrics"
          note="Retiring it instead keeps the record and takes it off the shelf."
        />
      </header>

      <FabricForm fabric={fabric} />
    </div>
  );
}
