-- Migration : ajouter le champ plan aux utilisateurs existants
-- Exécutez ce script si vous aviez déjà créé la table users sans la colonne plan

alter table public.users
  add column if not exists plan text not null default 'free'
  check (plan in ('free', 'pro'));

create index if not exists users_plan_idx on public.users(plan);

-- Mettre à jour le trigger de création de profil (si besoin, réexécutez la fonction complète depuis schema.sql)
