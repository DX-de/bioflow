/**
 * URL publique du site (local ou production).
 * Sur Vercel, définissez NEXT_PUBLIC_SITE_URL après le premier déploiement.
 */
export function getSiteUrl(fallbackOrigin?: string): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (fromEnv && !fromEnv.includes("votre-domaine")) {
    return fromEnv.replace(/\/$/, "");
  }

  if (fallbackOrigin) {
    return fallbackOrigin.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}
