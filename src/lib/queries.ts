import "server-only";

import { isConfigured } from "@/lib/env";
import {
  SAMPLE_APPOINTMENTS,
  SAMPLE_BESPOKE,
  SAMPLE_CARDS,
  SAMPLE_COLLECTIONS,
  SAMPLE_ENQUIRIES,
  SAMPLE_FABRICS,
  SAMPLE_ORDER_ITEMS,
  SAMPLE_ORDERS,
  SAMPLE_PRODUCTS,
} from "@/lib/sample-data";
import { createClient } from "@/lib/supabase/server";
import type {
  Appointment,
  BespokeRequest,
  Collection,
  Enquiry,
  EnquiryReply,
  Fabric,
  Order,
  OrderEvent,
  OrderItem,
  OrderWithItems,
  ProductType,
  ProductWithDetail,
  ProductWithVariants,
  SiteSettings,
} from "@/types";

/*
 * Every card is shoppable — name, price and a bag button — so every card query
 * brings the variants with it. There is no cart line without a variant, and a
 * card that shows a price the button cannot honour is worse than no button.
 *
 * It costs a second embedded table on list queries. At this catalogue's size
 * that is a few rows per product; if the shop ever grows past what a page can
 * sensibly render, paginate before trimming this.
 */
const CARD_SELECT = "*, product_images(url, alt), product_variants(*)";

/*
 * A card shows one photograph — `product_images[0]` — and a piece may now be
 * shot from more than one side. Embedded rows come back in no particular order
 * unless asked, so without this a card is free to lead with the back of the
 * garment.
 */
const FIRST_IMAGE_FIRST = {
  referencedTable: "product_images",
  ascending: true,
} as const;

/**
 * Until Supabase is configured these serve `sample-data.ts`, so the storefront
 * can be designed against realistic content. The moment real credentials are
 * present every function below switches to the database and the sample set is
 * never touched again.
 *
 * During an outage they fall back to empty rather than throwing — a catalogue
 * problem should not take the whole page down.
 */
function warn(scope: string, error: unknown) {
  /*
   * Unpacked by hand. A PostgrestError carries its useful parts on non-
   * enumerable-ish fields that `console.error` renders as `{}` — which is how
   * you end up staring at an empty object wondering which table is missing.
   */
  const fields = (error ?? {}) as Record<string, unknown>;

  const detail = ["code", "message", "hint", "details"]
    .map((key) => fields[key])
    .filter(
      (value): value is string => typeof value === "string" && value !== "",
    )
    .join(" · ");

  console.error(`[queries:${scope}] ${detail || String(error)}`);
}

export async function getCollections(): Promise<Collection[]> {
  if (!isConfigured) return SAMPLE_COLLECTIONS;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    warn("getCollections", error);
    return [];
  }

  return data;
}

