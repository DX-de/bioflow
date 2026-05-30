import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createProCheckoutSession } from "@/lib/stripe/checkout";
import {
  isStripeConfigured,
  STRIPE_NOT_CONNECTED_MESSAGE,
} from "@/lib/stripe/config";
import { getSiteUrl } from "@/lib/site-url";

/**
 * POST /api/stripe/checkout
 * Prépare le passage au plan Pro via Stripe (non connecté pour l'instant).
 */
export async function POST() {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      {
        error: STRIPE_NOT_CONNECTED_MESSAGE,
        code: "STRIPE_NOT_CONFIGURED",
      },
      { status: 501 }
    );
  }

  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser?.email) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const baseUrl = getSiteUrl();

    const session = await createProCheckoutSession({
      userId: authUser.id,
      email: authUser.email,
      successUrl: `${baseUrl}/dashboard?upgraded=1`,
      cancelUrl: `${baseUrl}/pricing?canceled=1`,
    });

    return NextResponse.json(session);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Erreur lors du checkout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
