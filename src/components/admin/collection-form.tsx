"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { SingleImage } from "@/components/admin/single-image";
import {
  saveCollection,
  type CollectionInput,
} from "@/app/admin/collections/actions";
import type { Collection } from "@/types";

const field =
  "border-line bg-charcoal text-cream placeholder:text-muted/60 focus:border-gold/60 w-full rounded-md border px-3.5 py-2.5 text-sm outline-none transition-colors";
const label = "text-muted block text-[0.6rem] tracking-[0.24em] uppercase";

export function CollectionForm({ collection }: { collection?: Collection }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(collection?.name ?? "");
  const [slug, setSlug] = useState(collection?.slug ?? "");
  const [description, setDescription] = useState(collection?.description ?? "");
  const [heroImage, setHeroImage] = useState<string | null>(
    collection?.hero_image ?? null,
  );
  const [sortOrder, setSortOrder] = useState(
    String(collection?.sort_order ?? 0),
  );

  function submit() {
    setError(null);

    const input: CollectionInput = {
      id: collection?.id,
      name,
      slug,
      description,
      heroImage,
      sortOrder,
    };

    startTransition(async () => {
      const result = await saveCollection(input);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      router.push("/admin/collections");
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="max-w-2xl space-y-8"
    >
      <SingleImage
        value={heroImage}
        onChange={setHeroImage}
        label="Cover image"
      />

      <div>
        <label className={label} htmlFor="name">
          Name
        </label>
        <input
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Bridal"
          className={`${field} mt-2`}
        />
      </div>

      <div>
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
          /shop?collection={slug || "…"}. Changing this breaks links already
          shared.
        </p>
      </div>

      <div>
        <label className={label} htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="One line, shown under the name on the storefront."
          className={`${field} mt-2 resize-y`}
        />
      </div>

      <div className="max-w-[10rem]">
        <label className={label} htmlFor="sort">
          Order
        </label>
        <input
          id="sort"
          type="number"
          min={0}
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value)}
          className={`${field} mt-2`}
        />
        <p className="text-muted mt-2 text-xs">Low numbers come first.</p>
      </div>

      {error && (
        <p className="border-danger/40 bg-danger/10 text-danger rounded-md border px-4 py-3 text-sm">
          {error}
        </p>
      )}

      <button
        type="button"
        disabled={pending}
        onClick={submit}
        className="bg-gold text-charcoal hover:bg-gold-light h-11 w-full rounded-md px-7 text-xs font-medium tracking-[0.18em] uppercase transition-colors disabled:opacity-50 sm:w-auto"
      >
        {pending ? "Saving…" : "Save collection"}
      </button>
    </form>
  );
}
