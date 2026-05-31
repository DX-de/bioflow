import type { BioThemeId } from "@/types/database";

export type ThemePreset = {
  id: BioThemeId;
  name: string;
  description: string;
  accent: string;
  accentSecondary: string;
  bgBase: string;
  bgGradient: string;
  glassBg: string;
  glassBorder: string;
  textPrimary: string;
  textMuted: string;
  proOnly: boolean;
};

export const BIOFLOW_THEMES: Record<BioThemeId, ThemePreset> = {
  classic: {
    id: "classic",
    name: "Classic",
    description: "Élégant et sobre — inclus en Gratuit",
    accent: "#3b82f6",
    accentSecondary: "#60a5fa",
    bgBase: "#0a0c14",
    bgGradient:
      "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59,130,246,0.22), transparent 55%), linear-gradient(180deg, #0c1018 0%, #06080d 100%)",
    glassBg: "rgba(255,255,255,0.06)",
    glassBorder: "rgba(255,255,255,0.12)",
    textPrimary: "#f8fafc",
    textMuted: "rgba(248,250,252,0.55)",
    proOnly: false,
  },
  dark_luxury: {
    id: "dark_luxury",
    name: "Dark Luxury",
    description: "Noir profond, accents dorés discrets",
    accent: "#d4af37",
    accentSecondary: "#f5e6b8",
    bgBase: "#050505",
    bgGradient:
      "radial-gradient(ellipse 70% 45% at 50% 0%, rgba(212,175,55,0.12), transparent 50%), linear-gradient(180deg, #0a0a0a 0%, #030303 100%)",
    glassBg: "rgba(20,20,20,0.65)",
    glassBorder: "rgba(212,175,55,0.2)",
    textPrimary: "#faf8f5",
    textMuted: "rgba(250,248,245,0.5)",
    proOnly: true,
  },
  neon_purple: {
    id: "neon_purple",
    name: "Neon Purple",
    description: "Violet néon, ambiance gaming",
    accent: "#a855f7",
    accentSecondary: "#e879f9",
    bgBase: "#0b0614",
    bgGradient:
      "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(168,85,247,0.35), transparent 55%), linear-gradient(180deg, #12081f 0%, #06030c 100%)",
    glassBg: "rgba(88,28,135,0.15)",
    glassBorder: "rgba(168,85,247,0.35)",
    textPrimary: "#faf5ff",
    textMuted: "rgba(250,245,255,0.55)",
    proOnly: true,
  },
  ice_blue: {
    id: "ice_blue",
    name: "Ice Blue",
    description: "Froid cristallin, cyan glacé",
    accent: "#22d3ee",
    accentSecondary: "#67e8f9",
    bgBase: "#040a12",
    bgGradient:
      "radial-gradient(ellipse 65% 45% at 50% -10%, rgba(34,211,238,0.25), transparent 50%), linear-gradient(180deg, #071018 0%, #020608 100%)",
    glassBg: "rgba(6,182,212,0.08)",
    glassBorder: "rgba(34,211,238,0.25)",
    textPrimary: "#ecfeff",
    textMuted: "rgba(236,254,255,0.5)",
    proOnly: true,
  },
  red_shadow: {
    id: "red_shadow",
    name: "Red Shadow",
    description: "Rouge intense, ombres dramatiques",
    accent: "#ef4444",
    accentSecondary: "#f87171",
    bgBase: "#0c0404",
    bgGradient:
      "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(239,68,68,0.28), transparent 55%), linear-gradient(180deg, #140606 0%, #080202 100%)",
    glassBg: "rgba(127,29,29,0.2)",
    glassBorder: "rgba(239,68,68,0.3)",
    textPrimary: "#fef2f2",
    textMuted: "rgba(254,242,242,0.5)",
    proOnly: true,
  },
};

export function getTheme(id: string | null | undefined): ThemePreset {
  const key = id as BioThemeId;
  if (key && BIOFLOW_THEMES[key]) return BIOFLOW_THEMES[key];
  return BIOFLOW_THEMES.classic;
}

export function canUseThemeId(plan: "free" | "pro", themeId: BioThemeId): boolean {
  const theme = BIOFLOW_THEMES[themeId];
  if (!theme.proOnly) return true;
  return plan === "pro";
}

export const THEME_LIST = Object.values(BIOFLOW_THEMES);
