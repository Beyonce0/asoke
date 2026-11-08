"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { SingleImage } from "@/components/admin/single-image";
import { saveSettings, type SettingsInput } from "@/app/admin/settings/actions";
import type { SiteSettings } from "@/types";

/*
 * The house's details, in one form.
 *
 * The media fields take a URL rather than uploading in place, because the file
 * they want is usually one already in the library. Pictures get a picker
 * anyway — a hero image is chosen by looking at it — while the two video
 * fields stay plain text: a browser cannot preview a green-screen clip
 * usefully, and it is keyed at play time regardless.
 */

const field =
  "border-line bg-charcoal text-cream placeholder:text-muted/60 focus:border-gold/60 w-full rounded-md border px-3.5 py-2.5 text-sm outline-none transition-colors";
const label = "text-muted block text-[0.6rem] tracking-[0.24em] uppercase";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<SettingsInput>({
    email: settings.email ?? "",
    phone: settings.phone ?? "",
    whatsapp: settings.whatsapp ?? "",
    address: settings.address ?? "",
    openingHours: settings.opening_hours ?? "",
    instagram: settings.instagram ?? "",
    heroImage: settings.hero_image ?? "",
    heroVideoMp4: settings.hero_video_mp4 ?? "",
    heroVideoWebm: settings.hero_video_webm ?? "",
    craftImage: settings.craft_image ?? "",
    turnaround: settings.turnaround ?? "",
  });

  function set(key: keyof SettingsInput, value: string) {
    setSaved(false);
    setForm((current) => ({ ...current, [key]: value }));
  }

  function submit() {
    setError(null);

    startTransition(async () => {
      const result = await saveSettings(form);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setSaved(true);
      router.refresh();
    });
  }

  const text = (
    key: keyof SettingsInput,
    labelText: string,
    placeholder: string,
    hint?: string,
  ) => (
    <div>
      <label className={label} htmlFor={key}>
        {labelText}
      </label>
      <input
        id={key}
        value={(form[key] as string) ?? ""}
        onChange={(event) => set(key, event.target.value)}
        placeholder={placeholder}
        className={`${field} mt-2`}
      />
      {hint && <p className="text-muted mt-2 text-xs">{hint}</p>}
    </div>
  );

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="max-w-3xl space-y-12"
    >
      <section>
        <h2 className="text-gold text-[0.6rem] tracking-[0.28em] uppercase">
          How to reach the atelier
        </h2>
        <p className="text-muted mt-2 text-xs">
          Shown in the footer of every page. Anything left blank is left out.
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {text("email", "Email", "hello@asoke.ng")}
          {text("phone", "Phone", "+234 800 000 0000")}
          {text("whatsapp", "WhatsApp", "+234 800 000 0000")}
          {text("instagram", "Instagram", "@asoke")}
          {text("address", "Address", "12 Awolowo Road, Ikoyi, Lagos")}
          {text(
            "openingHours",
            "Opening hours",
            "Mon–Fri, 10am–6pm · Saturday by appointment",
          )}
        </div>
      </section>

      <section>
        <h2 className="text-gold text-[0.6rem] tracking-[0.28em] uppercase">
          The front page
        </h2>
        <p className="text-muted mt-2 text-xs">
          Leave any of these empty and the site uses what it shipped with.
          Clearing a field is how you revert.
        </p>

        <div className="mt-6 flex flex-wrap gap-8">
          <SingleImage
            value={(form.heroImage as string) || null}
            onChange={(url) => set("heroImage", url ?? "")}
            ratio="aspect-[3/2]"
            label="Hero photograph"
          />
          <SingleImage
            value={(form.craftImage as string) || null}
            onChange={(url) => set("craftImage", url ?? "")}
            ratio="aspect-[2/3]"
            label="The craft photograph"
          />
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {text(
            "heroVideoMp4",
            "Hero film (MP4)",
            "https://…/model.mp4",
            "Must be shot on the atelier green screen. It is keyed as it plays.",
          )}
          {text(
            "heroVideoWebm",
            "Hero film (WebM)",
            "https://…/model.webm",
            "Optional. Smaller file, used where the browser supports it.",
          )}
        </div>
      </section>

      <section>
        <h2 className="text-gold text-[0.6rem] tracking-[0.28em] uppercase">
          What is promised
        </h2>

        <div className="mt-6 max-w-sm">
          {text(
            "turnaround",
            "Typical turnaround",
            "7–14 working days",
            "Shown on the atelier timeline. The one number a customer will hold you to.",
          )}
        </div>
      </section>

      {error && (
        <p className="border-danger/40 bg-danger/10 text-danger rounded-md border px-4 py-3 text-sm">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          disabled={pending}
          onClick={submit}
          className="bg-gold text-charcoal hover:bg-gold-light h-11 w-full rounded-md px-7 text-xs font-medium tracking-[0.18em] uppercase transition-colors disabled:opacity-50 sm:w-auto"
        >
          {pending ? "Saving…" : "Save settings"}
        </button>

        {saved && !pending && (
          <p className="text-success text-xs">Saved. The site is updated.</p>
        )}
      </div>
    </form>
  );
}