export async function getFeaturedProducts(
  limit = 6,
): Promise<ProductWithVariants[]> {
  if (!isConfigured) {
    return SAMPLE_CARDS.filter((product) => product.is_featured).slice(
      0,
      limit,
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(CARD_SELECT)
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .order("sort_order", FIRST_IMAGE_FIRST)
    .limit(limit);

  if (error) {
    warn("getFeaturedProducts", error);
    return [];
  }

  return data as ProductWithVariants[];
}

/**
 * The drifting strip on the homepage.
 *
 * Newest first: publishing a piece is how the shop puts it on the front page.
 */
export async function getShowcaseProducts(
  limit = 5,
): Promise<ProductWithVariants[]> {
  if (!isConfigured) return SAMPLE_PRODUCTS.slice(0, limit);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(CARD_SELECT)
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .order("sort_order", FIRST_IMAGE_FIRST)
    .limit(limit);

  if (error) {
    warn("getShowcaseProducts", error);
    return [];
  }

  return data as ProductWithVariants[];
}

export async function getProducts(
  collectionSlug?: string,
): Promise<ProductWithVariants[]> {
  if (!isConfigured) {
    if (!collectionSlug) return SAMPLE_CARDS;

    const collection = SAMPLE_COLLECTIONS.find(
      (item) => item.slug === collectionSlug,
    );

    return SAMPLE_CARDS.filter(
      (product) => product.collection_id === collection?.id,
    );
  }

  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select(
      collectionSlug ? `${CARD_SELECT}, collections!inner(slug)` : CARD_SELECT,
    )
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .order("sort_order", FIRST_IMAGE_FIRST);

  if (collectionSlug) {
    query = query.eq("collections.slug", collectionSlug);
  }

  const { data, error } = await query;

  if (error) {
    warn("getProducts", error);
    return [];
  }

  return data as unknown as ProductWithVariants[];
}

/*
 * The catalogue as the atelier sees it: drafts included, newest first.
 *
 * A separate query from the storefront's on purpose. `getProducts()` is
 * allowed to hide things — unpublished rows, eventually out-of-season ones —
 * and the day it starts doing more of that, the admin list must not quietly
 * inherit it. RLS is what actually admits the drafts; this only asks for them.
 */
export async function getAdminProducts(): Promise<ProductWithDetail[]> {
  if (!isConfigured) return SAMPLE_PRODUCTS;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*), product_variants(*), collections(*)")
    .order("created_at", { ascending: false })
    .order("sort_order", FIRST_IMAGE_FIRST);

  if (error) {
    warn("getAdminProducts", error);
    return [];
  }

  return data as ProductWithDetail[];
}

/** One product for the edit form, draft or not. */
export async function getAdminProduct(
  id: string,
): Promise<ProductWithDetail | null> {
  if (!isConfigured) {
    return SAMPLE_PRODUCTS.find((product) => product.id === id) ?? null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*), product_variants(*), collections(*)")
    .eq("id", id)
    .order("sort_order", FIRST_IMAGE_FIRST)
    .maybeSingle();

  if (error) {
    warn("getAdminProduct", error);
    return null;
  }

  return data as ProductWithDetail | null;
}

/** One collection for the edit form. */
export async function getCollection(id: string): Promise<Collection | null> {
  if (!isConfigured) {
    return (
      SAMPLE_COLLECTIONS.find((collection) => collection.id === id) ?? null
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    warn("getCollection", error);
    return null;
  }

  return data;
}

/*
 * Cloth. The admin sees inactive bolts too — a fabric that is out of stock is
 * not a fabric the atelier has stopped weaving, and hiding it from the shelf
 * is not the same as hiding it from the person who orders more.
 */
export async function getFabrics(adminView = false): Promise<Fabric[]> {
  if (!isConfigured) {
    return adminView
      ? SAMPLE_FABRICS
      : SAMPLE_FABRICS.filter((fabric) => fabric.is_active);
  }

  const supabase = await createClient();
  let query = supabase.from("fabrics").select("*").order("name");

  if (!adminView) query = query.eq("is_active", true);

  const { data, error } = await query;

  if (error) {
    warn("getFabrics", error);
    return [];
  }

  return data;
}

export async function getFabric(id: string): Promise<Fabric | null> {
  if (!isConfigured) {
    return SAMPLE_FABRICS.find((fabric) => fabric.id === id) ?? null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fabrics")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    warn("getFabric", error);
    return null;
  }

  return data;
}

/*
 * Commission enquiries, newest first. RLS is what limits this to the atelier —
 * the query asks for everything and Postgres decides what everything means for
 * whoever is asking.
 */
export async function getBespokeRequests(): Promise<BespokeRequest[]> {
  if (!isConfigured) return SAMPLE_BESPOKE;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bespoke_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    warn("getBespokeRequests", error);
    return [];
  }

  return data;
}

export async function getBespokeRequest(
  id: string,
): Promise<BespokeRequest | null> {
  if (!isConfigured) {
    return SAMPLE_BESPOKE.find((request) => request.id === id) ?? null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bespoke_requests")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    warn("getBespokeRequest", error);
    return null;
  }

  return data;
}

/*
 * The house's own details.
 *
 * Never null: an unconfigured project, an outage or an untouched settings row
 * all return the same empty shape, and every component reading it falls back
 * to what ships in the build. A site whose hero disappears because a settings
 * query failed is worse than one that cannot be edited.
 */
const EMPTY_SETTINGS: SiteSettings = {
  id: true,
  email: null,
  phone: null,
  whatsapp: null,
  address: null,
  opening_hours: null,
  instagram: null,
  hero_image: null,
  hero_video_mp4: null,
  hero_video_webm: null,
  craft_image: null,
  turnaround: null,
  updated_at: "1970-01-01T00:00:00.000Z",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isConfigured) return EMPTY_SETTINGS;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .maybeSingle();

  if (error) {
    warn("getSiteSettings", error);
    return EMPTY_SETTINGS;
  }

  return data ?? EMPTY_SETTINGS;
}

