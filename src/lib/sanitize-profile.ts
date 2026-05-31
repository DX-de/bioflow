import type { User } from "@/types/database";
import { DEFAULT_PROFILE_EFFECTS } from "@/lib/profile-effects";
import { isPro } from "@/lib/plans";
import { normalizePlan } from "@/lib/plans";

/** Retire les options Pro pour l'affichage public si plan gratuit. */
export function sanitizePublicProfile(user: User): User {
  const plan = normalizePlan(user.plan);

  if (isPro(plan)) {
    return { ...user, plan };
  }

  return {
    ...user,
    plan,
    audio_url: null,
    background_url: null,
    background_type: null,
    effects_enabled: {
      particles: false,
      glass: true,
      glow: false,
      entrance: true,
    },
    volume: user.volume ?? 0.7,
  };
}

export function normalizeUserRow(row: Record<string, unknown>): User {
  return {
    id: row.id as string,
    username: row.username as string,
    email: row.email as string,
    avatar: (row.avatar as string | null) ?? null,
    bio: (row.bio as string) ?? "",
    theme: (row.theme as string) ?? "#2563eb",
    plan: normalizePlan(row.plan as string),
    audio_url: (row.audio_url as string | null) ?? null,
    background_url: (row.background_url as string | null) ?? null,
    background_type: (row.background_type as User["background_type"]) ?? null,
    effects_enabled:
      row.effects_enabled != null
        ? (row.effects_enabled as User["effects_enabled"])
        : DEFAULT_PROFILE_EFFECTS,
    volume: typeof row.volume === "number" ? row.volume : 0.7,
    created_at: row.created_at as string | undefined,
    updated_at: row.updated_at as string | undefined,
  };
}
