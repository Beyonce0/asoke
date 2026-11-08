"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { sendEnquiry, type EnquiryState } from "@/app/(shop)/contact/actions";
import { useI18n } from "@/i18n/client";

const fieldClass =
  "border-line bg-transparent focus:border-cream h-12 w-full border px-4 text-sm outline-none transition-colors";

function SubmitButton() {
  const { pending } = useFormStatus();
  const { t } = useI18n();

  return (
    <Button type="submit" size="lg" disabled={pending} className="mt-2 w-full">
      {pending ? t.enquiry.sending : t.enquiry.submit}
    </Button>
  );
}

export function EnquiryForm() {
  const [state, formAction] = useActionState<EnquiryState, FormData>(
    sendEnquiry,
    {},
  );
  const t = useI18n().t.enquiry;

  if (state.sent) {
    return (
      <div role="status" className="flex flex-col items-start gap-5 py-6">
        <span className="border-gold/40 text-gold grid h-11 w-11 place-items-center rounded-full border">
          <Check size={18} strokeWidth={1.5} aria-hidden />
        </span>
        <h3 className="text-2xl">{t.thanksTitle}</h3>
        <p className="text-cream-soft text-sm leading-relaxed">{state.sent}</p>
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

      <div className="grid gap-4 sm:grid-cols-2">
        <input
          name="fullName"
          required
          autoComplete="name"
          placeholder={t.fullName}
          aria-label={t.fullName}
          className={fieldClass}
        />
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={t.email}
          aria-label={t.email}
          className={fieldClass}
        />
        <input
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder={t.phone}
          aria-label={t.phone}
          className={fieldClass}
        />
        <input
          name="subject"
          maxLength={160}
          placeholder={t.subject}
          aria-label={t.subject}
          className={fieldClass}
        />
      </div>

      <textarea
        name="message"
        required
        rows={5}
        minLength={10}
        maxLength={4000}
        placeholder={t.message}
        aria-label={t.message}
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
