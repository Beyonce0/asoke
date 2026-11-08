-- ── What kind of thing a product is ─────────────────────────────────────────
--
-- The catalogue was built assuming everything is a finished garment. The
-- atelier also sells cloth by the piece and takes commissions, and those are
-- not the same object: a shopper filtering for "fabric" does not want a jacket
-- in the results, and a bespoke listing is a starting point rather than stock.

create type product_type as enum (
  'ready_to_wear', 'fabric', 'bespoke', 'custom'
);

alter table products
  add column product_type product_type not null default 'ready_to_wear';

-- Free text rather than an enum, deliberately. The house weaves aṣọ-òkè, adire,
-- akwa ocha and akwete today and will weave something else next year, and a new
-- cloth should not need a migration to sell. When the Fabrics section lands
-- this becomes a foreign key to it, and the strings written here are what will
-- seed that table.
alter table products
  add column fabric_type text;
