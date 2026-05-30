import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { PricingCards } from "@/components/pricing/pricing-cards";
import { normalizePlan } from "@/lib/plans";
import type { Plan } from "@/types/database";
import { Sparkles } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { PageWith3DBackground } from "@/components/background/background-3d";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tarifs",
  description: "Choisissez le plan Gratuit ou Pro pour votre page BioFlow.",
};

export default async function PricingPage() {
  let authUser = null;
  let currentPlan: Plan = "free";

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    authUser = data.user;

    if (authUser) {
      const { data: profile } = await supabase
        .from("users")
        .select("plan")
        .eq("id", authUser.id)
        .maybeSingle();

      currentPlan = normalizePlan(profile?.plan);
    }
  }

  return (
    <PageWith3DBackground overlay={0.55}>
      <Header user={authUser ? { email: authUser.email } : null} />

      <main className="mx-auto max-w-6xl px-4 py-12 sm:py-20">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300 mb-6">
            <Sparkles className="h-4 w-4" />
            Tarifs simples et transparents
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight max-w-2xl mx-auto">
            Choisissez le plan qui vous correspond
          </h1>
          <p className="mt-4 text-zinc-400 text-lg max-w-xl mx-auto">
            Commencez gratuitement, passez en Pro quand vous voulez débloquer
            tout le potentiel de votre page.
          </p>
        </div>

        <PricingCards
          isLoggedIn={Boolean(authUser)}
          currentPlan={currentPlan}
        />

        <p className="mt-12 text-center text-sm text-zinc-500 max-w-lg mx-auto">
          Le paiement Stripe sera bientôt disponible. En attendant, explorez
          les fonctionnalités Pro sur la page tarifs.{" "}
          <Link href="/dashboard" className="text-violet-400 hover:underline">
            Retour au dashboard
          </Link>
        </p>
      </main>
    </PageWith3DBackground>
  );
}
