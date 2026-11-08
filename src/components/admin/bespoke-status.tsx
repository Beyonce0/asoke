"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Check } from "lucide-react";

import { setBespokeStatus } from "@/app/admin/bespoke/actions";
import { cn } from "@/lib/utils";
import type { BespokeStatus } from "@/types";

/*
 * The track a commission runs along, as a row of stops rather than a dropdown.
 *
 * A select would hide where the enquiry is until you opened it. Here the whole
 * journey is visible at once, everything behind the current stop is marked
 * done, and moving it is one click on the stop you have reached.
 *
 * Cancelled sits apart, because it is not further along the same road.
 */

export const TRACK: { value: BespokeStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "reviewing", label: "Reviewing" },
  { value: "consultation", label: "Consultation" },
  { value: "in_production", label: "In production" },
  { value: "completed", label: "Completed" },
];

export function BespokeStatusPicker({
  id,
  status,
}: {
  id: string;
  status: BespokeStatus;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const position = TRACK.findIndex((stop) => stop.value === status);
  const cancelled = status === "cancelled";

  function move(next: BespokeStatus) {
    setError(null);

    startTransition(async () => {
      const result = await setBespokeStatus({ id, status: next });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      router.refresh();
    });
  }

  return (
    <div>
      <p className="text-muted text-[0.6rem] tracking-[0.24em] uppercase">
        Where it has got to
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {TRACK.map((stop, index) => {
          const done = !cancelled && index < position;
          const current = stop.value === status;

          return (
            <button
              key={stop.value}
              type="button"
              disabled={pending}
              aria-current={current ? "step" : undefined}
              onClick={() => move(stop.value)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[0.65rem] tracking-[0.16em] uppercase transition-colors disabled:opacity-50",
                current && "border-gold bg-gold/15 text-gold",
                done && "border-line text-cream-soft",
                !current && !done && "border-line text-muted hover:text-cream",
              )}
            >
              {done && <Check size={11} strokeWidth={2.5} aria-hidden />}
              {stop.label}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={pending}
        onClick={() => move(cancelled ? "new" : "cancelled")}
        className={cn(
          "mt-4 text-[0.6rem] tracking-[0.2em] uppercase transition-colors disabled:opacity-50",
          cancelled
            ? "text-danger hover:text-cream"
            : "text-muted hover:text-danger",
        )}
      >
        {cancelled ? "Cancelled: reopen as new" : "Cancel this commission"}
      </button>

      {error && <p className="text-danger mt-3 text-xs">{error}</p>}
    </div>
  );
}
