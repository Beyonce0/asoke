"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";

import {
  ImageUploader,
  type DraftImage,
} from "@/components/admin/image-uploader";
import { saveProduct, type ProductInput } from "@/app/admin/products/actions";
import { formatNaira } from "@/lib/utils";
import type { Collection, ProductType, ProductWithDetail } from "@/types";

/*
 * One form for adding and for editing — the only difference is whether it
 * starts empty, so there is no second copy of these fields to keep in step.
 *
 * PRICES ARE TYPED IN NAIRA. The database stores kobo and the action converts.
 * The hint under the field shows what will actually be saved, because "150000"
 * and "1500.00" are one keystroke apart and a wrong one is a real sale at the
 * wrong price.
 *
 * Draft and Publish are the same save with a different flag, not two paths.
 */

type DraftVariant = {
  id?: string;
  color: string;
  size: string;
  priceOverride: string;
  stock: number;
  isActive: boolean;
};

const TYPES: { value: ProductType; label: string }[] = [
  { value: "ready_to_wear", label: "Ready to wear" },
  { value: "fabric", label: "Fabric" },
  { value: "bespoke", label: "Bespoke" },
  { value: "custom", label: "Custom" },
];

const field =
  "border-line bg-charcoal text-cream placeholder:text-muted/60 focus:border-gold/60 w-full rounded-md border px-3.5 py-2.5 text-sm outline-none transition-colors";
const label = "text-muted block text-[0.6rem] tracking-[0.24em] uppercase";

/** Naira as typed → kobo, for the live hint only. The action does its own. */
function preview(naira: string) {
  const value = Number(naira.replace(/[^\d.]/g, ""));
  return Number.isFinite(value) ? Math.round(value * 100) : 0;
}

