"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Crown, Sparkles } from "lucide-react";
import { PLANS, type PlanId } from "@/lib/plans";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UpgradeButton } from "@/components/pricing/upgrade-button";

type PricingCardsProps = {
  isLoggedIn?: boolean;
  currentPlan?: PlanId;
};

export function PricingCards({ isLoggedIn, currentPlan = "free" }: PricingCardsProps) {
  const planOrder: PlanId[] = ["free", "pro"];

  return (
    <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
      {planOrder.map((planId, index) => {
        const plan = PLANS[planId];
        const isCurrent = currentPlan === planId;
        const isPro = planId === "pro";

        return (
          <motion.div
            key={planId}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className={cn(
              "relative flex flex-col rounded-3xl border p-8 transition-shadow",
              plan.highlighted
                ? "border-violet-500/50 bg-gradient-to-b from-violet-600/10 to-zinc-900/80 shadow-xl shadow-violet-600/10"
                : "border-zinc-800/80 glass"
            )}
          >
            {plan.highlighted && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white">
                <Crown className="h-3 w-3" />
                Populaire
              </span>
            )}

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                {isPro ? (
                  <Crown className="h-5 w-5 text-violet-400" />
                ) : (
                  <Sparkles className="h-5 w-5 text-zinc-400" />
                )}
                <h3 className="text-xl font-bold">{plan.name}</h3>
              </div>
              <p className="text-sm text-zinc-400">{plan.description}</p>
            </div>

            <div className="mb-8">
              <span className="text-4xl font-bold tracking-tight">
                {plan.price === 0 ? "0€" : `${plan.price.toFixed(2).replace(".", ",")}€`}
              </span>
              <span className="text-zinc-500 ml-1">/mois</span>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm">
                  <Check
                    className={cn(
                      "h-5 w-5 shrink-0",
                      isPro ? "text-violet-400" : "text-zinc-500"
                    )}
                  />
                  <span className="text-zinc-300">{feature}</span>
                </li>
              ))}
            </ul>

            {isPro ? (
              isLoggedIn ? (
                isCurrent ? (
                  <Button variant="secondary" className="w-full" disabled>
                    Plan actuel
                  </Button>
                ) : (
                  <UpgradeButton className="w-full" size="lg" />
                )
              ) : (
                <Link href="/signup">
                  <Button className="w-full" size="lg">
                    {plan.cta}
                  </Button>
                </Link>
              )
            ) : isLoggedIn && isCurrent ? (
              <Button variant="secondary" className="w-full" disabled>
                Plan actuel
              </Button>
            ) : (
              <Link href={isLoggedIn ? "/dashboard" : "/signup"}>
                <Button
                  variant={plan.highlighted ? "primary" : "secondary"}
                  className="w-full"
                  size="lg"
                >
                  {isLoggedIn ? "Continuer en Gratuit" : plan.cta}
                </Button>
              </Link>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
