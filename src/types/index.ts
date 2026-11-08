import type { Database } from "@/types/database";

export type Tables = Database["public"]["Tables"];

export type Product = Tables["products"]["Row"];
export type ProductVariant = Tables["product_variants"]["Row"];
export type ProductImage = Tables["product_images"]["Row"];
export type Collection = Tables["collections"]["Row"];
export type Fabric = Tables["fabrics"]["Row"];
export type BespokeRequest = Tables["bespoke_requests"]["Row"];
export type SiteSettings = Tables["site_settings"]["Row"];
export type Enquiry = Tables["enquiries"]["Row"];
export type EnquiryReply = Tables["enquiry_replies"]["Row"];
export type Appointment = Tables["appointments"]["Row"];
export type Order = Tables["orders"]["Row"];
export type OrderItem = Tables["order_items"]["Row"];
export type OrderEvent = Tables["order_events"]["Row"];
export type Address = Tables["addresses"]["Row"];
export type Profile = Tables["profiles"]["Row"];

export type OrderStatus = Database["public"]["Enums"]["order_status"];
export type PaymentStatus = Database["public"]["Enums"]["payment_status"];
export type GarmentView = Database["public"]["Enums"]["garment_view"];
export type AppRole = Database["public"]["Enums"]["app_role"];
export type ProductType = Database["public"]["Enums"]["product_type"];
export type BespokeStatus = Database["public"]["Enums"]["bespoke_status"];
export type EnquiryStatus = Database["public"]["Enums"]["enquiry_status"];
export type AppointmentStatus =
  Database["public"]["Enums"]["appointment_status"];

/** An order with the lines it was made of — what the detail page needs. */
export type OrderWithItems = Order & { order_items: OrderItem[] };

/** A product with everything the product detail page needs, in one query. */
export type ProductWithDetail = Product & {
  product_images: ProductImage[];
  product_variants: ProductVariant[];
  collections: Collection | null;
};

/** A product as it appears in a grid — first image only. */
export type ProductCard = Product & {
  product_images: Pick<ProductImage, "url" | "alt">[];
};

/**
 * A card that can go straight into the bag. The variants are the whole point:
 * a cart line is keyed by variant, so nothing can be added without them.
 */
export type ProductWithVariants = ProductCard & {
  product_variants: ProductVariant[];
};

export type CartLine = {
  productId: string;
  variantId: string;
  slug: string;
  name: string;
  /** e.g. "Ìbílẹ̀ Gold / Medium" */
  variantLabel: string;
  /** Kobo, captured at add-to-cart time. Re-priced server side at checkout. */
  unitPrice: number;
  quantity: number;
  image: string | null;
};
