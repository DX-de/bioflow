# Déployer BioFlow sur Vercel

Guide pas à pas (≈ 10 minutes).

## Prérequis

- Compte [GitHub](https://github.com) (recommandé)
- Compte [Vercel](https://vercel.com) (gratuit)
- Projet Supabase déjà configuré (`schema.sql` + migration `001_add_plan.sql`)

## 1. Vérifier l'environnement local

```bash
npm run check:env
npm run build
```

## 2. Pousser le code sur GitHub

```bash
cd ~/Desktop/BioFlow
git init
git add .
git commit -m "BioFlow — prêt pour déploiement"
```

Créez un repo sur GitHub, puis :

```bash
git remote add origin https://github.com/VOTRE_USER/bioflow.git
git branch -M main
git push -u origin main
```

## 3. Importer sur Vercel

1. [vercel.com/new](https://vercel.com/new)
2. **Import** votre repo GitHub `bioflow`
3. Framework : **Next.js** (détecté automatiquement)
4. **Environment Variables** — ajoutez :

| Variable | Valeur |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://isfzhrxmlfqryvrdtfto.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | votre clé `eyJ...` (anon) |

5. Cliquez **Deploy**

À la fin, notez votre URL : `https://bioflow-xxxxx.vercel.app`

## 4. Configurer Supabase pour la production

[Dashboard Supabase](https://supabase.com/dashboard/project/isfzhrxmlfqryvrdtfto/auth/url-configuration)

**Site URL :**
```
https://bioflow-xxxxx.vercel.app
```

**Redirect URLs** (ajoutez les deux) :
```
https://bioflow-xxxxx.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

## 5. Mettre à jour Vercel avec l'URL finale

Dans Vercel → **Settings → Environment Variables** :

```
NEXT_PUBLIC_SITE_URL=https://bioflow-xxxxx.vercel.app
```

Puis **Redeploy** (Deployments → ⋯ → Redeploy).

## 6. Tester en production

- [ ] Accueil : `https://votre-app.vercel.app`
- [ ] Inscription / connexion
- [ ] Dashboard + ajout de liens
- [ ] Page publique : `https://votre-app.vercel.app/votrepseudo`
- [ ] Santé API : `https://votre-app.vercel.app/api/health`

## Déploiement en ligne de commande (optionnel)

```bash
npx vercel login
npx vercel link
npx vercel env add NEXT_PUBLIC_SUPABASE_URL
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
npx vercel --prod
```

## Dépannage

| Problème | Solution |
|----------|----------|
| Erreur à l'inscription | Vérifiez Redirect URLs dans Supabase |
| Page blanche / 500 | Vérifiez les variables d'env sur Vercel |
| `plan` inconnu | Exécutez `supabase/migrations/001_add_plan.sql` |
| Auth redirect localhost | Ajoutez `NEXT_PUBLIC_SITE_URL` sur Vercel + redeploy |

## Prochaine étape

Une fois en ligne : QR Code + statistiques Pro, puis Stripe.
