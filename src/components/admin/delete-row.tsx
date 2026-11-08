"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";

/**
 * Deleting is two clicks, and the second one says what will be lost.
 *
 * The action comes in as a prop, so this is the same control for a product, a
 * collection or a bolt of cloth — the caller supplies the server action, and
 * only that action decides what deleting actually means.
 */
export function DeleteRow({
  id,
  name,
  action,
  redirectTo,
  note,
}: {
  id: string;
  name: string;
  action: (id: string) => Promise<{ ok: boolean; error?: string }>;
  redirectTo: string;
  /** What survives it. Shown beside the confirmation. */
  note?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!confirming) {
    return (
      <div className="flex flex-col items-start gap-1">
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="text-muted hover:text-danger inline-flex items-center gap-1.5 text-[0.6rem] tracking-[0.2em] uppercase transition-colors"
        >
          <Trash2 size={13} strokeWidth={1.5} aria-hidden />
          Delete
        </button>
        {error && <span className="text-danger text-xs">{error}</span>}
      </div>
    );
  }

  return (
    <div className="border-danger/40 bg-danger/5 flex flex-wrap items-center gap-3 rounded-md border px-4 py-3">
      <div className="min-w-0">
        <p className="text-cream text-xs">Delete {name}?</p>
        {note && <p className="text-muted mt-1 text-[0.7rem]">{note}</p>}
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const result = await action(id);

              if (!result.ok) {
                setError(result.error ?? "Could not delete it.");
                setConfirming(false);
                return;
              }

              router.push(redirectTo);
              router.refresh();
            })
          }
          className="bg-danger/90 text-cream hover:bg-danger rounded px-3 py-1.5 text-[0.6rem] tracking-[0.2em] uppercase disabled:opacity-50"
        >
          {pending ? "Deleting…" : "Yes, delete"}
        </button>

        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="text-muted hover:text-cream text-[0.6rem] tracking-[0.2em] uppercase"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
