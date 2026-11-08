import type { Metadata } from "next";
import Link from "next/link";

import { ProductGrid } from "@/components/shop/product-grid";
import { Container } from "@/components/ui/container";
import { getDictionary } from "@/i18n/server";
import { getCollections, getProducts } from "@/lib/queries";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getDictionary();
  return { title: meta.shop, description: meta.shopDescription };
}

export default async function ShopPage({ searchParams }: PageProps<"/shop">) {
  const { collection } = await searchParams;
  const active = typeof collection === "string" ? collection : undefined;

  const [products, collections, t] = await Promise.all([
    getProducts(active),
    getCollections(),
    getDictionary(),
  ]);

  return (
    <Container className="py-16 md:py-24">
      <h1 className="text-4xl md:text-6xl">
        {collections.find((c) => c.slug === active)?.name ?? t.shop.title}
      </h1>

      {collections.length > 0 && (
        <nav className="border-line mt-10 flex flex-wrap gap-x-7 gap-y-3 border-b pb-6">
          <FilterLink href="/shop" isActive={!active}>
            {t.shop.all}
          </FilterLink>
          {collections.map((item) => (
            <FilterLink
              key={item.id}
              href={`/shop?collection=${item.slug}`}
              isActive={active === item.slug}
            >
              {item.name}
            </FilterLink>
          ))}
        </nav>
      )}

      <div className="mt-14">
        <ProductGrid products={products} />
      </div>
    </Container>
  );
}

function FilterLink({
  href,
  isActive,
  children,
}: {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "text-[0.7rem] tracking-[0.2em] uppercase transition-colors",
        isActive ? "text-cream" : "text-muted hover:text-cream",
      )}
    >
      {children}
    </Link>
  );
}
