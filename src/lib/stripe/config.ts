/**
 * Configuration Stripe — préparée pour une intégration future.
 * STRIPE_ENABLED reste à false tant que les clés ne sont pas configurées.
 */

export const STRIPE_ENABLED =
  process.env.STRIPE_ENABLED === "true" &&
  Boolean(process.env.STRIPE_SECRET_KEY) &&
  Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export const STRIPE_PRICE_PRO_MONTHLY =
  process.env.STRIPE_PRICE_PRO_MONTHLY ?? "";

export function isStripeConfigured(): boolean {
  return STRIPE_ENABLED && STRIPE_PRICE_PRO_MONTHLY.length > 0;
}

export const STRIPE_NOT_CONNECTED_MESSAGE =
  "Le paiement Stripe n'est pas encore activé. Revenez bientôt ou contactez le support.";
