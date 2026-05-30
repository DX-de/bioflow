import type { Plan } from "@/types/database";

export const FREE_LINK_LIMIT = 5;
export const PRO_PRICE_MONTHLY = 4.99;
export const DEFAULT_FREE_THEME = "#8b5cf6";

export type PlanId = Plan;

export type PlanDefinition = {
  id: PlanId;
  name: string;
  price: number;
  priceLabel: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
};

export const PLANS: Record<PlanId, PlanDefinition> = {
  free: {
    id: "free",
    name: "Gratuit",
    price: 0,
    priceLabel: "0€/mois",
    description: "Parfait pour démarrer et partager vos essentiels.",
    features: [
      "Jusqu'à 5 liens",
      "1 thème simple",
      "Page publique personnalisée",
      "Photo et bio",
    ],
    cta: "Commencer gratuitement",
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: PRO_PRICE_MONTHLY,
    priceLabel: "4,99€/mois",
    description: "Pour les créateurs qui veulent aller plus loin.",
    features: [
      "Liens illimités",
      "Statistiques détaillées",
      "QR Code automatique",
      "Domaine personnalisé",
      "Thèmes premium",
    ],
    highlighted: true,
    cta: "Passer en Pro",
  },
};

export function isPro(plan: Plan): boolean {
  return plan === "pro";
}

export function canAddLink(plan: Plan, linkCount: number): boolean {
  if (isPro(plan)) return true;
  return linkCount < FREE_LINK_LIMIT;
}

export function getRemainingLinks(plan: Plan, linkCount: number): number | null {
  if (isPro(plan)) return null;
  return Math.max(0, FREE_LINK_LIMIT - linkCount);
}

export function getPlanLabel(plan: Plan): string {
  return plan === "pro" ? "Pro" : "Gratuit";
}

export function normalizePlan(plan: string | null | undefined): Plan {
  return plan === "pro" ? "pro" : "free";
}
