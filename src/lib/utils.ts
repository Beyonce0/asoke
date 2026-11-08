import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Money is stored in kobo (the smallest NGN unit) everywhere — the database,
 * the cart and the Paystack API all agree on this. Only format at the edge.
 */
export function formatNaira(kobo: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(kobo / 100);
}

/**
 * How a variant names itself once it is in the bag — "Ìbílẹ̀ Gold · Medium".
 * Shared, because the cart line written by the product page and the one
 * written by a quick-add have to read identically or the same variant will
 * look like two different things in the drawer.
 */
export function variantLabel(color: string | null, size: string | null) {
  return [color, size].filter(Boolean).join(" · ") || "One size";
}

/**
 * Strips Yoruba diacritics so "Àṣọ Òkè" and "Aso Oke" reach the same slug.
 */
export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-̣ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
