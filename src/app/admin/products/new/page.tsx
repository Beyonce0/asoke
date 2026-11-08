import Link from "next/link";

import { ProductForm } from "@/components/admin/product-form";
import { getCollections } from "@/lib/queries";

export const metadata = { title: "Add product" };

export default async function NewProduct() {
  const collections = await getCollections();

  return (
    <div className="px-5 py-10 md:px-12 md:py-12">
      <nav className="text-muted mb-8 text-[0.6rem] tracking-[0.2em] uppercase">
        <Link href="/admin/products" className="hover:text-cream">
          Products
        </Link>
        <span className="mx-2">/</span>
        <span className="text-cream-soft">New</span>
      </nav>

      <h1 className="mb-10 text-[clamp(1.5rem,3vw,2.2rem)]">Add a piece</h1>

      <ProductForm collections={collections} />
    </div>
  );
}
