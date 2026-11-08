import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AddToCart } from "@/components/shop/add-to-cart";
import { ProductGallery } from "@/components/shop/product-gallery";
import { Container } from "@/components/ui/container";
import { getDictionary } from "@/i18n/server";
import { getProductBySlug } from "@/lib/queries";

export async function generateMetadata({
  params,
}: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: (await getDictionary()).meta.notFound };

  return {
    title: product.name,
    description: product.description ?? undefined,
    openGraph: {
      images: product.product_images[0]?.url
        ? [product.product_images[0].url]
        : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: PageProps<"/shop/[slug]">) {
  const { slug } = await params;
  const [product, t] = await Promise.all([
    getProductBySlug(slug),
    getDictionary(),
  ]);

  if (!product) notFound();

  return (
    <Container className="py-12 md:py-20">
      <nav className="text-muted mb-10 text-[0.65rem] tracking-[0.2em] uppercase">
        <Link href="/shop" className="hover:text-cream transition-colors">
          {t.nav.shop}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-cream-soft">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Front, back, and the piece in motion — whichever the row has. */}
        <ProductGallery
          images={product.product_images}
          turnVideo={product.turn_video}
          name={product.name}
        />

        {/* Sticks while the image column scrolls — Lenis keeps this smooth. */}
        <div className="lg:sticky lg:top-32 lg:h-fit lg:pt-6">
          {product.collections && (
            <Link
              href={`/shop?collection=${product.collections.slug}`}
              className="text-muted hover:text-cream text-[0.65rem] tracking-[0.28em] uppercase transition-colors"
            >
              {product.collections.name}
            </Link>
          )}

          <h1 className="mt-5 text-4xl md:text-5xl">{product.name}</h1>

          {product.description && (
            <p className="text-cream-soft mt-7 text-base leading-relaxed">
              {product.description}
            </p>
          )}

          <AddToCart product={product} />

          {product.story && (
            <section className="border-line mt-14 border-t pt-8">
              <h2 className="font-sans text-[0.65rem] tracking-[0.24em] uppercase">
                {t.product.story}
              </h2>
              <p className="text-cream-soft mt-4 text-sm leading-relaxed">
                {product.story}
              </p>
            </section>
          )}
        </div>
      </div>
    </Container>
  );
}
