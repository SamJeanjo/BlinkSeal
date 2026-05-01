create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text unique not null,
  email text,
  name text,
  created_at timestamptz default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.users(id) on delete cascade,
  file_name text not null,
  file_type text,
  file_size bigint,
  storage_path text not null,
  created_at timestamptz default now()
);

create table if not exists public.share_links (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references public.documents(id) on delete cascade,
  token text unique not null,
  expires_at timestamptz,
  revoked boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.view_events (
  id uuid primary key default gen_random_uuid(),
  share_link_id uuid references public.share_links(id) on delete cascade,
  viewed_at timestamptz default now(),
  ip_address text,
  user_agent text,
  referrer text
);

create index if not exists users_clerk_user_id_idx on public.users(clerk_user_id);
create index if not exists documents_owner_id_idx on public.documents(owner_id);
create index if not exists documents_storage_path_idx on public.documents(storage_path);
create index if not exists share_links_document_id_idx on public.share_links(document_id);
create index if not exists share_links_token_idx on public.share_links(token);
create index if not exists view_events_share_link_id_idx on public.view_events(share_link_id);

insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do update set public = false;

alter table public.users enable row level security;
alter table public.documents enable row level security;
alter table public.share_links enable row level security;
alter table public.view_events enable row level security;

drop policy if exists "Users can read own user row" on public.users;
create policy "Users can read own user row"
on public.users
for select
to authenticated
using (clerk_user_id = auth.jwt() ->> 'sub');

drop policy if exists "Users can update own user row" on public.users;
create policy "Users can update own user row"
on public.users
for update
to authenticated
using (clerk_user_id = auth.jwt() ->> 'sub')
with check (clerk_user_id = auth.jwt() ->> 'sub');

drop policy if exists "Users can read own documents" on public.documents;
create policy "Users can read own documents"
on public.documents
for select
to authenticated
using (
  exists (
    select 1
    from public.users
    where users.id = documents.owner_id
      and users.clerk_user_id = auth.jwt() ->> 'sub'
  )
);

drop policy if exists "Users can create own documents" on public.documents;
create policy "Users can create own documents"
on public.documents
for insert
to authenticated
with check (
  exists (
    select 1
    from public.users
    where users.id = documents.owner_id
      and users.clerk_user_id = auth.jwt() ->> 'sub'
  )
);

drop policy if exists "Users can update own documents" on public.documents;
create policy "Users can update own documents"
on public.documents
for update
to authenticated
using (
  exists (
    select 1
    from public.users
    where users.id = documents.owner_id
      and users.clerk_user_id = auth.jwt() ->> 'sub'
  )
)
with check (
  exists (
    select 1
    from public.users
    where users.id = documents.owner_id
      and users.clerk_user_id = auth.jwt() ->> 'sub'
  )
);

drop policy if exists "Users can delete own documents" on public.documents;
create policy "Users can delete own documents"
on public.documents
for delete
to authenticated
using (
  exists (
    select 1
    from public.users
    where users.id = documents.owner_id
      and users.clerk_user_id = auth.jwt() ->> 'sub'
  )
);

drop policy if exists "Users can read share links for own documents" on public.share_links;
create policy "Users can read share links for own documents"
on public.share_links
for select
to authenticated
using (
  exists (
    select 1
    from public.documents
    join public.users on users.id = documents.owner_id
    where documents.id = share_links.document_id
      and users.clerk_user_id = auth.jwt() ->> 'sub'
  )
);

drop policy if exists "Users can create share links for own documents" on public.share_links;
create policy "Users can create share links for own documents"
on public.share_links
for insert
to authenticated
with check (
  exists (
    select 1
    from public.documents
    join public.users on users.id = documents.owner_id
    where documents.id = share_links.document_id
      and users.clerk_user_id = auth.jwt() ->> 'sub'
  )
);

drop policy if exists "Users can update share links for own documents" on public.share_links;
create policy "Users can update share links for own documents"
on public.share_links
for update
to authenticated
using (
  exists (
    select 1
    from public.documents
    join public.users on users.id = documents.owner_id
    where documents.id = share_links.document_id
      and users.clerk_user_id = auth.jwt() ->> 'sub'
  )
)
with check (
  exists (
    select 1
    from public.documents
    join public.users on users.id = documents.owner_id
    where documents.id = share_links.document_id
      and users.clerk_user_id = auth.jwt() ->> 'sub'
  )
);

drop policy if exists "Users can delete share links for own documents" on public.share_links;
create policy "Users can delete share links for own documents"
on public.share_links
for delete
to authenticated
using (
  exists (
    select 1
    from public.documents
    join public.users on users.id = documents.owner_id
    where documents.id = share_links.document_id
      and users.clerk_user_id = auth.jwt() ->> 'sub'
  )
);

drop policy if exists "Users can read view events for own documents" on public.view_events;
create policy "Users can read view events for own documents"
on public.view_events
for select
to authenticated
using (
  exists (
    select 1
    from public.share_links
    join public.documents on documents.id = share_links.document_id
    join public.users on users.id = documents.owner_id
    where share_links.id = view_events.share_link_id
      and users.clerk_user_id = auth.jwt() ->> 'sub'
  )
);

drop policy if exists "Users can delete view events for own documents" on public.view_events;
create policy "Users can delete view events for own documents"
on public.view_events
for delete
to authenticated
using (
  exists (
    select 1
    from public.share_links
    join public.documents on documents.id = share_links.document_id
    join public.users on users.id = documents.owner_id
    where share_links.id = view_events.share_link_id
      and users.clerk_user_id = auth.jwt() ->> 'sub'
  )
);

-- No anon policies are created. Public viewers must go through /view/[token],
-- where the server validates the token, creates a signed Storage URL, and logs
-- the view_event with the service role key.
