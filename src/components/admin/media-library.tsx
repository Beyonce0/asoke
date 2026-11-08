"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Check, Copy, ImagePlus, Loader2, Trash2 } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { PRODUCT_MEDIA, uploadImage } from "@/lib/upload";
import type { MediaAsset } from "@/lib/queries";

/*
 * Everything the atelier has uploaded, as one grid.
 *
 * The list is read on the server and handed in, so this component never
 * fetches on mount — it uploads, deletes, and asks the router to re-read.
 *
 * It reads the storage bucket directly rather than keeping a table beside it.
 * The bucket is already the truth; a second list would only be something to
 * keep in step, and the first time the two disagreed nobody would know which
 * was right.
 *
 * The cost is that "where is this file used?" cannot be answered from here — a
 * URL might be on a product, in the settings, or nowhere at all. Deleting is a
 * real risk, so it asks twice.
 */

const MAX_LABEL = 1024;

function readableSize(bytes: number) {
  if (bytes < MAX_LABEL) return `${bytes} B`;
  if (bytes < MAX_LABEL * MAX_LABEL) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaLibrary({ assets }: { assets: MediaAsset[] }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function upload(files: FileList) {
    setError(null);
    setBusy(true);

    for (const file of Array.from(files)) {
      const result = await uploadImage(file);
      if ("error" in result) setError(result.error);
    }

    setBusy(false);
    if (input.current) input.current.value = "";
    router.refresh();
  }

  async function remove(name: string) {
    setError(null);
    setConfirming(null);

    const supabase = createClient();
    const { error: removeError } = await supabase.storage
      .from(PRODUCT_MEDIA)
      .remove([name]);

    if (removeError) {
      setError(removeError.message);
      return;
    }

    router.refresh();
  }

  async function copy(url: string) {
    await navigator.clipboard.writeText(url);
    setCopied(url);
    window.setTimeout(() => setCopied(null), 1600);
  }

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={busy}
          className="bg-gold text-charcoal hover:bg-gold-light inline-flex h-11 items-center gap-2 rounded-md px-6 text-xs font-medium tracking-[0.18em] uppercase transition-colors disabled:opacity-50"
        >
          {busy ? (
            <Loader2 size={14} strokeWidth={2} className="animate-spin" />
          ) : (
            <ImagePlus size={14} strokeWidth={2} aria-hidden />
          )}
          {busy ? "Uploading" : "Upload images"}
        </button>

        <p className="text-muted text-xs">
          {assets.length} {assets.length === 1 ? "file" : "files"}
        </p>
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

      {error && <p className="text-danger mt-4 text-sm">{error}</p>}

      {assets.length === 0 ? (
        <p className="border-line text-muted mt-8 rounded-lg border border-dashed px-6 py-16 text-center text-sm">
          Nothing uploaded yet. Anything added here can be used on a product, a
          collection, or the front page.
        </p>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {assets.map((asset) => (
            <li
              key={asset.name}
              className="border-line bg-surface overflow-hidden rounded-lg border"
            >
              <div className="bg-charcoal relative aspect-square">
                <Image
                  src={asset.url}
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 18vw, (min-width: 640px) 30vw, 45vw"
                  className="object-cover"
                />
              </div>

              <div className="p-3">
                <p className="text-cream-soft truncate font-mono text-[0.6rem]">
                  {asset.name}
                </p>
                <p className="text-muted mt-1 text-[0.6rem]">
                  {readableSize(asset.size)}
                </p>

                {confirming === asset.name ? (
                  <div className="mt-3 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => void remove(asset.name)}
                      className="text-danger text-[0.55rem] tracking-[0.16em] uppercase"
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirming(null)}
                      className="text-muted hover:text-cream text-[0.55rem] tracking-[0.16em] uppercase"
                    >
                      Keep
                    </button>
                  </div>
                ) : (
                  <div className="mt-3 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => void copy(asset.url)}
                      className="text-muted hover:text-gold inline-flex items-center gap-1.5 text-[0.55rem] tracking-[0.16em] uppercase transition-colors"
                    >
                      {copied === asset.url ? (
                        <>
                          <Check size={11} strokeWidth={2.5} aria-hidden />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={11} strokeWidth={2} aria-hidden />
                          Copy URL
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setConfirming(asset.name)}
                      aria-label={`Delete ${asset.name}`}
                      className="text-muted hover:text-danger transition-colors"
                    >
                      <Trash2 size={12} strokeWidth={1.5} aria-hidden />
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
