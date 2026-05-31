import type { BackgroundType, Plan } from "@/types/database";

export const FREE_LINK_LIMIT = 5;
export const PRO_PRICE_MONTHLY = 4.99;
export const DEFAULT_FREE_THEME = "#2563eb";

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
      "Pas de musique ni fond vidéo",
    ],
    cta: "Commencer gratuitement",
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: PRO_PRICE_MONTHLY,
    priceLabel: "4,99€/mois",
    description: "Style bio-page premium : musique, fonds et effets.",
    features: [
      "Liens illimités",
      "Musique de profil",
      "Fond image / GIF / vidéo",
      "Effets visuels (particules, glow, glass)",
      "Statistiques · QR Code · Domaine perso",
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

export function canUseProfileMusic(plan: Plan): boolean {
  return isPro(plan);
}

export function canUseCustomBackground(plan: Plan): boolean {
  return isPro(plan);
}

export function canUseBackgroundType(
  plan: Plan,
  type: BackgroundType
): boolean {
  if (!isPro(plan)) return false;
  return type === "image" || type === "gif" || type === "video";
}

export function canUseVideoBackground(plan: Plan): boolean {
  return isPro(plan);
}

export function canUseVisualEffects(plan: Plan): boolean {
  return isPro(plan);
}
