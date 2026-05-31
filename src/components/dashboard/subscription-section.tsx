"use client";

import Link from "next/link";
import { Crown, Check } from "lucide-react";
import type { User } from "@/types/database";
import { PLANS, getPlanLabel, isPro } from "@/lib/plans";
import { Card } from "@/components/ui/card";
import { UpgradeButton } from "@/components/pricing/upgrade-button";
import { cn } from "@/lib/utils";

type SubscriptionSectionProps = {
  user: User;
};

export function SubscriptionSection({ user }: SubscriptionSectionProps) {
  const plan = user.plan ?? "free";
  const pro = isPro(plan);
  const planDef = PLANS[plan];

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Crown
              className={cn(
                "h-5 w-5",
                pro ? "text-blue-600" : "text-slate-400"
              )}
            />
            <h2 className="text-lg font-semibold text-slate-900">Mon abonnement</h2>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            Gérez votre plan et débloquez les fonctionnalités avancées.
          </p>

          <div
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium",
              pro
                ? "bg-blue-100 text-blue-700 ring-1 ring-blue-200"
                : "bg-slate-100 text-slate-700 ring-1 ring-slate-200"
            )}
          >
            Plan {getPlanLabel(plan)} · {planDef.priceLabel}
          </div>
        </div>

        {!pro && (
          <UpgradeButton className="shrink-0" size="lg" />
        )}
      </div>

      <ul className="mt-6 grid sm:grid-cols-2 gap-2">
        {planDef.features.map((feature) => (
          <li
            key={feature}
            className="flex items-center gap-2 text-sm text-slate-600"
          >
            <Check className="h-4 w-4 text-emerald-500/80 shrink-0" />
            {feature}
          </li>
        ))}
      </ul>

      {!pro && (
        <p className="mt-6 text-sm text-slate-500 border-t border-slate-200 pt-4">
          Besoin de plus ?{" "}
          <Link href="/pricing" className="text-blue-600 hover:underline font-medium">
            Comparez les plans
          </Link>
        </p>
      )}
    </Card>
  );
}