/** A file in the media bucket, as the library shows it. */
export type MediaAsset = {
  name: string;
  url: string;
  size: number;
};

/*
 * Everything in the product-media bucket.
 *
 * Listed on the server with the admin's own session, so the library arrives
 * with the page instead of appearing a moment later — and so the client
 * component holds no fetch-on-mount effect at all.
 */
export async function getMediaAssets(limit = 100): Promise<MediaAsset[]> {
  if (!isConfigured) return [];

  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from("product-media")
    .list("", { limit, sortBy: { column: "created_at", order: "desc" } });

  if (error) {
    warn("getMediaAssets", error);
    return [];
  }

  return (
    (data ?? [])
      // Supabase returns a placeholder row for the folder itself.
      .filter((file) => file.id !== null)
      .map((file) => ({
        name: file.name,
        url: supabase.storage.from("product-media").getPublicUrl(file.name).data
          .publicUrl,
        size: (file.metadata?.size as number) ?? 0,
      }))
  );
}

/** The inbox, newest first. */
export async function getEnquiries(): Promise<Enquiry[]> {
  if (!isConfigured) return SAMPLE_ENQUIRIES;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    warn("getEnquiries", error);
    return [];
  }

  return data;
}

export async function getEnquiry(id: string): Promise<Enquiry | null> {
  if (!isConfigured) {
    return SAMPLE_ENQUIRIES.find((enquiry) => enquiry.id === id) ?? null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("enquiries")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    warn("getEnquiry", error);
    return null;
  }

  return data;
}

/*
 * What the atelier has written back, oldest first so it reads as a thread.
 * Sample mode has no outbox, so there is nothing to show.
 */
export async function getEnquiryReplies(
  enquiryId: string,
): Promise<EnquiryReply[]> {
  if (!isConfigured) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("enquiry_replies")
    .select("*")
    .eq("enquiry_id", enquiryId)
    .order("created_at", { ascending: true });

  if (error) {
    warn("getEnquiryReplies", error);
    return [];
  }

  return data;
}

/*
 * The diary, in time order — forwards, unlike every other list in the admin.
 * A booking's whole value is what happens next, so the soonest is the top of
 * the page and the past falls off the bottom.
 */
export async function getAppointments(): Promise<Appointment[]> {
  if (!isConfigured) return SAMPLE_APPOINTMENTS;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .order("starts_at", { ascending: true });

  if (error) {
    warn("getAppointments", error);
    return [];
  }

  return data;
}

/** Every order, newest first. RLS is what makes this an admin-only view. */
export async function getAdminOrders(): Promise<Order[]> {
  if (!isConfigured) return SAMPLE_ORDERS;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    warn("getAdminOrders", error);
    return [];
  }

  return data;
}

/**
 * One order: its lines, its history, and whether anything in it is made to
 * order — which decides whether the atelier's own stages are offered.
 */
export async function getAdminOrder(id: string): Promise<
  | (OrderWithItems & {
      order_events: OrderEvent[];
      isBespoke: boolean;
    })
  | null
