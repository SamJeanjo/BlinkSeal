alter table public.share_links
add column if not exists title text,
add column if not exists view_limit integer check (view_limit is null or view_limit > 0),
add column if not exists one_time_access boolean not null default false,
add column if not exists allow_download boolean not null default true;

create index if not exists share_links_view_limit_idx on public.share_links(view_limit);
