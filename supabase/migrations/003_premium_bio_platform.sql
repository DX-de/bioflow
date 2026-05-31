-- BioFlow Premium — thèmes, effets, stats, audio meta

alter table public.users
  add column if not exists audio_title text,
  add column if not exists background_blur integer default 0 check (background_blur >= 0 and background_blur <= 40),
  add column if not exists background_opacity numeric default 0.55 check (background_opacity >= 0 and background_opacity <= 1),
  add column if not exists effect_type text default 'none'
    check (effect_type in ('none', 'particles', 'rain', 'snow', 'stars')),
  add column if not exists cursor_effect text default 'none'
    check (cursor_effect in ('none', 'trail')),
  add column if not exists profile_animation text default 'fade'
    check (profile_animation in ('none', 'fade', 'scale', 'slide')),
  add column if not exists views integer not null default 0;

-- theme column stores preset id: classic | dark_luxury | neon_purple | ice_blue | red_shadow

alter table public.links
  add column if not exists clicks integer not null default 0;

create index if not exists users_views_idx on public.users(views desc);

-- Increment views (public, via RPC)
create or replace function public.increment_profile_views(profile_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.users
  set views = views + 1
  where id = profile_user_id;
end;
$$;

-- Increment link clicks
create or replace function public.increment_link_clicks(link_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.links
  set clicks = clicks + 1
  where id = link_id;
end;
$$;

grant execute on function public.increment_profile_views(uuid) to anon, authenticated;
grant execute on function public.increment_link_clicks(uuid) to anon, authenticated;
