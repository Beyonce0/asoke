-- ── Replies to enquiries ────────────────────────────────────────────────────
--
-- What the atelier wrote back, kept beside what the customer asked. The point
-- is the same as the enquiries table itself: two people can see the same
-- thread, and "what did we tell her?" has an answer that does not live in one
-- person's sent folder.
--
-- A row is written only after the email has actually gone, so the history
-- never shows a reply the customer did not receive. Replies are a record, not
-- a draft: there is no update or delete policy, so what was sent stays as it
-- was sent.

create table enquiry_replies (
  id          uuid primary key default gen_random_uuid(),
  enquiry_id  uuid not null references enquiries (id) on delete cascade,
  subject     text not null,
  body        text not null,
  -- Who sent it. Kept as a name too, so the history still reads correctly
  -- after an admin's account is removed.
  sent_by     uuid references auth.users (id) on delete set null,
  sent_by_name text,
  -- The email service's id for the message, for tracing a delivery problem.
  provider_id text,
  created_at  timestamptz not null default now()
);

create index enquiry_replies_enquiry_idx
  on enquiry_replies (enquiry_id, created_at);

alter table enquiry_replies enable row level security;

create policy "admins read enquiry replies"
  on enquiry_replies for select
  using (is_admin());

create policy "admins write enquiry replies"
  on enquiry_replies for insert
  with check (is_admin());
