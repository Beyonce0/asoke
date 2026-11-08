-- ── Garment views ───────────────────────────────────────────────────────────
--
-- The first thing a shopper asks about a piece is what it looks like from
-- behind, and cloth this heavy hangs differently in motion than it does on a
-- hanger. Both questions were unanswerable: a photograph did not say which
-- side it showed, and there was nowhere to put a clip.
--
-- So a photograph now names its side, and a product may carry one film of the
-- piece turning. The detail page offers whichever of these exist as a switch
-- above the picture, so a piece with only a front shot still works and simply
-- shows one option.

create type garment_view as enum ('front', 'back', 'detail');

-- Existing rows are all front shots — that is what was uploaded when there was
-- no way to say otherwise — so the default backfills them correctly.
alter table product_images
  add column view garment_view not null default 'front';

-- One clip per piece, shot on green like everything else the atelier films.
-- The key is removed in a shader at play time (see components/motion/
-- chroma-video.tsx), which is why a single file works on any background and
-- why nothing here needs to know the page it will be played on.
--
-- Null until the piece has been filmed, which is most of them.
alter table products
  add column turn_video text;

-- No policy work: both tables already carry select policies gated on
-- products.is_published, and there are no write policies at all, so writes stay
-- with the service role. A column added to a policied table inherits all of it.
