-- ── Storage ─────────────────────────────────────────────────────────────────
--
-- Two buckets, because the two kinds of file have opposite requirements.
--
-- Product media is public: it is shop photography, it is meant to be seen, and
-- a public URL is what `next/image` optimises without a round trip for a signed
-- one. next.config.ts already allow-lists this path.
--
-- Bespoke uploads are not. A commission enquiry carries a customer's reference
-- images — frequently photographs of their family at other people's weddings —
-- and those are readable by the atelier and nobody else, ever.

insert into storage.buckets (id, name, public)
values ('product-media', 'product-media', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('bespoke-uploads', 'bespoke-uploads', false)
on conflict (id) do nothing;

-- ── Who may touch what ──────────────────────────────────────────────────────
--
-- `public = true` on a bucket only makes reads anonymous. Every write still
-- goes through these policies, which is what stops a signed-in customer
-- uploading into the shop's photography.
--
-- Schema-qualified `public.is_admin()` — these policies are evaluated with
-- storage on the search path, where a bare name would not resolve.

create policy "product media is readable by anyone"
  on storage.objects for select
  using (bucket_id = 'product-media');

create policy "admins manage product media"
  on storage.objects for all
  using (bucket_id = 'product-media' and public.is_admin())
  with check (bucket_id = 'product-media' and public.is_admin());

-- No insert policy yet: nothing submits a commission until the bespoke form
-- exists, and a bucket anyone may write to before then is a free file host.
create policy "admins read bespoke uploads"
  on storage.objects for select
  using (bucket_id = 'bespoke-uploads' and public.is_admin());
