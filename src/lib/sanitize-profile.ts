import type { User } from "@/types/database";
import {
  DEFAULT_PROFILE_EFFECTS,
  parseCursorEffect,
  parseEffectType,
  parseProfileAnimation,
  parseProfileEffects,
  clampBlur,
  clampOpacity,
  clampVolume,
} from "@/lib/profile-effects";
import { isPro, normalizePlan } from "@/lib/plans";
import { getTheme } from "@/lib/themes";

/** Retire les options Pro pour l'affichage public si plan gratuit. */
export function sanitizePublicProfile(user: User): User {
  const plan = normalizePlan(user.plan);
  const themePreset = getTheme(user.theme);
  const safeTheme =
    plan === "pro" || !themePreset.proOnly ? user.theme : "classic";

  if (isPro(plan)) {
    return { ...user, plan, theme: safeTheme };
  }

  return {
    ...user,
    plan,
    theme: "classic",
    audio_url: null,
    audio_title: null,
    background_url: null,
    background_type: null,
    background_blur: 0,
    background_opacity: 0.55,
    effect_type: "none",
    cursor_effect: "none",
    profile_animation: "fade",
    effects_enabled: {
      particles: false,
      glass: true,
      glow: false,
      entrance: true,
    },
    volume: clampVolume(user.volume),
  };
}

export function normalizeUserRow(row: Record<string, unknown>): User {
  return {
    id: row.id as string,
    username: row.username as string,
    email: row.email as string,
    avatar: (row.avatar as string | null) ?? null,
    bio: (row.bio as string) ?? "",
    theme: (row.theme as string) ?? "classic",
    plan: normalizePlan(row.plan as string),
    audio_url: (row.audio_url as string | null) ?? null,
    audio_title: (row.audio_title as string | null) ?? null,
    volume: clampVolume(row.volume as number | undefined),
    background_url: (row.background_url as string | null) ?? null,
    background_type: (row.background_type as User["background_type"]) ?? null,
    background_blur: clampBlur(row.background_blur as number | undefined),
    background_opacity: clampOpacity(
      row.background_opacity as number | undefined
    ),
    effects_enabled:
      row.effects_enabled != null
        ? parseProfileEffects(row.effects_enabled)
        : DEFAULT_PROFILE_EFFECTS,
    effect_type: parseEffectType(row.effect_type),
    cursor_effect: parseCursorEffect(row.cursor_effect),
    profile_animation: parseProfileAnimation(row.profile_animation),
    views: typeof row.views === "number" ? row.views : 0,
    created_at: row.created_at as string | undefined,
    updated_at: row.updated_at as string | undefined,
  };
}

export function normalizeLinkRow(row: Record<string, unknown>) {
  return {
    id: row.id as string,
    user_id: row.user_id as string,
    title: row.title as string,
    url: row.url as string,
    icon: (row.icon as string) ?? "website",
    position: (row.position as number) ?? 0,
    clicks: typeof row.clicks === "number" ? row.clicks : 0,
    created_at: row.created_at as string | undefined,
  };
}
