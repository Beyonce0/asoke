"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";

import { uploadImage } from "@/lib/upload";
import { cn } from "@/lib/utils";
import type { GarmentView } from "@/types";

/*
 * Product photography, uploaded from the browser to Supabase Storage.
 *
 * The file never touches this app's server. It goes straight to storage with
 * the admin's own session, and only the resulting URL is submitted with the
 * form — which is why a 4MB photograph does not have to fit inside a server
 * action's payload limit.
 *
 * Order is meaning, not decoration: the first image is what every card in the
 * shop leads with. The view on each one is what the product gallery builds its
 * Front / Back switch from.
 */

export type DraftImage = { url: string; alt: string; view: GarmentView };

const VIEWS: GarmentView[] = ["front", "back", "detail"];

export function ImageUploader({
  images,
  onChange,
}: {
  images: DraftImage[];
  onChange: (next: DraftImage[]) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(files: FileList) {
    setError(null);
    setBusy(true);

    const added: DraftImage[] = [];

    for (const file of Array.from(files)) {
      const result = await uploadImage(file);

      if ("error" in result) {
        setError(result.error);
        continue;
      }

      added.push({
        url: result.url,
        alt: "",
        // First upload is almost always the front; the rest are corrected by
        // hand, which is faster than choosing every time.
        view: images.length + added.length === 0 ? "front" : "detail",
      });
    }

    onChange([...images, ...added]);
    setBusy(false);
    if (input.current) input.current.value = "";
  }

  function update(index: number, patch: Partial<DraftImage>) {
    onChange(
      images.map((image, i) => (i === index ? { ...image, ...patch } : image)),
    );
  }

  function move(index: number, direction: -1 | 1) {
    const next = [...images];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-4">
        {images.map((image, index) => (
          <div
            key={image.url}
            className="border-line bg-charcoal w-40 shrink-0 rounded-lg border p-2"
          >
            <div className="bg-surface relative aspect-[2/3] overflow-hidden rounded">
              <Image
                src={image.url}
                alt=""
                fill
                sizes="160px"
                className="object-cover"
              />

              {index === 0 && (
                <span className="bg-gold text-charcoal absolute top-1.5 left-1.5 rounded px-1.5 py-0.5 text-[0.5rem] tracking-[0.16em] uppercase">
                  Main
                </span>
              )}

              <button
                type="button"
                onClick={() => onChange(images.filter((_, i) => i !== index))}
                aria-label="Remove image"
                className="bg-charcoal/85 text-cream-soft hover:text-danger absolute top-1.5 right-1.5 rounded p-1"
              >
                <X size={12} strokeWidth={2} aria-hidden />
              </button>
            </div>

            <select
              value={image.view}
              onChange={(event) =>
                update(index, { view: event.target.value as GarmentView })
              }
              aria-label="What this photograph shows"
              className="border-line bg-surface text-cream-soft mt-2 w-full rounded border px-2 py-1.5 text-xs capitalize"
            >
              {VIEWS.map((view) => (
                <option key={view} value={view}>
                  {view}
                </option>
              ))}
            </select>

            <input
              value={image.alt}
              onChange={(event) => update(index, { alt: event.target.value })}
              placeholder="Alt text"
              aria-label="Alt text"
              className="border-line bg-surface text-cream-soft placeholder:text-muted/60 mt-1.5 w-full rounded border px-2 py-1.5 text-xs"
            />

            <div className="mt-1.5 flex gap-1">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                className="border-line text-muted hover:text-cream flex-1 rounded border py-1 text-xs disabled:opacity-35"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === images.length - 1}
                className="border-line text-muted hover:text-cream flex-1 rounded border py-1 text-xs disabled:opacity-35"
              >
                →
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={busy}
          className={cn(
            "border-line text-muted hover:border-gold/50 hover:text-gold grid h-[19.5rem] w-40 shrink-0 place-items-center gap-2 rounded-lg border border-dashed transition-colors",
            busy && "cursor-wait",
          )}
        >
          {busy ? (
            <Loader2 size={20} strokeWidth={1.5} className="animate-spin" />
          ) : (
            <ImagePlus size={20} strokeWidth={1.5} />
          )}
          <span className="text-[0.6rem] tracking-[0.2em] uppercase">
            {busy ? "Uploading" : "Add images"}
          </span>
        </button>
      </div>

      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(event) => {
          if (event.target.files?.length) void upload(event.target.files);
        }}
      />

      {error && <p className="text-danger mt-3 text-xs">{error}</p>}

      <p className="text-muted mt-3 text-xs">
        First image leads every card in the shop. Front and back become the
        switch on the product page.
      </p>
    </div>
  );
}
