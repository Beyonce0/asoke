import type {
  Appointment,
  BespokeRequest,
  Enquiry,
  OrderItem,
  Collection,
  Fabric,
  Order,
  ProductWithDetail,
  ProductWithVariants,
} from "@/types";

/**
 * Design-time catalogue.
 *
 * Used only while `NEXT_PUBLIC_SUPABASE_URL` is unset, so the storefront can
 * be designed against realistic content before the database exists. The shapes
 * match the real tables exactly — when Supabase is connected this file stops
 * being read and nothing else has to change.
 *
 * Delete it once real products are in the database.
 */

const now = "2026-01-01T00:00:00.000Z";

/*
 * The atelier photographs, in `public/images/looks`. They are numbered rather
 * than named because the assignment below was made from a colour read of each
 * frame's centre, not from looking at them — so treat the pairings as a first
 * pass and swap the numbers around freely if a piece is wearing the wrong shot.
 *
 * The one known mismatch: nothing in the set reads blue, so the Elú Indigo
 * skirt is currently carrying a warm frame.
 */
const LOOK = (n: number) =>
  `/images/looks/look-${String(n).padStart(2, "0")}.jpg`;

export const SAMPLE_COLLECTIONS: Collection[] = [
  {
    id: "c0000000-0000-4000-8000-000000000001",
    slug: "scarves",
    name: "Scarves",
    description: "Single strips, finished by hand. The easiest way to wear it.",
    hero_image: LOOK(3),
    sort_order: 1,
    created_at: now,
  },
  {
    id: "c0000000-0000-4000-8000-000000000002",
    slug: "ready-to-wear",
    name: "Ready to wear",
    description: "Strips joined into pieces cut for the way she lives now.",
    hero_image: LOOK(7),
    sort_order: 2,
    created_at: now,
  },
  {
    id: "c0000000-0000-4000-8000-000000000003",
    slug: "bridal",
    name: "Bridal",
    description: "Woven to order, for the day everything is measured against.",
    hero_image: LOOK(4),
    sort_order: 3,
    created_at: now,
  },
];

type Seed = {
  id: string;
  slug: string;
  name: string;
  price: number;
  collection: string;
  featured: boolean;
  image: string;
  /*
   * The back of the piece, where it has been shot. Only two of these are real
   * — the set has eight frames and six of them are already spoken for as
   * fronts — so the rest of the catalogue deliberately shows a single view,
   * which is the state most real products will be in until they are reshot.
   */
  back?: string;
  /*
   * A clip of the piece turning. There is one film in the repository, of one
   * model in one outfit, so it stands in wherever it is used — it is here to
   * prove the path from a database column to a keyed video on the page, not to
   * show these particular garments.
   */
  turn?: string;
  description: string;
  story: string;
  variants: { color: string; size: string; stock: number; bump?: number }[];
};

