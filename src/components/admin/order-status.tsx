"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { setOrderStatus } from "@/app/admin/orders/actions";
import { CANCELLED, STAGES, stageIndex } from "@/lib/fulfilment";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types";

/*
 * Moving an order along.
 *
 * The atelier stages are shown only for commissions — a scarf off the shelf
 * has no fitting, and offering one invites a mis-click that would tell a
 * customer their scarf is being altered.
 *
 * The note is the point of the whole control. "Shipped" is a fact; "Collected
 * by GIG this afternoon, tracking to follow" is an answer. Whatever is typed
 * here appears on the customer's own order page, so it is written to them.
 *
 * Fulfilment only. There is deliberately no control anywhere in this dashboard
 * for payment status — that is Paystack's to say, and the database refuses it
 * from here regardless.
 */
export function OrderStatusPicker({
  id,
  status,
  isBespoke,
}: {
  id: string;
  status: OrderStatus;
  /** Whether anything in the order is made to order. */
  isBespoke: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const current = stageIndex(status);
  const cancelled = status === "cancelled";

  const track = STAGES.filter((stage) => isBespoke || !stage.atelier);

  function move(next: OrderStatus) {
    setError(null);

    startTransition(async () => {
      const result = await setOrderStatus({ id, status: next, note });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setNote("");
      router.refresh();
    });
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {track.map((stage) => {
          const index = stageIndex(stage.value);
          const done = !cancelled && index < current;
          const isCurrent = stage.value === status;

          return (
            <button
              key={stage.value}
              type="button"
              disabled={pending}
              aria-current={isCurrent ? "step" : undefined}
              onClick={() => move(stage.value)}
              title={stage.customer}
              className={cn(
                "rounded-full border px-4 py-2 text-[0.62rem] tracking-[0.16em] uppercase transition-colors disabled:opacity-50",
                isCurrent && "border-gold bg-gold/15 text-gold",
                done && "border-line text-cream-soft",
                !isCurrent &&
                  !done &&
                  "border-line text-muted hover:text-cream",
                // The atelier's own stages carry the house colour, so the
                // weeks of work read differently from the days of postage.
                stage.atelier && !isCurrent && !done && "text-gold/45",
              )}
            >
              {stage.label}
            </button>
          );
        })}
      </div>

      <label className="mt-5 block">
        <span className="text-muted text-[0.55rem] tracking-[0.2em] uppercase">
          Note for the customer (optional)
        </span>
        <input
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Sleeves taken in an inch. Ready for collection Friday."
          className="border-line bg-charcoal text-cream placeholder:text-muted/60 focus:border-gold/60 mt-2 w-full rounded-md border px-3.5 py-2.5 text-sm transition-colors outline-none"
        />
        <span className="text-muted mt-2 block text-xs">
          Saved with whichever stage you press next, and shown on their order.
        </span>
      </label>

      <button
        type="button"
        disabled={pending}
        onClick={() => move(cancelled ? "processing" : CANCELLED.value)}
        className={cn(
          "mt-5 text-[0.6rem] tracking-[0.2em] uppercase transition-colors disabled:opacity-50",
          cancelled
            ? "text-danger hover:text-cream"
            : "text-muted hover:text-danger",
        )}
      >
        {cancelled ? "Cancelled: reopen it" : "Cancel this order"}
      </button>

      {error && <p className="text-danger mt-3 text-xs">{error}</p>}
    </div>
  );
}
