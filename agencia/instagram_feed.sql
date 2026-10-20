-- ============================================================
-- Espejo de posts de Instagram (feed del sitio)
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query
-- ============================================================

create table if not exists public.posts_instagram (
  id text primary key,
  caption text,
  media_type text not null,
  media_urls jsonb not null default '[]'::jsonb,
  permalink text,
  posted_at timestamptz,
  hashtags text[] not null default '{}',
  sincronizado_en timestamptz not null default now()
);

alter table public.posts_instagram enable row level security;

drop policy if exists "posts_instagram public read" on public.posts_instagram;
create policy "posts_instagram public read"
  on public.posts_instagram
  for select
  using (true);

-- Bucket publico: las URLs de Instagram expiran en 24h, aqui se re-hospedan
insert into storage.buckets (id, name, public)
values ('instagram-media', 'instagram-media', true)
on conflict (id) do nothing;
