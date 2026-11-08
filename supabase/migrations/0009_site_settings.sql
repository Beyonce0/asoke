-- ── Site settings ───────────────────────────────────────────────────────────
--
-- The handful of facts that are currently sentences inside components: how to
-- reach the atelier, when it is open, and which files the front page plays.
--
-- Every one of them is the kind of thing that changes without warning — a new
-- phone number, a better hero film — and none of them should need a developer,
-- a deploy, or a conversation with an AI to change.
--
-- ONE ROW, FOREVER. `id` is a boolean fixed at true, so the primary key admits
-- exactly one value: there is one atelier and there can only ever be one row of
-- its details. A settings table that can hold two rows eventually holds two,
-- and then nothing knows which is live.

create table site_settings (
  id                boolean primary key default true check (id),

  -- ── How to reach the house ────────────────────────────────────────────
  email             text,
  phone             text,
  whatsapp          text,
  address           text,
  opening_hours     text,
  instagram         text,

  /*
   * ── What the front page plays ─────────────────────────────────────────
   *
   * Null means "use what ships with the build". Every one of these has a
   * hard-coded fallback in the component that reads it, so an empty settings
   * row renders exactly the site as designed rather than a page of holes.
   *
   * The hero film is keyed live, so whatever replaces it must be shot on the
   * atelier's green screen — see components/motion/chroma-video.tsx.
   */
  hero_image        text,
  hero_video_mp4    text,
  hero_video_webm   text,
  craft_image       text,

  -- ── Promises made to customers ────────────────────────────────────────
  -- Shown on the atelier timeline. The one number a customer holds us to.
  turnaround        text,

  updated_at        timestamptz not null default now()
);

create trigger site_settings_updated_at before update on site_settings
  for each row execute function set_updated_at();

-- The row exists from the start, empty. Then the dashboard only ever updates,
-- and no code anywhere has to handle "settings have not been created yet".
insert into site_settings (id) values (true) on conflict (id) do nothing;

alter table site_settings enable row level security;

-- Readable by anyone: this is the shop's phone number and the film on its
-- front page, which is as public as information gets.
create policy "site settings are public"
  on site_settings for select
  using (true);

create policy "admins update site settings"
  on site_settings for update
  using (is_admin()) with check (is_admin());
