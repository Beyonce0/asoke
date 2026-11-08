"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { cn } from "@/lib/utils";

/**
 * A row of states, one of which is current.
 *
 * The same control serves the inbox, the diary and the order list — three
 * screens whose only shared need is "say where this is, and let me change it".
 * The action comes in as a prop, so what a state *means* stays with the
 * feature and only the pressing lives here.
 */
export function StatusButtons<T extends string>({
  value,
  options,
  onSelect,
  size = "md",
}: {
  value: T;
  options: { value: T; label: string; tone?: "danger" | "success" }[];
  onSelect: (next: T) => Promise<{ ok: boolean; error?: string }>;
  size?: "sm" | "md";
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const current = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              disabled={pending}
              aria-pressed={current}
              onClick={() =>
                startTransition(async () => {
                  setError(null);
                  const result = await onSelect(option.value);

                  if (!result.ok) {
                    setError(result.error ?? "Could not change it.");
                    return;
                  }

                  router.refresh();
                })
              }
              className={cn(
                "rounded-full border tracking-[0.16em] uppercase transition-colors disabled:opacity-50",
                size === "sm"
                  ? "px-3 py-1.5 text-[0.55rem]"
                  : "px-4 py-2 text-[0.65rem]",
                current && option.tone === "danger"
                  ? "border-danger/50 bg-danger/15 text-danger"
                  : current && option.tone === "success"
                    ? "border-success/50 bg-success/15 text-success"
                    : current
                      ? "border-gold bg-gold/15 text-gold"
                      : "border-line text-muted hover:text-cream",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {error && <p className="text-danger mt-3 text-xs">{error}</p>}
    </div>
  );
}
