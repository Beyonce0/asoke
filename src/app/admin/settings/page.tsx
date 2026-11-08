import { SettingsForm } from "@/components/admin/settings-form";
import { getSiteSettings } from "@/lib/queries";

export const metadata = { title: "Settings" };

export default async function AdminSettings() {
  const settings = await getSiteSettings();

  return (
    <div className="px-5 py-10 md:px-12 md:py-12">
      <header className="mb-10">
        <h1 className="text-[clamp(1.4rem,5vw,2.2rem)]">Settings</h1>
        <p className="text-muted mt-2 text-sm">
          The details that used to live inside the code.
        </p>
      </header>

      <SettingsForm settings={settings} />
    </div>
  );
}