const SEEDS: Seed[] = [
  {
    id: "70000000-0000-4000-8000-000000000001",
    slug: "ibile-gold-scarf",
    name: "Ìbílẹ̀ Gold Scarf",
    price: 45_000_00,
    collection: "scarves",
    featured: true,
    image: "/images/looks/look-05.jpg",
    back: "/images/looks/look-03.jpg",
    turn: "/videos/model.mp4",
    description:
      "A single narrow-loom strip in warm bronze, shot through with metallic weft. Long enough to wrap twice.",
    story:
      "Woven in Iseyin on a loom that has been in the same family for three generations. The gold thread is laid in by hand every fourth pass.",
    variants: [
      { color: "Ìbílẹ̀ Gold", size: "One size", stock: 12 },
      { color: "Ìbílẹ̀ Gold", size: "Extra long", stock: 3, bump: 8_000_00 },
    ],
  },
  {
    id: "70000000-0000-4000-8000-000000000002",
    slug: "elu-indigo-wrap-skirt",
    name: "Elú Indigo Wrap Skirt",
    price: 128_000_00,
    collection: "ready-to-wear",
    featured: true,
    image: "/images/looks/look-02.jpg",
    back: "/images/looks/look-07.jpg",
    turn: "/videos/model.mp4",
    description:
      "Six strips joined into a floor-length wrap. Deep indigo, undyed cotton selvedge left visible at the hem.",
    story:
      "The indigo is fermented in clay pits the old way, and the colour keeps deepening for months after the cloth leaves the dyer.",
    variants: [
      { color: "Elú Indigo", size: "S", stock: 4 },
      { color: "Elú Indigo", size: "M", stock: 6 },
      { color: "Elú Indigo", size: "L", stock: 2 },
    ],
  },
  {
    id: "70000000-0000-4000-8000-000000000003",
    slug: "etu-ash-jacket",
    name: "Etù Ash Jacket",
    price: 195_000_00,
    collection: "ready-to-wear",
    featured: true,
    image: "/images/looks/look-08.jpg",
    description:
      "A collarless jacket in etù, the dark guinea-fowl cloth. Lined in cotton, unstructured through the shoulder.",
    story:
      "Etù was once worn only by titled men. We cut it for a woman's shoulder and left the weave exactly as it came off the loom.",
    variants: [
      { color: "Etù Ash", size: "S", stock: 2 },
      { color: "Etù Ash", size: "M", stock: 3 },
      { color: "Etù Ash", size: "L", stock: 0 },
    ],
  },
  {
    id: "70000000-0000-4000-8000-000000000004",
    slug: "sanyan-bronze-scarf",
    name: "Sányán Bronze Scarf",
    price: 52_000_00,
    collection: "scarves",
    featured: true,
    image: "/images/looks/look-06.jpg",
    description:
      "Sányán is spun from wild silk, which is why it holds this particular brown. Softens every time you wear it.",
    story:
      "The silk comes from the anaphe moth, gathered rather than farmed. A single scarf takes the yield of a whole season.",
    variants: [{ color: "Sányán Bronze", size: "One size", stock: 7 }],
  },
  {
    id: "70000000-0000-4000-8000-000000000005",
    slug: "alari-crimson-headwrap",
    name: "Àlàrì Crimson Gèlè",
    price: 38_000_00,
    collection: "scarves",
    featured: true,
    image: "/images/looks/look-01.jpg",
    description:
      "Stiff enough to hold a shape, soft enough to tie again tomorrow. Two metres, finished at both ends.",
    story:
      "Àlàrì takes its red from camwood. The colour was reserved for ceremony; we think a Tuesday counts.",
    variants: [{ color: "Àlàrì Crimson", size: "2m", stock: 15 }],
  },
  {
    id: "70000000-0000-4000-8000-000000000006",
    slug: "owu-cream-bridal-set",
    name: "Òwú Cream Bridal Set",
    price: 420_000_00,
    collection: "bridal",
    featured: true,
    image: "/images/looks/look-04.jpg",
    description:
      "Wrapper, blouse and gèlè in undyed cotton with a bronze eyelet border. Woven to your measurements.",
    story:
      "Òwú is cloth left the colour it grew. Eight weeks on the loom, and the eyelets are cut open one at a time with a blade.",
    variants: [{ color: "Òwú Cream", size: "Made to measure", stock: 2 }],
  },
];

/**
 * Real UUIDs, because these flow into the cart and through the same zod
 * validation the live checkout uses. Both indices are encoded so variants can
 * never collide across products.
 */
function variantId(productIndex: number, variantIndex: number) {
  const tail =
    String(productIndex + 1).padStart(6, "0") +
    String(variantIndex + 1).padStart(6, "0");

  return `80000000-0000-4000-8000-${tail}`;
}

function build(seed: Seed, productIndex: number): ProductWithDetail {
  const collection =
    SAMPLE_COLLECTIONS.find((c) => c.slug === seed.collection) ?? null;

  return {
    id: seed.id,
    slug: seed.slug,
    name: seed.name,
    description: seed.description,
    story: seed.story,
    collection_id: collection?.id ?? null,
    base_price: seed.price,
    currency: "NGN",
    is_published: true,
    is_featured: seed.featured,
    turn_video: seed.turn ?? null,
    product_type: "ready_to_wear",
    fabric_type: "Aṣọ-òkè",
    created_at: now,
    updated_at: now,
    collections: collection,
    product_images: [
      {
        id: `${seed.id}-img-1`,
        product_id: seed.id,
        url: seed.image,
        alt: `${seed.name}, handwoven aso-oke, from the front`,
        sort_order: 0,
        view: "front" as const,
      },
      ...(seed.back
        ? [
            {
              id: `${seed.id}-img-2`,
              product_id: seed.id,
              url: seed.back,
              alt: `${seed.name}, handwoven aso-oke, from the back`,
              sort_order: 1,
              view: "back" as const,
            },
          ]
        : []),
    ],
    product_variants: seed.variants.map((variant, index) => ({
      id: variantId(productIndex, index),
      product_id: seed.id,
      sku: `${seed.slug}-${index + 1}`.toUpperCase(),
      color: variant.color,
      size: variant.size,
      price_override: variant.bump ? seed.price + variant.bump : null,
      stock: variant.stock,
      is_active: true,
    })),
  };
}

