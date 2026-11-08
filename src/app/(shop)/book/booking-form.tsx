"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/client";
import {
  APPOINTMENT_KINDS,
  APPOINTMENT_SLOTS,
  BOOKING_WINDOW_DAYS,
  lagosDate,
} from "@/lib/appointments";
import { requestAppointment, type BookingState } from "./actions";

const fieldClass =
  "border-line bg-transparent focus:border-cream h-12 w-full border px-4 text-sm outline-none transition-colors";

const labelClass = "text-muted text-[0.65rem] tracking-[0.24em] uppercase";

function SubmitButton() {
  const { pending } = useFormStatus();
  const { t } = useI18n();

  return (
    <Button type="submit" size="lg" disabled={pending} className="mt-4 w-full">
      {pending ? t.book.sending : t.book.submit}
    </Button>
  );
}

export function BookingForm() {
  const [state, formAction] = useActionState<BookingState, FormData>(
    requestAppointment,
    {},
  );
  const t = useI18n().t.book;

  if (state.booked) {
    return (
      <div role="status" className="bg-surface p-10">
        <h2 className="text-3xl">{t.thanksTitle}</h2>
        <p className="text-cream-soft mt-4 text-sm leading-relaxed">
          {state.booked}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {/*
        The spam trap. Hidden from people, so only a script fills it in. The
        name means nothing to autofill on purpose: it was once "website", and
        Chrome filled it with a real visitor's saved details, which threw their
        message away. The ignore attributes keep password managers out too.
      */}
      <input
        name="hp_extra"
        tabIndex={-1}
        autoComplete="off"
        data-lpignore="true"
        data-1p-ignore
        data-bwignore
        data-form-type="other"
        aria-hidden
        className="absolute -left-[9999px] h-px w-px opacity-0"
      />

      <label className="flex flex-col gap-2">
        <span className={labelClass}>{t.visit}</span>
        <select name="kind" required defaultValue="" className={fieldClass}>
          <option value="" disabled>
            {t.visitPlaceholder}
          </option>
          {APPOINTMENT_KINDS.map((option) => (
            <option key={option.kind} value={option.kind}>
              {t.kinds[option.kind]} · {option.minutes} {t.minutes}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className={labelClass}>{t.date}</span>
          {/*
            Bounds are computed in Lagos time on each render; a page served
            yesterday can disagree by a day, so the server checks again.
          */}
          <input
            name="date"
            type="date"
            required
            min={lagosDate(1)}
            max={lagosDate(BOOKING_WINDOW_DAYS)}
            suppressHydrationWarning
            className={`${fieldClass} [color-scheme:dark]`}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className={labelClass}>{t.time}</span>
          <select name="time" required defaultValue="" className={fieldClass}>
            <option value="" disabled>
              {t.timePlaceholder}
            </option>
            {APPOINTMENT_SLOTS.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </label>
      </div>

      <span className={`${labelClass} mt-4`}>{t.details}</span>

      <input
        name="fullName"
        required
        autoComplete="name"
        placeholder={t.fullName}
        className={fieldClass}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={t.email}
          className={fieldClass}
        />
        <input
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder={t.phone}
          className={fieldClass}
        />
      </div>

      <textarea
        name="notes"
        rows={4}
        maxLength={1000}
        placeholder={t.notes}
        className={`${fieldClass} h-auto py-3 leading-relaxed`}
      />

      {state.error && (
        <p role="alert" className="text-danger text-sm">
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
