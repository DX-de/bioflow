-- BioFlow Supabase Schema
-- Run this in the Supabase SQL Editor

create extension if not exists "uuid-ossp";

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  email text not null,
  avatar text,
  bio text default '',
  theme text default 'classic',
  plan text not null default 'free' check (plan in ('free', 'pro')),
  audio_url text,
  audio_title text,
  volume numeric default 0.7 check (volume is null or (volume >= 0 and volume <= 1)),
  background_url text,
  background_type text check (background_type is null or background_type in ('image', 'gif', 'video')),
  background_blur integer default 0 check (background_blur >= 0 and background_blur <= 40),
  background_opacity numeric default 0.55 check (background_opacity >= 0 and background_opacity <= 1),
  effects_enabled jsonb default '{"particles":false,"glass":true,"glow":true,"entrance":true}'::jsonb,
  effect_type text default 'none' check (effect_type in ('none', 'particles', 'rain', 'snow', 'stars')),
  cursor_effect text default 'none' check (cursor_effect in ('none', 'trail')),
  profile_animation text default 'fade' check (profile_animation in ('none', 'fade', 'scale', 'slide')),
  views integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.links (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  url text not null,
  icon text not null,
  position integer not null default 0,
  clicks integer not null default 0,
  created_at timestamptz default now()
);

create index if not exists links_user_id_idx on public.links(user_id);
create index if not exists users_username_idx on public.users(username);
create index if not exists users_views_idx on public.users(views desc);

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger users_updated_at
  before update on public.users
  for each row execute function public.handle_updated_at();

create or replace function public.handle_new_user()
returns trigger as $$
declare
  base_username text;
  final_username text;
  counter integer := 0;
begin
  base_username := lower(regexp_replace(
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    '[^a-zA-Z0-9_]', '', 'g'
  ));

  if base_username = '' then
    base_username := 'user';
  end if;

  final_username := base_username;

  while exists (select 1 from public.users where username = final_username) loop
    counter := counter + 1;
    final_username := base_username || counter::text;
  end loop;

  insert into public.users (id, username, email, avatar, bio, theme, plan)
  values (
    new.id,
    final_username,
    new.email,
    coalesce(new.raw_user_meta_data->>'avatar_url', null),
    '',
    'classic',
    'free'
  );

  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.increment_profile_views(profile_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.users set views = views + 1 where id = profile_user_id;
end;
$$;

create or replace function public.increment_link_clicks(link_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.links set clicks = clicks + 1 where id = link_id;
end;
$$;

grant execute on function public.increment_profile_views(uuid) to anon, authenticated;
grant execute on function public.increment_link_clicks(uuid) to anon, authenticated;

alter table public.users enable row level security;
alter table public.links enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.users for select using (true);

create policy "Users can update own profile"
  on public.users for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.users for insert with check (auth.uid() = id);

create policy "Links are viewable by everyone"
  on public.links for select using (true);

create policy "Users can manage own links"
  on public.links for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