export const SAMPLE_PRODUCTS: ProductWithDetail[] = SEEDS.map(build);

if (process.env.NODE_ENV !== "production") {
  const ids = SAMPLE_PRODUCTS.flatMap((product) =>
    product.product_variants.map((variant) => variant.id),
  );

  if (new Set(ids).size !== ids.length) {
    throw new Error(
      "[sample-data] Duplicate variant id: cart keys would collide.",
    );
  }
}

/*
 * What a card query returns: the images trimmed to the two columns it selects,
 * and the variants kept whole — every card carries a bag button, and a bag
 * button cannot name a cart line without a variant.
 */
export const SAMPLE_CARDS: ProductWithVariants[] = SAMPLE_PRODUCTS.map(
  (product) => ({
    ...product,
    product_images: product.product_images.map(({ url, alt }) => ({
      url,
      alt,
    })),
  }),
);

/*
 * Three orders, so the dashboard can be designed against a populated table
 * rather than an empty state. Same rule as the catalogue above: served only
 * while Supabase is unset, and never mixed with real rows.
 *
 * One of each state that matters — money taken and waiting to ship, money
 * taken and gone, and one that never paid — because those are the three the
 * admin has to be able to tell apart at a glance.
 */
export const SAMPLE_ORDERS: Order[] = [
  {
    id: "a0000000-0000-4000-8000-000000000001",
    user_id: null,
    reference: "ASK-24081-4021",
    email: "amaka.o@example.com",
    subtotal: 180_000_00,
    shipping_fee: 5_000_00,
    total: 185_000_00,
    currency: "NGN",
    status: "processing",
    payment_status: "paid",
    paystack_reference: "ps_4021",
    paid_at: "2026-08-13T09:41:00.000Z",
    shipping_address: null,
    created_at: "2026-08-13T09:38:00.000Z",
    updated_at: "2026-08-13T09:41:00.000Z",
  },
  {
    id: "a0000000-0000-4000-8000-000000000002",
    user_id: null,
    reference: "ASK-24080-3987",
    email: "tolu.a@example.com",
    subtotal: 320_000_00,
    shipping_fee: 0,
    total: 320_000_00,
    currency: "NGN",
    status: "shipped",
    payment_status: "paid",
    paystack_reference: "ps_3987",
    paid_at: "2026-08-11T16:02:00.000Z",
    shipping_address: null,
    created_at: "2026-08-11T15:58:00.000Z",
    updated_at: "2026-08-12T08:15:00.000Z",
  },
  {
    id: "a0000000-0000-4000-8000-000000000003",
    user_id: null,
    reference: "ASK-24079-3910",
    email: "chioma.n@example.com",
    subtotal: 95_000_00,
    shipping_fee: 5_000_00,
    total: 100_000_00,
    currency: "NGN",
    status: "pending",
    payment_status: "pending",
    paystack_reference: null,
    paid_at: null,
    shipping_address: null,
    created_at: "2026-08-10T11:20:00.000Z",
    updated_at: "2026-08-10T11:20:00.000Z",
  },
];

/*
 * Cloth on the shelf. Metres come back from PostgREST as strings — `numeric`
 * carries more precision than a JS number — so the stand-ins are strings too,
 * or the admin would be designed against a shape the database never sends.
 */
export const SAMPLE_FABRICS: Fabric[] = [
  {
    id: "f0000000-0000-4000-8000-000000000001",
    slug: "ibile-gold",
    name: "Ìbílẹ̀ Gold",
    origin: "Iseyin",
    pattern: "Warp stripe, metallic weft",
    colours: ["Bronze", "Gold"],
    width_cm: 25,
    price_per_metre: 18_000_00,
    metres_available: "18.50",
    description:
      "Narrow-loom aṣọ-òkè with the gold laid in by hand every fourth pass. Stiff off the loom, softens with wear.",
    image: "/images/looks/look-05.jpg",
    is_active: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "f0000000-0000-4000-8000-000000000002",
    slug: "elu-indigo",
    name: "Elú Indigo",
    origin: "Abẹ́òkúta",
    pattern: "Solid, undyed selvedge",
    colours: ["Indigo", "Ecru"],
    width_cm: 22,
    price_per_metre: 14_500_00,
    metres_available: "42.00",
    description:
      "Fermented in clay pits the old way. The colour keeps deepening for months after it leaves the dyer.",
    image: "/images/looks/look-02.jpg",
    is_active: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "f0000000-0000-4000-8000-000000000003",
    slug: "sanyan-wild-silk",
    name: "Sányán",
    origin: "Ilorin",
    pattern: "Plain weave",
    colours: ["Bronze", "Fawn"],
    width_cm: 20,
    price_per_metre: 26_000_00,
    metres_available: "6.25",
    description:
      "Spun from anaphe moth silk, gathered rather than farmed. A season's yield makes a single scarf.",
    image: "/images/looks/look-06.jpg",
    is_active: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "f0000000-0000-4000-8000-000000000004",
    slug: "alari-crimson",
    name: "Àlàrì",
    origin: "Iseyin",
    pattern: "Warp stripe",
    colours: ["Crimson", "Oxblood"],
    width_cm: 25,
    price_per_metre: 16_000_00,
    metres_available: "0.00",
    description:
      "Camwood red, the colour once reserved for ceremony. Currently off the loom. Next bolt in three weeks.",
    image: "/images/looks/look-01.jpg",
    is_active: true,
    created_at: now,
    updated_at: now,
  },
];