export function ProductForm({
  product,
  collections,
}: {
  product?: ProductWithDetail;
  collections: Collection[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [story, setStory] = useState(product?.story ?? "");
  const [collectionId, setCollectionId] = useState(
    product?.collection_id ?? "",
  );
  const [price, setPrice] = useState(
    product ? String(product.base_price / 100) : "",
  );
  const [productType, setProductType] = useState<ProductType>(
    product?.product_type ?? "ready_to_wear",
  );
  const [fabricType, setFabricType] = useState(product?.fabric_type ?? "");
  const [turnVideo, setTurnVideo] = useState(product?.turn_video ?? "");
  const [isFeatured, setFeatured] = useState(product?.is_featured ?? false);

  const [images, setImages] = useState<DraftImage[]>(
    (product?.product_images ?? []).map((image) => ({
      url: image.url,
      alt: image.alt ?? "",
      view: image.view,
    })),
  );

  const [variants, setVariants] = useState<DraftVariant[]>(
    product?.product_variants?.length
      ? product.product_variants.map((variant) => ({
          id: variant.id,
          color: variant.color ?? "",
          size: variant.size ?? "",
          priceOverride: variant.price_override
            ? String(variant.price_override / 100)
            : "",
          stock: variant.stock,
          isActive: variant.is_active,
        }))
      : [
          {
            color: "",
            size: "One size",
            priceOverride: "",
            stock: 1,
            isActive: true,
          },
        ],
  );

  function patchVariant(index: number, patch: Partial<DraftVariant>) {
    setVariants((current) =>
      current.map((variant, i) =>
        i === index ? { ...variant, ...patch } : variant,
      ),
    );
  }

  function submit(isPublished: boolean) {
    setError(null);

    const input: ProductInput = {
      id: product?.id,
      name,
      slug,
      description,
      story,
      collectionId: collectionId || null,
      price,
      productType,
      fabricType,
      turnVideo,
      isPublished,
      isFeatured,
      images,
      variants,
    };

    startTransition(async () => {
      const result = await saveProduct(input);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      router.push("/admin/products");
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="max-w-4xl space-y-10"
    >
      <section className="space-y-4">
        <h2 className={label}>Photography</h2>
        <ImageUploader images={images} onChange={setImages} />
      </section>

      <section className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={label} htmlFor="name">
            Product name
          </label>
          <input
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ìbílẹ̀ Gold Scarf"
            className={`${field} mt-2`}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={label} htmlFor="slug">
            Web address
          </label>
          <input
            id="slug"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            placeholder="Left blank, one is made from the name"
            className={`${field} mt-2`}
          />
          <p className="text-muted mt-2 text-xs">
            /shop/{slug || "…"}. Changing this on a live piece breaks any link
            already shared.
          </p>
        </div>

        <div>
          <label className={label} htmlFor="price">
            Price (₦)
          </label>
          <input
            id="price"
            inputMode="decimal"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            placeholder="150000"
            className={`${field} mt-2`}
          />
          <p className="text-muted mt-2 text-xs">
            Saved as {formatNaira(preview(price))}
          </p>
        </div>

        <div>
          <label className={label} htmlFor="collection">
            Collection
          </label>
          <select
            id="collection"
            value={collectionId}
            onChange={(event) => setCollectionId(event.target.value)}
            className={`${field} mt-2`}
          >
            <option value="">No collection</option>
            {collections.map((collection) => (
              <option key={collection.id} value={collection.id}>
                {collection.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={label} htmlFor="fabric">
            Fabric
          </label>
          <input
            id="fabric"
            value={fabricType}
            onChange={(event) => setFabricType(event.target.value)}
            placeholder="Aṣọ-òkè"
            className={`${field} mt-2`}
          />
        </div>

        <div>
          <label className={label} htmlFor="type">
            Product type
          </label>
          <select
            id="type"
            value={productType}
            onChange={(event) =>
              setProductType(event.target.value as ProductType)
            }
            className={`${field} mt-2`}
          >
            {TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className={label} htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What it is, in two lines. Shown on the card and the product page."
            className={`${field} mt-2 resize-y`}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={label} htmlFor="story">
            The story
          </label>
          <textarea
            id="story"
            rows={4}
            value={story}
            onChange={(event) => setStory(event.target.value)}
            placeholder="Where the cloth came from, who wove it, what it is for."
            className={`${field} mt-2 resize-y`}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={label} htmlFor="turn">
            Turn video
          </label>
          <input
            id="turn"
            value={turnVideo}
            onChange={(event) => setTurnVideo(event.target.value)}
            placeholder="https://…/turn.mp4"
            className={`${field} mt-2`}
          />
          <p className="text-muted mt-2 text-xs">
            Green-screen clip of the piece turning. Keyed as it plays, so it
            must be shot on the atelier screen. Anything else keys wrong.
          </p>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-4">
          <h2 className={label}>Variants &amp; stock</h2>
          <button
            type="button"
            onClick={() =>
              setVariants((current) => [
                ...current,
                {
                  color: "",
                  size: "",
                  priceOverride: "",
                  stock: 1,
                  isActive: true,
                },
              ])
            }
            className="text-gold hover:text-gold-light inline-flex items-center gap-1.5 text-[0.6rem] tracking-[0.2em] uppercase"
          >
            <Plus size={12} strokeWidth={2} aria-hidden />
            Add variant
          </button>
        </div>

        <p className="text-muted mt-2 text-xs">
          Every piece needs at least one. Stock here is what the shop sells
          down; a variant at zero shows as sold out.
        </p>

        <div className="mt-4 space-y-3">
          {variants.map((variant, index) => (
            <div
              key={variant.id ?? index}
              className="border-line bg-surface grid gap-3 rounded-lg border p-4 sm:grid-cols-[1fr_1fr_1fr_5rem_auto]"
            >
              <input
                value={variant.color}
                onChange={(event) =>
                  patchVariant(index, { color: event.target.value })
                }
                placeholder="Colour"
                aria-label="Colour"
                className={field}
              />
              <input
                value={variant.size}
                onChange={(event) =>
                  patchVariant(index, { size: event.target.value })
                }
                placeholder="Size"
                aria-label="Size"
                className={field}
              />
              <input
                value={variant.priceOverride}
                onChange={(event) =>
                  patchVariant(index, { priceOverride: event.target.value })
                }
                placeholder="Price override ₦"
                aria-label="Price override in naira"
                inputMode="decimal"
                className={field}
              />
              <input
                type="number"
                min={0}
                value={variant.stock}
                onChange={(event) =>
                  patchVariant(index, { stock: Number(event.target.value) })
                }
                aria-label="Stock"
                className={field}
              />
              <button
                type="button"
                onClick={() =>
                  setVariants((current) =>
                    current.length === 1
                      ? current
                      : current.filter((_, i) => i !== index),
                  )
                }
                disabled={variants.length === 1}
                aria-label="Remove variant"
                className="text-muted hover:text-danger grid place-items-center px-2 disabled:opacity-30"
              >
                <Trash2 size={15} strokeWidth={1.5} aria-hidden />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="border-line border-t pt-8">
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(event) => setFeatured(event.target.checked)}
            className="accent-gold h-4 w-4"
          />
          Feature in “This season” on the homepage
        </label>

        {error && (
          <p className="border-danger/40 bg-danger/10 text-danger mt-6 rounded-md border px-4 py-3 text-sm">
            {error}
          </p>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={pending}
            onClick={() => submit(true)}
            className="bg-gold text-charcoal hover:bg-gold-light h-11 rounded-md px-7 text-xs font-medium tracking-[0.18em] uppercase transition-colors disabled:opacity-50"
          >
            {pending ? "Saving…" : "Publish product"}
          </button>

          <button
            type="button"
            disabled={pending}
            onClick={() => submit(false)}
            className="border-line text-cream-soft hover:border-cream hover:text-cream h-11 rounded-md border px-7 text-xs font-medium tracking-[0.18em] uppercase transition-colors disabled:opacity-50"
          >
            Save as draft
          </button>
        </div>
      </section>
    </form>
  );
}
