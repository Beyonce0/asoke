-- ============================================================================
-- ÀṢỌKÉ — sample catalogue
--
-- The six pieces from lib/sample-data.ts as real rows, so the storefront looks
-- the same the moment Supabase is connected instead of going blank while the
-- real catalogue is photographed.
--
-- Run once, after setup.sql. Safe to run twice: every row carries an explicit
-- id or a unique sku and does nothing on conflict.
--
-- The image paths point at files in public/ rather than at Storage, because
-- these are the design stand-ins that ship with the repository. Pieces added
-- through the dashboard will carry Storage URLs instead — both are just text
-- in the same column, and next/image serves either.
--
-- DELETE THESE ROWS once real stock exists. They are placeholders with prices
-- on them, and a customer cannot tell the difference:
--
--   delete from products where id like '70000000-%';
--   delete from collections where id like 'c0000000-%';
-- ============================================================================

-- ── Collections ─────────────────────────────────────────────────────────────

insert into collections (id, slug, name, description, hero_image, sort_order)
values
  ('c0000000-0000-4000-8000-000000000001', 'scarves', 'Scarves',
   'Single strips, finished by hand. The easiest way to wear it.',
   '/images/looks/look-03.jpg', 1),
  ('c0000000-0000-4000-8000-000000000002', 'ready-to-wear', 'Ready to wear',
   'Strips joined into pieces cut for the way she lives now.',
   '/images/looks/look-07.jpg', 2),
  ('c0000000-0000-4000-8000-000000000003', 'bridal', 'Bridal',
   'Woven to order, for the day everything is measured against.',
   '/images/looks/look-04.jpg', 3)
on conflict (id) do nothing;

-- ── Products ────────────────────────────────────────────────────────────────
--
-- Prices are kobo. ₦45,000 is 4500000 — the trailing two digits are the kobo,
-- and dropping them by hand is how a piece ends up selling for ₦450.

insert into products (
  id, slug, name, description, story, collection_id,
  base_price, product_type, fabric_type, turn_video,
  is_published, is_featured
)
values
  ('70000000-0000-4000-8000-000000000001', 'ibile-gold-scarf', 'Ìbílẹ̀ Gold Scarf',
   'A single narrow-loom strip in warm bronze, shot through with metallic weft. Long enough to wrap twice.',
   'Woven in Iseyin on a loom that has been in the same family for three generations. The gold thread is laid in by hand every fourth pass.',
   'c0000000-0000-4000-8000-000000000001',
   4500000, 'ready_to_wear', 'Aṣọ-òkè', '/videos/model.mp4', true, true),

  ('70000000-0000-4000-8000-000000000002', 'elu-indigo-wrap-skirt', 'Elú Indigo Wrap Skirt',
   'Six strips joined into a floor-length wrap. Deep indigo, undyed cotton selvedge left visible at the hem.',
   'The indigo is fermented in clay pits the old way, and the colour keeps deepening for months after the cloth leaves the dyer.',
   'c0000000-0000-4000-8000-000000000002',
   12800000, 'ready_to_wear', 'Aṣọ-òkè', '/videos/model.mp4', true, true),

  ('70000000-0000-4000-8000-000000000003', 'etu-ash-jacket', 'Etù Ash Jacket',
   'A collarless jacket in etù, the dark guinea-fowl cloth. Lined in cotton, unstructured through the shoulder.',
   'Etù was once worn only by titled men. We cut it for a woman''s shoulder and left the weave exactly as it came off the loom.',
   'c0000000-0000-4000-8000-000000000002',
   19500000, 'ready_to_wear', 'Aṣọ-òkè', null, true, true),

  ('70000000-0000-4000-8000-000000000004', 'sanyan-bronze-scarf', 'Sányán Bronze Scarf',
   'Sányán is spun from wild silk, which is why it holds this particular brown. Softens every time you wear it.',
   'The silk comes from the anaphe moth, gathered rather than farmed. A single scarf takes the yield of a whole season.',
   'c0000000-0000-4000-8000-000000000001',
   5200000, 'ready_to_wear', 'Aṣọ-òkè', null, true, true),

  ('70000000-0000-4000-8000-000000000005', 'alari-crimson-headwrap', 'Àlàrì Crimson Gèlè',
   'Stiff enough to hold a shape, soft enough to tie again tomorrow. Two metres, finished at both ends.',
   'Àlàrì takes its red from camwood. The colour was reserved for ceremony; we think a Tuesday counts.',
   'c0000000-0000-4000-8000-000000000001',
   3800000, 'ready_to_wear', 'Aṣọ-òkè', null, true, true),

  ('70000000-0000-4000-8000-000000000006', 'owu-cream-bridal-set', 'Òwú Cream Bridal Set',
   'Wrapper, blouse and gèlè in undyed cotton with a bronze eyelet border. Woven to your measurements.',
   'Òwú is cloth left the colour it grew. Eight weeks on the loom, and the eyelets are cut open one at a time with a blade.',
   'c0000000-0000-4000-8000-000000000003',
   42000000, 'ready_to_wear', 'Aṣọ-òkè', null, true, true)
