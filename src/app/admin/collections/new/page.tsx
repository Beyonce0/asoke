import Link from "next/link";

import { CollectionForm } from "@/components/admin/collection-form";

export const metadata = { title: "Add collection" };

export default function NewCollection() {
  return (
    <div className="px-5 py-10 md:px-12 md:py-12">
      <nav className="text-muted mb-8 text-[0.6rem] tracking-[0.2em] uppercase">
        <Link href="/admin/collections" className="hover:text-cream">
          Collections
        </Link>
        <span className="mx-2">/</span>
        <span className="text-cream-soft">New</span>
      </nav>

      <h1 className="mb-10 text-[clamp(1.4rem,5vw,2.2rem)]">
        Add a collection
      </h1>

      <CollectionForm />
    </div>
  );
}
