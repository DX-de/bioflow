-- Migration : média de profil, fond personnalisé, effets (table users = profil public)

alter table public.users
  add column if not exists audio_url text,
  add column if not exists background_url text,
  add column if not exists background_type text
    check (background_type is null or background_type in ('image', 'gif', 'video')),
  add column if not exists effects_enabled jsonb default '{"particles":false,"glass":true,"glow":true,"entrance":true}'::jsonb,
  add column if not exists volume numeric default 0.7
    check (volume is null or (volume >= 0 and volume <= 1));

comment on column public.users.audio_url is 'URL HTTPS directe vers un fichier audio (mp3, wav, ogg, m4a, webm)';
comment on column public.users.background_url is 'URL HTTPS image, gif ou vidéo de fond';
comment on column public.users.background_type is 'image | gif | video';
comment on column public.users.effects_enabled is 'JSON: particles, glass, glow, entrance';
comment on column public.users.volume is 'Volume audio profil 0 à 1';
