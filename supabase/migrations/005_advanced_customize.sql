-- BioFlow — personnalisation avancée (Customize Studio)

alter table public.users
  add column if not exists audio_loop boolean default true,
  add column if not exists cursor_url text,
  add column if not exists location text default '',
  add column if not exists profile_opacity numeric default 1 check (profile_opacity >= 0 and profile_opacity <= 1),
  add column if not exists profile_blur integer default 0 check (profile_blur >= 0 and profile_blur <= 40),
  add column if not exists border_radius integer default 24 check (border_radius >= 0 and border_radius <= 48),
  add column if not exists card_width integer default 100 check (card_width >= 70 and card_width <= 100),
  add column if not exists avatar_size integer default 128 check (avatar_size >= 80 and avatar_size <= 200),
  add column if not exists username_effect text default 'none'
    check (username_effect in ('none', 'glow', 'pulse', 'glitch', 'sparkle')),
  add column if not exists avatar_animation text default 'none'
    check (avatar_animation in ('none', 'float', 'pulse', 'rotate-slow')),
  add column if not exists page_transition text default 'fade'
    check (page_transition in ('fade', 'zoom', 'slide', 'none')),
  add column if not exists background_effect text default 'none'
    check (background_effect in ('none', 'particles', 'rain', 'snow', 'stars')),
  add column if not exists accent_color text,
  add column if not exists text_color text,
  add column if not exists background_color text,
  add column if not exists icon_color text,
  add column if not exists primary_color text,
  add column if not exists secondary_color text,
  add column if not exists gradient_enabled boolean default false,
  add column if not exists glow_color text,
  add column if not exists button_color text,
  add column if not exists button_text_color text;

-- Sync legacy effect_type → background_effect
update public.users
set background_effect = coalesce(background_effect, effect_type, 'none')
where background_effect is null or background_effect = 'none';

update public.users
set page_transition = case
  when profile_animation = 'scale' then 'zoom'
  when profile_animation = 'slide' then 'slide'
  when profile_animation = 'none' then 'none'
  else coalesce(page_transition, 'fade')
end
where page_transition is null;
