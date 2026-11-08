import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";

import { getAdminProducts } from "@/lib/queries";
import { formatNaira } from "@/lib/utils";

/*
 * The catalogue, drafts and all.
 *
 * Stock is summed across variants rather than shown per variant: on a list
 * screen the only question is "is there any of this left", and the answer per
 * colour and size is one click away on the piece itself.
 */

export const metadata = { title: "Products" };

export default async function AdminProducts() {
  const products = await getAdminProducts();

  return (
    <div className="px-5 py-10 md:px-12 md:py-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[clamp(1.4rem,5vw,2.2rem)]">Products</h1>
          <p className="text-muted mt-2 text-sm">
            {products.length} {products.length === 1 ? "piece" : "pieces"} in
            the catalogue
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="bg-gold text-charcoal hover:bg-gold-light inline-flex h-11 w-full items-center justify-center gap-2 rounded-md px-6 text-xs font-medium tracking-[0.18em] uppercase transition-colors sm:w-auto"
        >
          <Plus size={14} strokeWidth={2} aria-hidden />
          Add product
        </Link>
      </header>

      {products.length === 0 ? (
        <p className="border-line text-muted mt-10 rounded-lg border border-dashed px-6 py-20 text-center text-sm">
          Nothing in the catalogue yet. Add the first piece.
        </p>
      ) : (
        <>
          {/*
            Phones get the catalogue as a list of pieces. A product row has a
            photograph in it, which a sideways-scrolling table hides — and the
            picture is how anyone actually recognises a piece.
          */}
          <ul className="mt-8 space-y-3 sm:hidden">
            {products.map((product) => {
              const image = product.product_images[0];
              const stock = product.product_variants.reduce(
                (sum, variant) => sum + variant.stock,
                0,
              );

              return (
                <li key={product.id}>
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="border-line bg-surface flex items-center gap-4 rounded-lg border p-3"
                  >
                    <span className="bg-charcoal relative block h-20 w-16 shrink-0 overflow-hidden rounded">
                      {image && (
                        <Image
                          src={image.url}
                          alt=""
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      )}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="text-cream block truncate text-sm">
                        {product.name}
                      </span>
                      <span className="text-cream-soft mt-1 block text-sm tabular-nums">
                        {formatNaira(product.base_price)}
                      </span>
                      <span className="mt-1.5 flex items-center gap-3 text-[0.6rem] uppercase">
                        <span
                          className={
                            product.is_published ? "text-success" : "text-muted"
                          }
                        >
                          {product.is_published ? "Published" : "Draft"}
                        </span>
                        <span
                          className={stock === 0 ? "text-danger" : "text-muted"}
                        >
                          {stock} in stock
                        </span>
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="border-line mt-10 hidden overflow-x-auto rounded-lg border sm:block">
            <table className="w-full min-w-[44rem] text-left text-sm">
              <thead className="border-line text-muted border-b">
                <tr className="[&>th]:px-5 [&>th]:py-3.5 [&>th]:text-[0.6rem] [&>th]:font-normal [&>th]:tracking-[0.2em] [&>th]:uppercase">
                  <th>Piece</th>
                  <th>Collection</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody className="[&>tr:not(:last-child)]:border-line [&>tr:not(:last-child)]:border-b">
                {products.map((product) => {
                  const image = product.product_images[0];
                  const stock = product.product_variants.reduce(
                    (sum, variant) => sum + variant.stock,
                    0,
                  );

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-cream/[0.03] [&>td]:px-5 [&>td]:py-3.5"
                    >
                      <td>
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="flex items-center gap-4"
                        >
                          <span className="bg-surface relative block h-14 w-11 shrink-0 overflow-hidden rounded">
                            {image && (
                              <Image
                                src={image.url}
                                alt=""
                                fill
                                sizes="44px"
                                className="object-cover"
                              />
                            )}
                          </span>
                          <span className="min-w-0">
                            <span className="text-cream hover:text-gold block truncate transition-colors">
                              {product.name}
                            </span>
                            <span className="text-muted block truncate text-xs">
                              {product.fabric_type ?? "Not set"}
                            </span>
                          </span>
                        </Link>
                      </td>

                      <td className="text-cream-soft">
                        {product.collections?.name ?? "Not set"}
                      </td>

                      <td className="text-cream-soft tabular-nums">
                        {formatNaira(product.base_price)}
                      </td>

                      <td
                        className={
                          stock === 0
                            ? "text-danger tabular-nums"
                            : "text-cream-soft tabular-nums"
                        }
                      >
                        {stock}
                      </td>

                      <td>
                        <span
                          className={
                            product.is_published
                              ? "text-success text-xs uppercase"
                              : "text-muted text-xs uppercase"
                          }
                        >
                          {product.is_published ? "Published" : "Draft"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
