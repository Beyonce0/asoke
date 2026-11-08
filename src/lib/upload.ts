import { createClient } from "@/lib/supabase/client";
import { isConfigured } from "@/lib/env";

/*
 * Browser → Supabase Storage, in one place.
 *
 * The file never passes through this app's server: it goes straight to the
 * bucket with the admin's own session, and only the resulting URL is submitted
 * with the form. A 6MB photograph would not fit through a server action, and
 * routing it through one would mean paying for the same bytes twice.
 *
 * Storage policies decide whether the upload is allowed. If the caller is not
 * an admin the request is refused there, not here.
 */

export const PRODUCT_MEDIA = "product-media";

/** Above this the browser is being asked to hold a whole camera file in memory. */
const MAX_BYTES = 8 * 1024 * 1024;

export type UploadResult = { url: string } | { error: string };

export async function uploadImage(
  file: File,
  bucket: string = PRODUCT_MEDIA,
): Promise<UploadResult> {
  if (!isConfigured) {
    return {
      error: "Uploads need Supabase connected. There is nowhere to put it yet.",
    };
  }

  if (file.size > MAX_BYTES) {
    return { error: `${file.name} is over 8MB. Export it smaller.` };
  }

  /*
   * Random name, original extension. Two photographs called IMG_0421.jpg from
   * two different shoots must not overwrite one another, and a public URL
   * should not carry the file name off someone's camera.
   */
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${crypto.randomUUID()}.${extension}`;

  const supabase = createClient();

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { cacheControl: "31536000", upsert: false });

  if (error) return { error: error.message };

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path);

  return { url: publicUrl };
}
