import { MediaLibrary } from "@/components/admin/media-library";
import { isConfigured } from "@/lib/env";
import { getMediaAssets } from "@/lib/queries";

export const metadata = { title: "Media library" };

export default async function AdminMedia() {
  const assets = await getMediaAssets();

  return (
    <div className="px-5 py-10 md:px-12 md:py-12">
      <header>
        <h1 className="text-[clamp(1.4rem,5vw,2.2rem)]">Media library</h1>
        <p className="text-muted mt-2 max-w-xl text-sm">
          Everything the atelier has uploaded. Copy a URL to use a file on a
          product, a collection, or the front page.
        </p>
      </header>

      {isConfigured ? (
        <MediaLibrary assets={assets} />
      ) : (
        <p className="border-line text-muted mt-8 rounded-lg border border-dashed px-6 py-16 text-center text-sm">
          The library is the storage bucket itself, so it needs Supabase
          connected. Until then the site serves the images in{" "}
          <code className="text-gold">public/</code>.
        </p>
      )}
    </div>
  );
}