on conflict (id) do nothing;

-- ── Photography ─────────────────────────────────────────────────────────────
--
-- sort_order 0 is what every card in the shop leads with. `view` is what the
-- product page builds its Front / Back switch from — two of these pieces were
-- shot from behind, the rest show one option and no switch.

insert into product_images (id, product_id, url, alt, view, sort_order)
values
  ('71000000-0000-4000-8000-000000000001', '70000000-0000-4000-8000-000000000001',
   '/images/looks/look-05.jpg', 'Ìbílẹ̀ Gold Scarf, handwoven aso-oke, from the front', 'front', 0),
  ('71000000-0000-4000-8000-000000000002', '70000000-0000-4000-8000-000000000001',
   '/images/looks/look-03.jpg', 'Ìbílẹ̀ Gold Scarf, handwoven aso-oke, from the back', 'back', 1),

  ('71000000-0000-4000-8000-000000000003', '70000000-0000-4000-8000-000000000002',
   '/images/looks/look-02.jpg', 'Elú Indigo Wrap Skirt, handwoven aso-oke, from the front', 'front', 0),
  ('71000000-0000-4000-8000-000000000004', '70000000-0000-4000-8000-000000000002',
   '/images/looks/look-07.jpg', 'Elú Indigo Wrap Skirt, handwoven aso-oke, from the back', 'back', 1),

  ('71000000-0000-4000-8000-000000000005', '70000000-0000-4000-8000-000000000003',
   '/images/looks/look-08.jpg', 'Etù Ash Jacket, handwoven aso-oke, from the front', 'front', 0),

  ('71000000-0000-4000-8000-000000000006', '70000000-0000-4000-8000-000000000004',
   '/images/looks/look-06.jpg', 'Sányán Bronze Scarf, handwoven aso-oke, from the front', 'front', 0),

  ('71000000-0000-4000-8000-000000000007', '70000000-0000-4000-8000-000000000005',
   '/images/looks/look-01.jpg', 'Àlàrì Crimson Gèlè, handwoven aso-oke, from the front', 'front', 0),

  ('71000000-0000-4000-8000-000000000008', '70000000-0000-4000-8000-000000000006',
   '/images/looks/look-04.jpg', 'Òwú Cream Bridal Set, handwoven aso-oke, from the front', 'front', 0)
on conflict (id) do nothing;

-- ── Variants ────────────────────────────────────────────────────────────────
--
-- What is actually sold. A cart line points at one of these, not at a product,
-- which is why every piece needs at least one even when there is only one size.
--
-- price_override is null unless the variant costs something different: the
-- extra-long scarf is ₦8,000 more, so it carries the whole ₦53,000, not the
-- difference. One variant of the jacket is at zero stock on purpose — it is
-- what "sold out" looks like on the storefront.

insert into product_variants (product_id, sku, color, size, price_override, stock, is_active)
values
  ('70000000-0000-4000-8000-000000000001', 'IBILE-GOLD-SCARF-1', 'Ìbílẹ̀ Gold', 'One size', null, 12, true),
  ('70000000-0000-4000-8000-000000000001', 'IBILE-GOLD-SCARF-2', 'Ìbílẹ̀ Gold', 'Extra long', 5300000, 3, true),

  ('70000000-0000-4000-8000-000000000002', 'ELU-INDIGO-WRAP-SKIRT-1', 'Elú Indigo', 'S', null, 4, true),
  ('70000000-0000-4000-8000-000000000002', 'ELU-INDIGO-WRAP-SKIRT-2', 'Elú Indigo', 'M', null, 6, true),
  ('70000000-0000-4000-8000-000000000002', 'ELU-INDIGO-WRAP-SKIRT-3', 'Elú Indigo', 'L', null, 2, true),

  ('70000000-0000-4000-8000-000000000003', 'ETU-ASH-JACKET-1', 'Etù Ash', 'S', null, 2, true),
  ('70000000-0000-4000-8000-000000000003', 'ETU-ASH-JACKET-2', 'Etù Ash', 'M', null, 3, true),
  ('70000000-0000-4000-8000-000000000003', 'ETU-ASH-JACKET-3', 'Etù Ash', 'L', null, 0, true),

  ('70000000-0000-4000-8000-000000000004', 'SANYAN-BRONZE-SCARF-1', 'Sányán Bronze', 'One size', null, 7, true),

  ('70000000-0000-4000-8000-000000000005', 'ALARI-CRIMSON-HEADWRAP-1', 'Àlàrì Crimson', '2m', null, 15, true),

  ('70000000-0000-4000-8000-000000000006', 'OWU-CREAM-BRIDAL-SET-1', 'Òwú Cream', 'Made to measure', null, 2, true)
on conflict (sku) do nothing;
