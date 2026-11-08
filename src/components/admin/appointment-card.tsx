"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { CalendarClock, Phone } from "lucide-react";

import { updateAppointment } from "@/app/admin/appointments/actions";
import { cn } from "@/lib/utils";
import type { Appointment, AppointmentStatus } from "@/types";

/*
 * One booking, with the three things the atelier ever does to it: confirm it,
 * move it, or drop it.
 *
 * Rescheduling is inline rather than on a page of its own. It is one field,
 * and the answer to "can we do Friday instead" should not cost a navigation.
 */

const TONE: Record<AppointmentStatus, string> = {
  requested: "border-gold/40 text-gold",
  confirmed: "border-success/40 text-success",
  completed: "border-line text-muted",
  cancelled: "border-line text-muted line-through",
};

const LABEL: Record<AppointmentStatus, string> = {
  requested: "Requested",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

/** The instant, as a `datetime-local` value in the atelier's own hours. */
function toLocalInput(iso: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date(iso));

  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "00";

  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

export function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [moving, setMoving] = useState(false);
  const [when, setWhen] = useState(() => toLocalInput(appointment.starts_at));
  const [error, setError] = useState<string | null>(null);

  const time = new Date(appointment.starts_at).toLocaleTimeString("en-NG", {
    timeZone: "Africa/Lagos",
    hour: "2-digit",
    minute: "2-digit",
  });

  function run(patch: Parameters<typeof updateAppointment>[0]) {
    setError(null);

    startTransition(async () => {
      const result = await updateAppointment(patch);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setMoving(false);
      router.refresh();
    });
  }

  return (
    <div className="border-line bg-surface rounded-lg border p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-cream text-sm">{appointment.full_name}</p>
          <p className="text-cream-soft mt-1 text-xs">{appointment.kind}</p>
        </div>

        <span
          className={cn(
            "shrink-0 rounded-full border px-3 py-1 text-[0.55rem] tracking-[0.18em] uppercase",
            TONE[appointment.status],
          )}
        >
          {LABEL[appointment.status]}
        </span>
      </div>

      <p className="text-gold mt-4 inline-flex items-center gap-2 text-sm tabular-nums">
        <CalendarClock size={14} strokeWidth={1.5} aria-hidden />
        {time} · {appointment.duration_minutes} min
      </p>

      <div className="text-muted mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs">
        <a href={`mailto:${appointment.email}`} className="hover:text-cream">
          {appointment.email}
        </a>
        {appointment.phone && (
          <a
            href={`tel:${appointment.phone}`}
            className="hover:text-cream inline-flex items-center gap-1.5"
          >
            <Phone size={11} strokeWidth={1.5} aria-hidden />
            {appointment.phone}
          </a>
        )}
      </div>

      {appointment.notes && (
        <p className="text-cream-soft mt-3 text-xs leading-relaxed">
          {appointment.notes}
        </p>
      )}

      {moving ? (
        <div className="border-line mt-4 flex flex-wrap items-end gap-3 border-t pt-4">
          <label className="flex-1">
            <span className="text-muted text-[0.55rem] tracking-[0.2em] uppercase">
              New time (Lagos)
            </span>
            <input
              type="datetime-local"
              value={when}
              onChange={(event) => setWhen(event.target.value)}
              className="border-line bg-charcoal text-cream mt-1.5 w-full rounded-md border px-3 py-2 text-sm"
            />
          </label>

          <button
            type="button"
            disabled={pending}
            onClick={() => run({ id: appointment.id, startsAt: when })}
            className="bg-gold text-charcoal hover:bg-gold-light h-9 rounded-md px-4 text-[0.6rem] tracking-[0.18em] uppercase disabled:opacity-50"
          >
            {pending ? "Moving…" : "Move it"}
          </button>

          <button
            type="button"
            onClick={() => setMoving(false)}
            className="text-muted hover:text-cream h-9 text-[0.6rem] tracking-[0.18em] uppercase"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="border-line mt-4 flex flex-wrap items-center gap-4 border-t pt-4">
          {appointment.status === "requested" && (
            <button
              type="button"
              disabled={pending}
              onClick={() => run({ id: appointment.id, status: "confirmed" })}
              className="text-success hover:text-cream text-[0.6rem] tracking-[0.18em] uppercase disabled:opacity-50"
            >
              Confirm
            </button>
          )}

          {appointment.status === "confirmed" && (
            <button
              type="button"
              disabled={pending}
              onClick={() => run({ id: appointment.id, status: "completed" })}
              className="text-cream-soft hover:text-cream text-[0.6rem] tracking-[0.18em] uppercase disabled:opacity-50"
            >
              Mark kept
            </button>
          )}

          <button
            type="button"
            onClick={() => setMoving(true)}
            className="text-muted hover:text-cream text-[0.6rem] tracking-[0.18em] uppercase"
          >
            Reschedule
          </button>

          {appointment.status !== "cancelled" && (
            <button
              type="button"
              disabled={pending}
              onClick={() => run({ id: appointment.id, status: "cancelled" })}
              className="text-muted hover:text-danger ml-auto text-[0.6rem] tracking-[0.18em] uppercase disabled:opacity-50"
            >
              Cancel
            </button>
          )}
        </div>
      )}

      {error && <p className="text-danger mt-3 text-xs">{error}</p>}
    </div>
  );
}
