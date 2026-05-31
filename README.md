# BioFlow

Application SaaS moderne de type **link-in-bio** : centralisez vos réseaux sociaux sur une page publique personnalisable.

## Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS 4**
- **Supabase** (Auth + PostgreSQL + Storage)
- **Framer Motion** (animations)
- Déploiement **Vercel**

## Fonctionnalités

| Module | Description |
|--------|-------------|
| Authentification | Inscription, connexion, déconnexion |
| **Plans** | Gratuit (5 liens, 1 thème) / Pro (4,99€/mois, illimité + extras) |
| Dashboard | Profil, liens, abonnement, aperçu fonctionnalités Pro |
| Tarifs | Page `/pricing` avec cartes Gratuit & Pro |
| Réseaux | Instagram, TikTok, Snapchat, Twitch, Discord, YouTube, Facebook, Site web |
| Page publique | `/[username]` — photo, bio, liens avec design premium |
| Stripe | Code préparé (`/api/stripe/checkout`, webhook) — non connecté |
| UI | Dark mode, responsive mobile/desktop, animations |

## Plans

| | Gratuit | Pro |
|---|---------|-----|
| Prix | 0€/mois | 4,99€/mois |
| Liens | 5 max | Illimités |
| Thème | 1 couleur simple | Palettes premium + picker |
| Stats / QR / Domaine | — | Prévus (UI dashboard) |

## Arborescence

```
BioFlow/
├── .env.example
├── package.json
├── next.config.ts
├── vercel.json
├── supabase/
│   ├── schema.sql          # Tables users + links, RLS, triggers
│   ├── migrations/
│   │   └── 001_add_plan.sql  # Migration plan (projets existants)
│   └── storage.sql         # Bucket avatars
├── public/
│   └── icon.svg
└── src/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx                 # Landing
    │   ├── globals.css
    │   ├── not-found.tsx
    │   ├── login/page.tsx
    │   ├── signup/page.tsx
    │   ├── dashboard/page.tsx
    │   ├── pricing/page.tsx
    │   ├── [username]/page.tsx      # Profil public
    │   ├── auth/callback/route.ts
    │   └── api/stripe/              # Checkout & webhook (stubs)
    ├── components/
    │   ├── auth/auth-form.tsx
    │   ├── pricing/
    │   ├── dashboard/
    │   │   ├── subscription-section.tsx
    │   │   ├── pro-features.tsx
    │   │   └── ...
    │   ├── layout/header.tsx
    │   ├── profile/public-profile.tsx
    │   ├── social-icons.tsx
    │   └── ui/                      # Button, Input, Card...
    ├── lib/
    │   ├── constants.ts
    │   ├── utils.ts
    │   └── supabase/
    │       ├── client.ts
    │       ├── server.ts
    │       └── middleware.ts
    ├── types/database.ts
    └── middleware.ts
```

## Installation

### 1. Cloner et installer

```bash
cd BioFlow
npm install
cp .env.example .env.local
```

### 2. Configurer Supabase

1. Créez un projet sur [supabase.com](https://supabase.com)
2. **SQL Editor** → exécutez `supabase/schema.sql`
3. Projet déjà créé ? → exécutez aussi `supabase/migrations/001_add_plan.sql`
4. **SQL Editor** → exécutez `supabase/storage.sql` (ou créez le bucket `avatars` en public)
5. **Authentication** → Settings :
   - Désactivez « Confirm email » pour les tests locaux (optionnel)
   - Ajoutez l’URL de redirection : `http://localhost:3000/auth/callback`
6. Copiez **Project URL** et **anon key** dans `.env.local`

### 3. Lancer en local

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

## Variables d'environnement

| Variable | Obligatoire | Description |
|----------|-------------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Oui | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Oui | Clé publique anon |
| `NEXT_PUBLIC_SITE_URL` | Non | URL de production (ex. `https://bioflow.vercel.app`) |
| `STRIPE_*` | Non | Paiement Pro (voir `.env.example`, désactivé par défaut) |

### Activer Stripe (plus tard)

1. Créez un produit récurrent 4,99€/mois dans le [dashboard Stripe](https://dashboard.stripe.com)
2. Renseignez les variables dans `.env.local` et `STRIPE_ENABLED=true`
3. Branchez `src/lib/stripe/checkout.ts` et `src/app/api/stripe/webhook/route.ts`
4. Webhook : sur `checkout.session.completed`, mettez `users.plan = 'pro'`

## Déploiement Vercel

Guide détaillé : **[DEPLOY.md](./DEPLOY.md)**

```bash
npm run check:env   # vérifie .env.local
npm run build
```

1. Poussez le repo sur GitHub
2. Importez le projet dans [Vercel](https://vercel.com/new)
3. Variables d'environnement : `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Après le 1er deploy : `NEXT_PUBLIC_SITE_URL` + config Supabase Auth (voir DEPLOY.md)
5. Test : `/api/health` doit retourner `{ "status": "ok" }`

## Base de données

### Table `users`

| Colonne | Type | Description |
|---------|------|-------------|
| id | uuid | FK vers auth.users |
| username | text | Unique, URL publique |
| email | text | Email |
| avatar | text | URL photo |
| bio | text | Biographie |
| theme | text | Couleur hex (#8b5cf6) |
| plan | text | `free` ou `pro` (défaut: `free`) |
| audio_url | text | URL HTTPS audio (Pro) |
| background_url | text | Fond image/GIF/vidéo (Pro) |
| background_type | text | `image` \| `gif` \| `video` |
| effects_enabled | jsonb | Particules, glass, glow, entrance |
| volume | numeric | Volume musique 0–1 (défaut 0.7) |

Exécutez aussi `supabase/migrations/002_profile_media_effects.sql` sur les projets existants.

### Table `links`

| Colonne | Type | Description |
|---------|------|-------------|
| id | uuid | PK |
| user_id | uuid | FK users |
| title | text | Libellé du lien |
| url | text | URL complète |
| icon | text | Réseau (instagram, tiktok, …) |
| position | int | Ordre d'affichage |

## Licence

MIT
