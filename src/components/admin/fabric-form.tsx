"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { SingleImage } from "@/components/admin/single-image";
import { saveFabric, type FabricInput } from "@/app/admin/fabrics/actions";
import { formatNaira } from "@/lib/utils";
import type { Fabric } from "@/types";

/*
 * Cloth is not a product and this form is not the product form.
 *
 * It is measured, not counted — metres with a decimal point, priced per metre
 * — and it has provenance a garment does not: where it was woven, in what
 * pattern, in which colours. Forcing it through `products` would have meant an
 * integer stock count and a "quantity" that means one of nothing in particular.
 */

const field =
  "border-line bg-charcoal text-cream placeholder:text-muted/60 focus:border-gold/60 w-full rounded-md border px-3.5 py-2.5 text-sm outline-none transition-colors";
const label = "text-muted block text-[0.6rem] tracking-[0.24em] uppercase";

function previewKobo(naira: string) {
  const value = Number(naira.replace(/[^\d.]/g, ""));
  return Number.isFinite(value) ? Math.round(value * 100) : 0;
}

export function FabricForm({ fabric }: { fabric?: Fabric }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(fabric?.name ?? "");

  /*
   * Kept, not edited. Cloth has no public page of its own yet, so there is no
   * link to break and no reason to put the field in front of anyone — but an
   * existing slug must survive a save, or every edit would silently re-derive
   * one from the name.
   */
  const slug = fabric?.slug ?? "";
  const [origin, setOrigin] = useState(fabric?.origin ?? "");
  const [pattern, setPattern] = useState(fabric?.pattern ?? "");
  const [colours, setColours] = useState((fabric?.colours ?? []).join(", "));
  const [width, setWidth] = useState(
    fabric?.width_cm ? String(fabric.width_cm) : "",
  );
  const [pricePerMetre, setPrice] = useState(
    fabric?.price_per_metre ? String(fabric.price_per_metre / 100) : "",
  );
  const [metresAvailable, setMetres] = useState(
    fabric?.metres_available ?? "0",
  );
  const [description, setDescription] = useState(fabric?.description ?? "");
  const [image, setImage] = useState<string | null>(fabric?.image ?? null);
  const [isActive, setActive] = useState(fabric?.is_active ?? true);

  function submit() {
    setError(null);

    const input: FabricInput = {
      id: fabric?.id,
      name,
      slug,
      origin,
      pattern,
      colours,
      width,
      pricePerMetre,
      metresAvailable,
      description,
      image,
      isActive,
    };

    startTransition(async () => {
      const result = await saveFabric(input);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      router.push("/admin/fabrics");
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="max-w-3xl space-y-8"
    >
      <SingleImage
        value={image}
        onChange={setImage}
        ratio="aspect-square"
        label="Swatch"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="name">
            Fabric name
          </label>
          <input
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ìbílẹ̀ Gold"
            className={`${field} mt-2`}
          />
        </div>

        <div>
          <label className={label} htmlFor="origin">
            Origin
          </label>
          <input
            id="origin"
            value={origin}
            onChange={(event) => setOrigin(event.target.value)}
            placeholder="Iseyin"
            className={`${field} mt-2`}
          />
        </div>

        <div>
          <label className={label} htmlFor="pattern">
            Pattern
          </label>
          <input
            id="pattern"
            value={pattern}
            onChange={(event) => setPattern(event.target.value)}
            placeholder="Warp stripe, metallic weft"
            className={`${field} mt-2`}
          />
        </div>

        <div>
          <label className={label} htmlFor="colours">
            Colours
          </label>
          <input
            id="colours"
            value={colours}
            onChange={(event) => setColours(event.target.value)}
            placeholder="Bronze, Gold"
            className={`${field} mt-2`}
          />
          <p className="text-muted mt-2 text-xs">Separate with commas.</p>
        </div>

        <div>
          <label className={label} htmlFor="width">
            Loom width (cm)
          </label>
          <input
            id="width"
            inputMode="numeric"
            value={width}
            onChange={(event) => setWidth(event.target.value)}
            placeholder="25"
            className={`${field} mt-2`}
          />
          <p className="text-muted mt-2 text-xs">
            Aṣọ-òkè comes off a narrow loom, usually 20–30cm.
          </p>
        </div>

        <div>
          <label className={label} htmlFor="price">
            Price per metre (₦)
          </label>
          <input
            id="price"
            inputMode="decimal"
            value={pricePerMetre}
            onChange={(event) => setPrice(event.target.value)}
            placeholder="18000"
            className={`${field} mt-2`}
          />
          <p className="text-muted mt-2 text-xs">
            Saved as {formatNaira(previewKobo(pricePerMetre))} per metre
          </p>
        </div>

        <div>
          <label className={label} htmlFor="metres">
            Metres available
          </label>
          <input
            id="metres"
            inputMode="decimal"
            value={metresAvailable}
            onChange={(event) => setMetres(event.target.value)}
            placeholder="18.5"
            className={`${field} mt-2`}
          />
          <p className="text-muted mt-2 text-xs">
            Decimals are fine. Cloth is cut at 2.5m.
          </p>
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
            placeholder="How it is woven, how it wears, what it is good for."
            className={`${field} mt-2 resize-y`}
          />
        </div>
      </div>

      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(event) => setActive(event.target.checked)}
          className="accent-gold h-4 w-4"
        />
        Offer this cloth. Uncheck to retire it without losing the record
      </label>

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
        {pending ? "Saving…" : "Save fabric"}
      </button>
    </form>
  );
}