> {
  if (!isConfigured) {
    const order = SAMPLE_ORDERS.find((sample) => sample.id === id);
    if (!order) return null;

    return {
      ...order,
      order_items: SAMPLE_ORDER_ITEMS.filter((item) => item.order_id === id),
      order_events: [],
      isBespoke: false,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    /*
     * `products(product_type)` rides along on each line so the page knows
     * whether to offer cutting and fitting. A deleted product leaves null
     * there, which reads as "not bespoke" — the safe way round, since the
     * worst case is a stage that is not offered rather than one offered
     * wrongly.
     */
    .select("*, order_items(*, products(product_type)), order_events(*)")
    .eq("id", id)
    .order("created_at", { referencedTable: "order_events", ascending: true })
    .maybeSingle();

  if (error) {
    warn("getAdminOrder", error);
    return null;
  }

  if (!data) return null;

  const items = data.order_items as (OrderItem & {
    products: { product_type: ProductType } | null;
  })[];

  return {
    ...(data as unknown as OrderWithItems),
    order_events: (data.order_events ?? []) as OrderEvent[],
    isBespoke: items.some(
      (item) =>
        item.products?.product_type === "bespoke" ||
        item.products?.product_type === "custom",
    ),
  };
}

/** What the admin dashboard puts on screen. */
export type AdminOverview = {
  products: number;
  drafts: number;
  orders: number;
  /** Paid, not yet shipped — the only number that is a to-do list. */
  awaiting: number;
  /** Kobo, settled orders only. */
  paid: number;
  recent: Pick<
    Order,
    "id" | "reference" | "email" | "total" | "status" | "payment_status"
  >[];
};

/**
 * The dashboard, in one round trip's worth of queries.
 *
 * Every count is `head: true`, so Postgres returns the number without the rows
 * — a product count should not drag six product records across the wire.
 *
 * Unconfigured, it serves the sample catalogue and sample orders, the same way
 * the storefront does. The dashboard can then be designed against a populated
 * screen instead of five empty states.
 */
export async function getAdminOverview(): Promise<AdminOverview> {
  if (!isConfigured) {
    const paid = SAMPLE_ORDERS.filter(
      (order) => order.payment_status === "paid",
    );

    return {
      products: SAMPLE_PRODUCTS.length,
      drafts: SAMPLE_PRODUCTS.filter((product) => !product.is_published).length,
      orders: SAMPLE_ORDERS.length,
      awaiting: paid.filter((order) => order.status === "processing").length,
      paid: paid.reduce((sum, order) => sum + order.total, 0),
      recent: SAMPLE_ORDERS,
    };
  }

  const supabase = await createClient();

  const total = (
    result: PromiseLike<{ count: number | null }>,
  ): Promise<number> =>
    Promise.resolve(result).then((settled) => settled.count ?? 0);

  const [products, drafts, orders, awaiting, settled, recent] =
    await Promise.all([
      total(
        supabase.from("products").select("*", { count: "exact", head: true }),
      ),
      total(
        supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .eq("is_published", false),
      ),
      total(
        supabase.from("orders").select("*", { count: "exact", head: true }),
      ),
      total(
        supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .eq("payment_status", "paid")
          .eq("status", "processing"),
      ),
      /*
       * Summed here rather than in SQL. Correct, and cheap while the shop is
       * young — one integer per paid order. Move it behind a view or an RPC
       * the first time this page feels slow.
       */
      supabase
        .from("orders")
        .select("total")
        .eq("payment_status", "paid")
        .then(({ data }) =>
          (data ?? []).reduce((sum, order) => sum + order.total, 0),
        ),
      supabase
        .from("orders")
        .select("id, reference, email, total, status, payment_status")
        .order("created_at", { ascending: false })
        .limit(5)
        .then(({ data }) => data ?? []),
    ]);

  return { products, drafts, orders, awaiting, paid: settled, recent };
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductWithDetail | null> {
  if (!isConfigured) {
    return SAMPLE_PRODUCTS.find((product) => product.slug === slug) ?? null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*), product_variants(*), collections(*)")
    .eq("slug", slug)
    .eq("is_published", true)
    .order("sort_order", FIRST_IMAGE_FIRST)
    .maybeSingle();

  if (error) {
    warn("getProductBySlug", error);
    return null;
  }

  return data as ProductWithDetail | null;
}