/*
 * Commissions in flight. One at each end of the track and two in the middle,
 * so the dashboard can be designed against a queue rather than an empty page.
 */
export const SAMPLE_BESPOKE: BespokeRequest[] = [
  {
    id: "b0000000-0000-4000-8000-000000000001",
    user_id: null,
    full_name: "Amara Nwosu",
    email: "amara.n@example.com",
    phone: "+234 802 555 0142",
    occasion: "Traditional wedding",
    event_date: "2026-12-14",
    outfit: "Two-piece aṣọ-òkè ensemble with gèlè",
    fabric_preference: "Àlàrì crimson, or something close to it",
    budget_min: 300_000_00,
    budget_max: 500_000_00,
    message:
      "I would like something inspired by my mother's wedding cloth. She still has the gèlè and I can send photographs of it. The ceremony is in Abẹ́òkúta.",
    reference_images: [],
    status: "new",
    created_at: "2026-08-14T14:22:00.000Z",
    updated_at: "2026-08-14T14:22:00.000Z",
  },
  {
    id: "b0000000-0000-4000-8000-000000000002",
    user_id: null,
    full_name: "Tolu Adeyemi",
    email: "tolu.a@example.com",
    phone: "+234 703 555 0198",
    occasion: "Engagement",
    event_date: "2026-10-03",
    outfit: "Wrap skirt and structured top",
    fabric_preference: "Elú indigo",
    budget_min: 180_000_00,
    budget_max: 250_000_00,
    message:
      "Something I can wear again afterwards, not only on the day. I am a size 12 but would rather be measured.",
    reference_images: [],
    status: "consultation",
    created_at: "2026-08-09T09:10:00.000Z",
    updated_at: "2026-08-12T11:45:00.000Z",
  },
  {
    id: "b0000000-0000-4000-8000-000000000003",
    user_id: null,
    full_name: "Chioma Nnadi",
    email: "chioma.n@example.com",
    phone: null,
    occasion: "Birthday",
    event_date: "2026-09-20",
    outfit: "Full-length gown",
    fabric_preference: "Undecided, open to suggestions",
    budget_min: 220_000_00,
    budget_max: 400_000_00,
    message: "Turning forty and want something with weight to it.",
    reference_images: [],
    status: "in_production",
    created_at: "2026-07-28T16:05:00.000Z",
    updated_at: "2026-08-06T08:30:00.000Z",
  },
];

/*
 * The inbox. One of each state, so "answered" and "waiting" can be told apart
 * at a glance while the screen is being designed.
 */
export const SAMPLE_ENQUIRIES: Enquiry[] = [
  {
    id: "e0000000-0000-4000-8000-000000000001",
    user_id: null,
    full_name: "Chiamaka Obi",
    email: "chiamaka.o@example.com",
    phone: "+234 806 555 0117",
    subject: "Bespoke outfit for a december wedding",
    message:
      "Good afternoon. I saw the Òwú bridal set on your site and would like something similar but in a deeper cream, for a wedding on the 19th of December. Is that enough time?",
    status: "new",
    created_at: "2026-08-15T08:04:00.000Z",
    updated_at: "2026-08-15T08:04:00.000Z",
  },
  {
    id: "e0000000-0000-4000-8000-000000000002",
    user_id: null,
    full_name: "David Okonkwo",
    email: "david.o@example.com",
    phone: null,
    subject: "Aṣọ-òkè availability",
    message:
      "Do you sell the Ìbílẹ̀ Gold by the metre? I need roughly 12 metres and I am in Abuja.",
    status: "new",
    created_at: "2026-08-15T06:40:00.000Z",
    updated_at: "2026-08-15T06:40:00.000Z",
  },
  {
    id: "e0000000-0000-4000-8000-000000000003",
    user_id: null,
    full_name: "Amaka Eze",
    email: "amaka.e@example.com",
    phone: "+234 701 555 0164",
    subject: "Moving my appointment",
    message:
      "Something has come up on Thursday morning. Could we do the afternoon instead, or Friday?",
    status: "replied",
    created_at: "2026-08-13T15:12:00.000Z",
    updated_at: "2026-08-13T17:30:00.000Z",
  },
];

