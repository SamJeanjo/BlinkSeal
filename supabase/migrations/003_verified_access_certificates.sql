alter table public.documents
add column if not exists sha256 text;

alter table public.view_events
add column if not exists event_type text not null default 'open',
add column if not exists details jsonb not null default '{}'::jsonb;

create table if not exists public.access_certificates (
  id uuid primary key default gen_random_uuid(),
  certificate_number text unique not null,
  document_id uuid references public.documents(id) on delete cascade,
  share_link_id uuid references public.share_links(id) on delete cascade,
  payload jsonb not null,
  payload_sha256 text not null,
  event_log_sha256 text not null,
  signature text not null,
  public_key text not null,
  issued_at timestamptz default now()
);

create index if not exists access_certificates_document_id_idx on public.access_certificates(document_id);
create index if not exists access_certificates_share_link_id_idx on public.access_certificates(share_link_id);
create index if not exists access_certificates_number_idx on public.access_certificates(certificate_number);

alter table public.access_certificates enable row level security;

drop policy if exists "Users can read certificates for own documents" on public.access_certificates;
create policy "Users can read certificates for own documents"
on public.access_certificates
for select
to authenticated
using (
  exists (
    select 1
    from public.documents
    join public.users on users.id = documents.owner_id
    where documents.id = access_certificates.document_id
      and users.clerk_user_id = auth.jwt() ->> 'sub'
  )
);

-- No anon policies are created. Public verification pages read certificates
-- server-side through the service role key and expose only certificate data.
