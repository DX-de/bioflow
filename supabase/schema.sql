-- BioFlow Supabase Schema
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users profile table (extends auth.users)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  email text not null,
  avatar text,
  bio text default '',
  theme text default '#8b5cf6',
  plan text not null default 'free' check (plan in ('free', 'pro')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Social links table
create table if not exists public.links (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  url text not null,
  icon text not null,
  position integer not null default 0,
  created_at timestamptz default now()
);

-- Indexes
create index if not exists links_user_id_idx on public.links(user_id);
create index if not exists users_username_idx on public.users(username);

-- Updated_at trigger
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

-- Auto-create profile on signup
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
    '#8b5cf6',
    'free'
  );

  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Row Level Security
alter table public.users enable row level security;
alter table public.links enable row level security;

-- Users policies
create policy "Public profiles are viewable by everyone"
  on public.users for select
  using (true);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.users for insert
  with check (auth.uid() = id);

-- Links policies
create policy "Links are viewable by everyone"
  on public.links for select
  using (true);

create policy "Users can manage own links"
  on public.links for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Storage bucket for avatars (run separately in Storage UI or via API)
-- Bucket name: avatars
-- Public: true
-- Policy: authenticated users can upload to their own folder