/*
 * The diary. Two on the same day and one further out, which is the shape a
 * real week takes and the reason the list groups by date rather than listing
 * flat.
 */
export const SAMPLE_APPOINTMENTS: Appointment[] = [
  {
    id: "d0000000-0000-4000-8000-000000000001",
    user_id: null,
    full_name: "Amaka Eze",
    email: "amaka.e@example.com",
    phone: "+234 701 555 0164",
    kind: "Bespoke consultation",
    starts_at: "2026-08-20T09:00:00.000Z",
    duration_minutes: 60,
    notes: "Bringing her mother's gèlè to match the weave against.",
    status: "requested",
    created_at: "2026-08-14T10:02:00.000Z",
    updated_at: "2026-08-14T10:02:00.000Z",
  },
  {
    id: "d0000000-0000-4000-8000-000000000002",
    user_id: null,
    full_name: "Chioma Nnadi",
    email: "chioma.n@example.com",
    phone: null,
    kind: "Fabric consultation",
    starts_at: "2026-08-20T13:00:00.000Z",
    duration_minutes: 45,
    notes: null,
    status: "confirmed",
    created_at: "2026-08-12T09:20:00.000Z",
    updated_at: "2026-08-12T11:00:00.000Z",
  },
  {
    id: "d0000000-0000-4000-8000-000000000003",
    user_id: null,
    full_name: "Tolu Adeyemi",
    email: "tolu.a@example.com",
    phone: "+234 703 555 0198",
    kind: "Wedding consultation",
    starts_at: "2026-08-21T10:00:00.000Z",
    duration_minutes: 90,
    notes: "Second fitting. Skirt length to be settled.",
    status: "confirmed",
    created_at: "2026-08-10T14:45:00.000Z",
    updated_at: "2026-08-11T08:10:00.000Z",
  },
];

/*
 * What the sample orders were made of. Snapshots, exactly as the real table
 * stores them — the name and price at the moment of sale, so an old order
 * still reads correctly after a piece is renamed or repriced.
 */
export const SAMPLE_ORDER_ITEMS: OrderItem[] = [
  {
    id: "aa000000-0000-4000-8000-000000000001",
    order_id: "a0000000-0000-4000-8000-000000000001",
    product_id: "70000000-0000-4000-8000-000000000003",
    variant_id: "80000000-0000-4000-8000-000003000002",
    name_snapshot: "Etù Ash Jacket",
    variant_label: "Etù Ash · M",
    unit_price: 195_000_00,
    quantity: 1,
  },
  {
    id: "aa000000-0000-4000-8000-000000000002",
    order_id: "a0000000-0000-4000-8000-000000000002",
    product_id: "70000000-0000-4000-8000-000000000006",
    variant_id: "80000000-0000-4000-8000-000006000001",
    name_snapshot: "Òwú Cream Bridal Set",
    variant_label: "Òwú Cream · Made to measure",
    unit_price: 420_000_00,
    quantity: 1,
  },
  {
    id: "aa000000-0000-4000-8000-000000000003",
    order_id: "a0000000-0000-4000-8000-000000000003",
    product_id: "70000000-0000-4000-8000-000000000004",
    variant_id: "80000000-0000-4000-8000-000004000001",
    name_snapshot: "Sányán Bronze Scarf",
    variant_label: "Sányán Bronze · One size",
    unit_price: 52_000_00,
    quantity: 1,
  },
  {
    id: "aa000000-0000-4000-8000-000000000004",
    order_id: "a0000000-0000-4000-8000-000000000003",
    product_id: "70000000-0000-4000-8000-000000000005",
    variant_id: "80000000-0000-4000-8000-000005000001",
    name_snapshot: "Àlàrì Crimson Gèlè",
    variant_label: "Àlàrì Crimson · 2m",
    unit_price: 38_000_00,
    quantity: 1,
  },
];
