# BioFlow

Plateforme **link-in-bio premium** : bio-page sombre, moderne et ultra personnalisable (musique, fond animé, effets visuels, thèmes, stats).

Identité visuelle **BioFlow** — inspirée des bio-pages gaming/luxe modernes, sans copier un concurrent.

## Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS 4**
- **Supabase** (Auth + PostgreSQL + Storage)
- **Framer Motion**
- Déploiement **Vercel**

## Fonctionnalités principales

| Module | Description |
|--------|-------------|
| Page publique | `/[username]` — écran « Clique pour entrer », profil glass, liens, vues |
| Musique | Upload fichier (.mp3, .wav…) ou URL HTTPS, lecteur après clic |
| Fond | Image / GIF / vidéo MP4-WebM, flou et opacité réglables |
| Effets | Particules, pluie, neige, étoiles, glow, traînée curseur, animations |
| Thèmes | Classic (free), Dark Luxury, Neon Purple, Ice Blue, Red Shadow (pro) |
| Personnalisation | `/dashboard/customize` avec **aperçu live** |
| Plans | Free (5 liens, Classic) / Pro (illimité + premium) |
| Stats | Compteur de vues profil, clics par lien |
| Sécurité | Validation URLs HTTPS, types média autorisés, RLS Supabase |

## Plans

| | Gratuit | Pro |
|---|---------|-----|
| Liens | 5 max | Illimités |
| Thème | Classic | 5 thèmes |
| Musique | — | Oui |
| Fond vidéo / GIF | — | Oui |
| Effets avancés | — | Oui |
| Stats / QR / Domaine | — | UI dashboard (QR/stats Pro) |

## Installation

```bash
cd BioFlow
npm install
cp .env.example .env.local
```

### Supabase

1. Créez un projet sur [supabase.com](https://supabase.com)
2. **SQL Editor** → exécutez `supabase/schema.sql` (nouveau projet)
3. Projet existant → exécutez dans l’ordre :
   - `supabase/migrations/001_add_plan.sql`
   - `supabase/migrations/002_profile_media_effects.sql`
   - `supabase/migrations/003_premium_bio_platform.sql`
   - `supabase/migrations/004_profile_audio_storage.sql`
4. Storage : buckets publics `avatars` et `profile-media` (musique)
5. Auth → URL de redirection : `http://localhost:3000/auth/callback` et votre domaine Vercel

### Variables d’environnement

```env
NEXT_PUBLIC_SUPABASE_URL=https://VOTRE_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Lancer

```bash
npm run dev
```

- Landing : `http://localhost:3000`
- Dashboard : `/dashboard`
- Personnalisation : `/dashboard/customize`
- Profil public : `/votre_pseudo`

### Activer le plan Pro (test)

```sql
update public.users set plan = 'pro' where email = 'vous@example.com';
```

## Colonnes `users` (référence)

`audio_url`, `audio_title`, `volume`, `background_url`, `background_type`, `background_blur`, `background_opacity`, `effects_enabled`, `effect_type`, `cursor_effect`, `profile_animation`, `theme`, `plan`, `views`

## Colonnes `links`

`clicks` — incrémenté via `/api/track/click`

## Arborescence clé

```
src/
├── app/
│   ├── [username]/page.tsx
│   ├── dashboard/customize/page.tsx
│   └── api/track/view|click/route.ts
├── components/profile/
│   ├── public-profile.tsx
│   ├── entry-gate.tsx
│   ├── profile-background.tsx
│   ├── profile-audio-controls.tsx
│   └── profile-effects-layer.tsx
├── components/dashboard/customize-client.tsx
├── lib/themes.ts
├── lib/plans.ts
└── lib/validate-media-url.ts
```

## Déploiement Vercel

Variables `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` obligatoires.

```bash
npm run build
```

## Licence

MIT
