"use client";

import { Eye, EyeOff } from "lucide-react";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/client";
import type { AuthState } from "@/app/(auth)/actions";

const fieldClass =
  "border-line bg-transparent focus:border-cream h-12 w-full border px-4 text-sm outline-none transition-colors";

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  const { t } = useI18n();

  return (
    <Button type="submit" size="lg" disabled={pending} className="mt-2 w-full">
      {pending ? t.auth.wait : label}
    </Button>
  );
}

/*
 * Edge draws its own reveal eye inside password fields; it is hidden so ours is
 * the only one.
 */
function PasswordField({ isNew }: { isNew: boolean }) {
  const [visible, setVisible] = useState(false);
  const { t } = useI18n();
  const Icon = visible ? EyeOff : Eye;

  return (
    <div className="relative">
      <input
        name="password"
        type={visible ? "text" : "password"}
        required
        minLength={8}
        autoComplete={isNew ? "new-password" : "current-password"}
        placeholder={t.auth.password}
        className={`${fieldClass} pr-12 [&::-ms-reveal]:hidden`}
      />

      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        aria-label={visible ? t.auth.hidePassword : t.auth.showPassword}
        aria-pressed={visible}
        className="text-muted hover:text-cream focus-visible:text-cream absolute inset-y-0 right-0 flex w-12 items-center justify-center transition-colors outline-none"
      >
        <Icon className="size-4" strokeWidth={1.5} aria-hidden />
      </button>
    </div>
  );
}

/** Shared shell for sign-in and sign-up — same fields, different action. */
export function AuthForm({
  action,
  submitLabel,
  withName = false,
  next,
}: {
  action: (state: AuthState, formData: FormData) => Promise<AuthState>;
  submitLabel: string;
  withName?: boolean;
  next?: string;
}) {
  const [state, formAction] = useActionState<AuthState, FormData>(action, {});
  const { t } = useI18n();

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {next && <input type="hidden" name="next" value={next} />}

      {withName && (
        <input
          name="fullName"
          autoComplete="name"
          placeholder={t.auth.fullName}
          className={fieldClass}
        />
      )}

      <input
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder={t.auth.email}
        className={fieldClass}
      />

      <PasswordField isNew={withName} />

      {state.error && (
        <p role="alert" className="text-danger text-sm">
          {state.error}
        </p>
      )}

      {state.notice && (
        <p role="status" className="text-success text-sm">
          {state.notice}
        </p>
      )}

      <Submit label={submitLabel} />
    </form>
  );
}
