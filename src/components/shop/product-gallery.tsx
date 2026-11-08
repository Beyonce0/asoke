"use client";

import Image from "next/image";
import { useState } from "react";

import { ChromaVideo } from "@/components/motion/chroma-video";
import { useI18n } from "@/i18n/client";
import { GREEN_SCREEN } from "@/lib/chroma";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types";

/*
 * The picture on a product page, and the switch above it.
 *
 * A shopper's first two questions about a piece are what the back looks like
 * and how the cloth moves — aso-oke is stiff and heavy, and it hangs nothing
 * like the jersey most people picture. Both were previously unanswerable, so
 * the page now offers whatever the piece actually has: its sides, and a film
 * of it turning.
 *
 * Every option is derived from the row. A piece with one photograph and no
 * film shows a single option and looks deliberate rather than broken, which is
 * the state most of the catalogue will be in.
 *
 * The stills are all mounted at once and cross-faded, so switching back to one
 * already decoded is instant. The film is mounted only when it is asked for —
 * it is a megabyte, and a shopper who never presses it should never pay for it.
 */

/**
 * The `<source>` type, from the file name. Getting this wrong only costs a
 * format probe in the browser, but a correct hint lets it skip one.
 */
function mimeFor(url: string) {
  const extension = url.split("?")[0].split(".").pop()?.toLowerCase();

  if (extension === "webm") return "video/webm";
  if (extension === "ogv") return "video/ogg";
  return "video/mp4";
}

const MOTION = "motion";

export function ProductGallery({
  images,
  turnVideo,
  name,
}: {
  images: ProductImage[];
  turnVideo: string | null;
  name: string;
}) {
  const { t } = useI18n();
  const stills = [...images].sort((a, b) => a.sort_order - b.sort_order);

  const [active, setActive] = useState(() => stills[0]?.id ?? MOTION);

  // Only ever true once the shopper has asked for it, and never false again —
  // going back to a still should not throw the decoded video away.
  const [wantsMotion, setWantsMotion] = useState(false);

  if (stills.length === 0 && !turnVideo) {
    return (
      <div className="bg-surface text-muted flex aspect-[4/5] items-center justify-center text-xs tracking-[0.2em] uppercase">
        {t.product.imageComing}
      </div>
    );
  }

  const options = [
    ...stills.map((still) => ({
      id: still.id,
      label: t.product[still.view],
    })),
    ...(turnVideo ? [{ id: MOTION, label: t.product.inMotion }] : []),
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-surface relative aspect-[4/5] overflow-hidden">
        {stills.map((still, index) => (
          <Image
            key={still.id}
            src={still.url}
            alt={still.alt ?? `${name}, ${t.product[still.view].toLowerCase()}`}
            fill
            priority={index === 0}
            sizes="(min-width: 1024px) 45vw, 92vw"
            className={cn(
              "object-cover transition-opacity duration-500",
              active === still.id ? "opacity-100" : "opacity-0",
            )}
          />
        ))}

        {turnVideo && wantsMotion && (
          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-500",
              active === MOTION ? "opacity-100" : "opacity-0",
            )}
          >
            {/*
              Keyed live, and left with no background of its own: the piece
              turns against the same surface tone as the stills, so switching
              between them does not change the room she is standing in.
            */}
            <ChromaVideo
              sources={[{ src: turnVideo, type: mimeFor(turnVideo) }]}
              keyColor={GREEN_SCREEN.keyColor}
              similarity={GREEN_SCREEN.similarity}
              smoothness={GREEN_SCREEN.smoothness}
              className="h-full w-full"
              canvasClassName="object-contain"
            />
          </div>
        )}
      </div>

      {options.length > 1 && (
        <div className="flex flex-wrap items-center gap-6">
          {options.map((option) => {
            const isActive = active === option.id;

            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => {
                  setActive(option.id);
                  if (option.id === MOTION) setWantsMotion(true);
                }}
                // Hovering the motion option is enough to start fetching it, so
                // by the time the click lands the first frame is usually there.
                onPointerEnter={() => {
                  if (option.id === MOTION) setWantsMotion(true);
                }}
                className={cn(
                  "border-b pb-1.5 text-[0.65rem] tracking-[0.24em] uppercase transition-colors",
                  isActive
                    ? "border-gold text-gold"
                    : "text-muted hover:text-cream-soft border-transparent",
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
