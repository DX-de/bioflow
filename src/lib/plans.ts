import type { BackgroundType, BioThemeId, Plan } from "@/types/database";
import { BIOFLOW_THEMES } from "@/lib/themes";

export const FREE_LINK_LIMIT = 5;
export const PRO_PRICE_MONTHLY = 4.99;
export const DEFAULT_FREE_THEME: BioThemeId = "classic";

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
    description: "L’essentiel pour partager vos liens.",
    features: [
      "5 liens maximum",
      "Thème Classic uniquement",
      "Page publique BioFlow",
      "Photo, bio et badges",
      "Pas de musique ni fond vidéo",
      "Pas d’effets avancés",
    ],
    cta: "Commencer gratuitement",
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: PRO_PRICE_MONTHLY,
    priceLabel: "4,99€/mois",
    description: "Bio-page immersive complète.",
    features: [
      "Liens illimités",
      "5 thèmes premium",
      "Musique de profil",
      "Fond image / GIF / vidéo",
      "Effets visuels & curseur",
      "Stats vues & clics · QR · Domaine",
    ],
    highlighted: true,
    cta: "Passer en Pro",
  },
};

export const PRO_LOCKED_MESSAGE =
  "Cette option est disponible avec BioFlow Pro.";

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

export function canUseBackgroundType(plan: Plan, type: BackgroundType): boolean {
  if (!isPro(plan)) return false;
  return type === "image" || type === "gif" || type === "video";
}

export function canUseVideoBackground(plan: Plan): boolean {
  return isPro(plan);
}

export function canUseVisualEffects(plan: Plan): boolean {
  return isPro(plan);
}

export function canUseAdvancedEffects(plan: Plan): boolean {
  return isPro(plan);
}

export function canUseThemeId(plan: Plan, themeId: BioThemeId): boolean {
  const preset = BIOFLOW_THEMES[themeId];
  if (!preset) return themeId === "classic";
  if (!preset.proOnly) return true;
  return isPro(plan);
}

export function getAvailableThemes(plan: Plan) {
  return Object.values(BIOFLOW_THEMES).filter(
    (t) => !t.proOnly || isPro(plan)
  );
}
