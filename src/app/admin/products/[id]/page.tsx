import Link from "next/link";
import { notFound } from "next/navigation";

import { DeleteRow } from "@/components/admin/delete-row";
import { ProductForm } from "@/components/admin/product-form";
import { deleteProduct } from "@/app/admin/products/actions";
import { getAdminProduct, getCollections } from "@/lib/queries";

export default async function EditProduct({
  params,
}: PageProps<"/admin/products/[id]">) {
  const { id } = await params;

  const [product, collections] = await Promise.all([
    getAdminProduct(id),
    getCollections(),
  ]);

  if (!product) notFound();

  return (
    <div className="px-5 py-10 md:px-12 md:py-12">
      <nav className="text-muted mb-8 text-[0.6rem] tracking-[0.2em] uppercase">
        <Link href="/admin/products" className="hover:text-cream">
          Products
        </Link>
        <span className="mx-2">/</span>
        <span className="text-cream-soft">{product.name}</span>
      </nav>

      <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[clamp(1.5rem,3vw,2.2rem)]">{product.name}</h1>

        <div className="flex items-center gap-5">
          {product.is_published && (
            <Link
              href={`/shop/${product.slug}`}
              target="_blank"
              className="text-muted hover:text-cream text-[0.6rem] tracking-[0.2em] uppercase"
            >
              View in shop
            </Link>
          )}
          <DeleteRow
            id={product.id}
            name={product.name}
            action={deleteProduct}
            redirectTo="/admin/products"
            note="Past orders keep their own record of the name and price paid."
          />
        </div>
      </header>

      <ProductForm product={product} collections={collections} />
    </div>
  );
}
