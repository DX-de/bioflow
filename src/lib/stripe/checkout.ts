import { STRIPE_NOT_CONNECTED_MESSAGE, isStripeConfigured } from "./config";

export type CreateCheckoutParams = {
  userId: string;
  email: string;
  successUrl: string;
  cancelUrl: string;
};

export type CheckoutSessionResult = {
  url: string;
  sessionId: string;
};

/**
 * Crée une session Stripe Checkout pour le plan Pro.
 * À brancher lorsque STRIPE_ENABLED=true et les routes API sont configurées.
 */
export async function createProCheckoutSession(
  params: CreateCheckoutParams
): Promise<CheckoutSessionResult> {
  void params; // utilisé lors du branchement Stripe
  if (!isStripeConfigured()) {
    throw new Error(STRIPE_NOT_CONNECTED_MESSAGE);
  }

  // TODO: intégration Stripe
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  // const session = await stripe.checkout.sessions.create({
  //   mode: "subscription",
  //   customer_email: params.email,
  //   line_items: [{ price: process.env.STRIPE_PRICE_PRO_MONTHLY!, quantity: 1 }],
  //   success_url: params.successUrl,
  //   cancel_url: params.cancelUrl,
  //   metadata: { userId: params.userId },
  // });
  // return { url: session.url!, sessionId: session.id };

  throw new Error(STRIPE_NOT_CONNECTED_MESSAGE);
}
