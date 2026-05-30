import { NextResponse } from "next/server";

/**
 * POST /api/stripe/webhook
 * Webhook Stripe pour activer le plan Pro après paiement (à connecter).
 *
 * TODO:
 * 1. Vérifier la signature avec STRIPE_WEBHOOK_SECRET
 * 2. Sur checkout.session.completed → mettre users.plan = 'pro'
 * 3. Sur customer.subscription.deleted → remettre plan = 'free'
 */
export async function POST() {
  return NextResponse.json(
    {
      error: "Webhook Stripe non configuré",
      code: "STRIPE_NOT_CONFIGURED",
    },
    { status: 501 }
  );
}
