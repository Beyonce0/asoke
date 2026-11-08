/**
 * Mirrors supabase/migrations/ — 0001_init.sql, plus every migration after it.
 *
 * Once the Supabase project exists, regenerate instead of editing by hand:
 *   npx supabase gen types typescript --project-id <ref> --schema public > src/types/database.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/**
 * Where an order is. One track, though only some of it applies to any given
 * order: a scarf off the shelf goes processing → ready → shipped, while a
 * commission spends weeks in the middle three.
 */
export type OrderStatus =
  | "pending"
  | "processing"
  | "cutting"
  | "fitting"
  | "finishing"
  | "ready"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

/** Which side of the garment a photograph shows. */
export type GarmentView = "front" | "back" | "detail";

/** What a signed-in person may do. Only SQL may hand out `admin`. */
export type AppRole = "customer" | "admin";

/** Whether a listing is a finished piece, cloth by the metre, or a commission. */
export type ProductType = "ready_to_wear" | "fabric" | "bespoke" | "custom";

/** Whether a message has been answered. */
export type EnquiryStatus = "new" | "replied" | "closed";

/** Whether an hour in the diary is asked for, promised, kept or dropped. */
export type AppointmentStatus =
  "requested" | "confirmed" | "completed" | "cancelled";

/** Where a commission enquiry has got to. The atelier's workflow, not an order's. */
export type BespokeStatus =
  | "new"
  | "reviewing"
  | "consultation"
  | "in_production"
  | "completed"
  | "cancelled";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          role: AppRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
        };
        /*
         * `role` is absent on purpose. `authenticated` holds column grants for
         * these three and nothing else, so an update naming `role` is refused
         * by Postgres — leaving it out of the type means that is caught while
         * writing the code rather than at runtime.
         */
        Update: {
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
        };
        Relationships: [];
      };
      order_events: {
        Row: {
          id: string;
          order_id: string;
          status: OrderStatus;
          note: string | null;
          created_at: string;
        };
        /* Written only by set_order_status(), never directly. */
        Insert: never;
        Update: never;
        Relationships: [
          {
            foreignKeyName: "order_events_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      site_settings: {
        Row: {
          /** Always true. The table holds one row by construction. */
          id: boolean;
          email: string | null;
          phone: string | null;
          whatsapp: string | null;
          address: string | null;
          opening_hours: string | null;
          instagram: string | null;
          hero_image: string | null;
          hero_video_mp4: string | null;
          hero_video_webm: string | null;
          craft_image: string | null;
          turnaround: string | null;
          updated_at: string;
        };
        /* No Insert type. The row is created by the migration and only ever
           updated — there is no second atelier to add. */
        Insert: never;
        Update: Partial<{
          email: string | null;
          phone: string | null;
          whatsapp: string | null;
          address: string | null;
          opening_hours: string | null;
          instagram: string | null;
          hero_image: string | null;
          hero_video_mp4: string | null;
          hero_video_webm: string | null;
          craft_image: string | null;
          turnaround: string | null;
        }>;
        Relationships: [];
      };
      enquiries: {
        Row: {
          id: string;
          user_id: string | null;
          full_name: string;
          email: string;
          phone: string | null;
          subject: string | null;
          message: string;
          status: EnquiryStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          full_name: string;
          email: string;
          phone?: string | null;
          subject?: string | null;
          message: string;
        };
        /* The atelier marks it answered; it does not rewrite what was asked. */
        Update: Partial<{ status: EnquiryStatus }>;
        Relationships: [];
      };
      enquiry_replies: {
        Row: {
          id: string;
          enquiry_id: string;
          subject: string;
          body: string;
          sent_by: string | null;
          sent_by_name: string | null;
          provider_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          enquiry_id: string;
          subject: string;
          body: string;
          sent_by?: string | null;
          sent_by_name?: string | null;
          provider_id?: string | null;
        };
        /* A sent reply is a record. It is never edited. */
        Update: Record<never, never>;
        Relationships: [];
      };
      appointments: {
        Row: {
          id: string;
          user_id: string | null;
          full_name: string;
          email: string;
          phone: string | null;
          kind: string;
          starts_at: string;
          duration_minutes: number;
          notes: string | null;
          status: AppointmentStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          full_name: string;
          email: string;
          phone?: string | null;
          kind: string;
          starts_at: string;
          duration_minutes?: number;
          notes?: string | null;
        };
        /* Confirm, move, or drop. Moving an appointment is changing its hour,
           which is why `starts_at` is writable here and nowhere else. */
        Update: Partial<{
          starts_at: string;
          duration_minutes: number;
          status: AppointmentStatus;
        }>;
        Relationships: [];
      };
      fabrics: {
        Row: {
          id: string;
          slug: string;
          name: string;
          origin: string | null;
          pattern: string | null;
          colours: string[];
          width_cm: number | null;
          /** Kobo per metre. */
          price_per_metre: number | null;
          /** Metres. Comes back from PostgREST as a string — `numeric` has more
           *  precision than a JS number, so the driver refuses to lose any. */
          metres_available: string;
          description: string | null;
          image: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          origin?: string | null;
          pattern?: string | null;
          colours?: string[];
          width_cm?: number | null;
          price_per_metre?: number | null;
          metres_available?: number | string;
          description?: string | null;
          image?: string | null;
          is_active?: boolean;
        };
        Update: Partial<{
          slug: string;
          name: string;
          origin: string | null;
          pattern: string | null;
          colours: string[];
          width_cm: number | null;
          price_per_metre: number | null;
          metres_available: number | string;
          description: string | null;
          image: string | null;
          is_active: boolean;
        }>;
        Relationships: [];
      };
      bespoke_requests: {
        Row: {
          id: string;
          user_id: string | null;
          full_name: string;
          email: string;
          phone: string | null;
          occasion: string | null;
          event_date: string | null;
          outfit: string | null;
          fabric_preference: string | null;
          /** Kobo. */
          budget_min: number | null;
          budget_max: number | null;
          message: string | null;
          /** Paths in the private bespoke-uploads bucket, not public URLs. */
          reference_images: string[];
          status: BespokeStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          full_name: string;
          email: string;
          phone?: string | null;
          occasion?: string | null;
          event_date?: string | null;
          outfit?: string | null;
          fabric_preference?: string | null;
          budget_min?: number | null;
          budget_max?: number | null;
          message?: string | null;
          reference_images?: string[];
        };
        /* Only `status` is writable, and only by an admin. Everything else is
           the client's own words — the atelier does not edit those. */
        Update: Partial<{
          status: BespokeStatus;
        }>;
        Relationships: [
          {
            foreignKeyName: "bespoke_requests_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      collections: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          hero_image: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          hero_image?: string | null;
          sort_order?: number;
        };
        Update: Partial<{
          slug: string;
          name: string;
          description: string | null;
          hero_image: string | null;
          sort_order: number;
        }>;
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          story: string | null;
          collection_id: string | null;
          base_price: number;
          currency: string;
          is_published: boolean;
          is_featured: boolean;
          /** Green-screen clip of the piece turning. Keyed at play time. */
          turn_video: string | null;
          product_type: ProductType;
          fabric_type: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          story?: string | null;
          collection_id?: string | null;
          base_price: number;
          currency?: string;
          is_published?: boolean;
          is_featured?: boolean;
          turn_video?: string | null;
          product_type?: ProductType;
          fabric_type?: string | null;
        };
        Update: Partial<{
          slug: string;
          name: string;
          description: string | null;
          story: string | null;
          collection_id: string | null;
          base_price: number;
          is_published: boolean;
          is_featured: boolean;
          turn_video: string | null;
          product_type: ProductType;
          fabric_type: string | null;
        }>;
        Relationships: [
          {
            foreignKeyName: "products_collection_id_fkey";
            columns: ["collection_id"];
            isOneToOne: false;
            referencedRelation: "collections";
            referencedColumns: ["id"];
          },
        ];
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          url: string;
          alt: string | null;
          sort_order: number;
          view: GarmentView;
        };
        Insert: {
          id?: string;
          product_id: string;
          url: string;
          alt?: string | null;
          sort_order?: number;
          view?: GarmentView;
        };
        Update: Partial<{
          url: string;
          alt: string | null;
          sort_order: number;
          view: GarmentView;
        }>;
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          sku: string;
          color: string | null;
          size: string | null;
          price_override: number | null;
          stock: number;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          product_id: string;
          sku: string;
          color?: string | null;
          size?: string | null;
          price_override?: number | null;
          stock?: number;
          is_active?: boolean;
        };
        Update: Partial<{
          sku: string;
          color: string | null;
          size: string | null;
          price_override: number | null;
          stock: number;
          is_active: boolean;
        }>;
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          phone: string;
          line1: string;
          line2: string | null;
          city: string;
          state: string;
          country: string;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name: string;
          phone: string;
          line1: string;
          line2?: string | null;
          city: string;
          state: string;
          country?: string;
          is_default?: boolean;
        };
        Update: Partial<{
          full_name: string;
          phone: string;
          line1: string;
          line2: string | null;
          city: string;
          state: string;
          country: string;
          is_default: boolean;
        }>;
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          reference: string;
          email: string;
          subtotal: number;
          shipping_fee: number;
          total: number;
          currency: string;
          status: OrderStatus;
          payment_status: PaymentStatus;
          paystack_reference: string | null;
          paid_at: string | null;
          shipping_address: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          reference: string;
          email: string;
          subtotal: number;
          shipping_fee?: number;
          total: number;
          currency?: string;
          status?: OrderStatus;
          payment_status?: PaymentStatus;
          paystack_reference?: string | null;
          paid_at?: string | null;
          shipping_address?: Json | null;
        };
        Update: Partial<{
          status: OrderStatus;
          payment_status: PaymentStatus;
          paystack_reference: string | null;
          paid_at: string | null;
          shipping_address: Json | null;
        }>;
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          variant_id: string | null;
          name_snapshot: string;
          variant_label: string | null;
          unit_price: number;
          quantity: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          variant_id?: string | null;
          name_snapshot: string;
          variant_label?: string | null;
          unit_price: number;
          quantity: number;
        };
        Update: Partial<{
          quantity: number;
        }>;
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_variant_id_fkey";
            columns: ["variant_id"];
            isOneToOne: false;
            referencedRelation: "product_variants";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<never, never>;
    Functions: {
      mark_order_paid: {
        Args: { p_reference: string; p_paid_at?: string };
        Returns: boolean;
      };
      mark_order_failed: {
        Args: { p_reference: string };
        Returns: boolean;
      };
      /**
       * Fulfilment only. Payment is never writable from the dashboard.
       * Appends to `order_events` as well as setting the current status.
       */
      set_order_status: {
        Args: {
          p_order_id: string;
          p_status: OrderStatus;
          p_note?: string | null;
        };
        Returns: undefined;
      };
    };
    Enums: {
      order_status: OrderStatus;
      payment_status: PaymentStatus;
      garment_view: GarmentView;
      app_role: AppRole;
      product_type: ProductType;
      bespoke_status: BespokeStatus;
      enquiry_status: EnquiryStatus;
      appointment_status: AppointmentStatus;
    };
    CompositeTypes: Record<never, never>;
  };
};
