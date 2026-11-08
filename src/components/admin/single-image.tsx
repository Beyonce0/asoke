"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";

import { uploadImage } from "@/lib/upload";
import { cn } from "@/lib/utils";

/**
 * One picture, where one picture is the whole point — a collection's cover, a
 * fabric's swatch. The products form uses `ImageUploader` instead, because a
 * garment is a set of views and this deliberately cannot express that.
 */
export function SingleImage({
  value,
  onChange,
  ratio = "aspect-[2/3]",
  label = "Cover image",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  /** The shape it will be shown in on the storefront. */
  ratio?: string;
  label?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setError(null);
    setBusy(true);

    const result = await uploadImage(file);

    if ("error" in result) setError(result.error);
    else onChange(result.url);

    setBusy(false);
    if (input.current) input.current.value = "";
  }

  return (
    <div>
      <p className="text-muted text-[0.6rem] tracking-[0.24em] uppercase">
        {label}
      </p>

      <div
        className={cn(
          "bg-surface relative mt-2 w-44 overflow-hidden rounded-lg",
          ratio,
        )}
      >
        {value ? (
          <>
            <Image
              src={value}
              alt=""
              fill
              sizes="176px"
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => onChange(null)}
              aria-label="Remove image"
              className="bg-charcoal/85 text-cream-soft hover:text-danger absolute top-2 right-2 rounded p-1.5"
            >
              <X size={12} strokeWidth={2} aria-hidden />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => input.current?.click()}
            disabled={busy}
            className="border-line text-muted hover:border-gold/50 hover:text-gold grid h-full w-full place-items-center gap-2 rounded-lg border border-dashed transition-colors"
          >
            {busy ? (
              <Loader2 size={20} strokeWidth={1.5} className="animate-spin" />
            ) : (
              <ImagePlus size={20} strokeWidth={1.5} />
            )}
            <span className="text-[0.6rem] tracking-[0.2em] uppercase">
              {busy ? "Uploading" : "Upload"}
            </span>
          </button>
        )}
      </div>

      <input
        ref={input}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void upload(file);
        }}
      />

      {error && <p className="text-danger mt-2 text-xs">{error}</p>}
    </div>
  );
}
