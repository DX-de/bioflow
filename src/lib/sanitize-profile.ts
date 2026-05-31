import type { User } from "@/types/database";
import {
  DEFAULT_PROFILE_EFFECTS,
  parseCursorEffect,
  parseProfileEffects,
  clampBlur,
  clampOpacity,
  clampVolume,
} from "@/lib/profile-effects";
import {
  DEFAULT_USER_CUSTOM_FIELDS,
  parseAvatarAnimation,
  parseBackgroundEffect,
  parsePageTransition,
  parseUsernameEffect,
  clampRadius,
  clampCardWidth,
  clampAvatarSize,
} from "@/lib/profile-settings";
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
    ...DEFAULT_USER_CUSTOM_FIELDS,
    plan,
    theme: "classic",
    audio_url: null,
    audio_title: null,
    cursor_url: null,
    background_url: null,
    background_type: null,
    background_blur: 0,
    background_opacity: 0.55,
    effect_type: "none",
    cursor_effect: "none",
    profile_animation: "fade",
    accent_color: null,
    text_color: null,
    background_color: null,
    icon_color: null,
    primary_color: null,
    secondary_color: null,
    gradient_enabled: false,
    glow_color: null,
    button_color: null,
    button_text_color: null,
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
  const bgEffect = parseBackgroundEffect(row);

  return {
    id: row.id as string,
    username: row.username as string,
    email: row.email as string,
    avatar: (row.avatar as string | null) ?? null,
    bio: (row.bio as string) ?? "",
    location: (row.location as string) ?? "",
    theme: (row.theme as string) ?? "classic",
    plan: normalizePlan(row.plan as string),
    audio_url: (row.audio_url as string | null) ?? null,
    audio_title: (row.audio_title as string | null) ?? null,
    volume: clampVolume(row.volume as number | undefined),
    audio_loop: row.audio_loop !== false,
    background_url: (row.background_url as string | null) ?? null,
    background_type: (row.background_type as User["background_type"]) ?? null,
    background_blur: clampBlur(row.background_blur as number | undefined),
    background_opacity: clampOpacity(
      row.background_opacity as number | undefined
    ),
    cursor_url: (row.cursor_url as string | null) ?? null,
    profile_opacity: clampOpacity(row.profile_opacity as number | undefined),
    profile_blur: clampBlur(row.profile_blur as number | undefined),
    border_radius: clampRadius(row.border_radius as number | undefined),
    card_width: clampCardWidth(row.card_width as number | undefined),
    avatar_size: clampAvatarSize(row.avatar_size as number | undefined),
    effects_enabled:
      row.effects_enabled != null
        ? parseProfileEffects(row.effects_enabled)
        : DEFAULT_PROFILE_EFFECTS,
    effect_type: bgEffect,
    background_effect: bgEffect,
    cursor_effect: parseCursorEffect(row.cursor_effect),
    profile_animation: "fade",
    username_effect: parseUsernameEffect(row.username_effect),
    avatar_animation: parseAvatarAnimation(row.avatar_animation),
    page_transition: parsePageTransition(row.page_transition ?? row.profile_animation),
    accent_color: (row.accent_color as string | null) ?? null,
    text_color: (row.text_color as string | null) ?? null,
    background_color: (row.background_color as string | null) ?? null,
    icon_color: (row.icon_color as string | null) ?? null,
    primary_color: (row.primary_color as string | null) ?? null,
    secondary_color: (row.secondary_color as string | null) ?? null,
    gradient_enabled: Boolean(row.gradient_enabled),
    glow_color: (row.glow_color as string | null) ?? null,
    button_color: (row.button_color as string | null) ?? null,
    button_text_color: (row.button_text_color as string | null) ?? null,
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

/** Payload DB à partir du draft utilisateur */
export function buildUserCustomizePayload(user: User) {
  const bg = user.background_effect ?? user.effect_type;
  return {
    bio: user.bio,
    location: user.location ?? "",
    theme: user.theme,
    audio_url: user.audio_url,
    audio_title: user.audio_title,
    volume: clampVolume(user.volume),
    audio_loop: user.audio_loop !== false,
    background_url: user.background_url,
    background_type: user.background_type,
    background_blur: clampBlur(user.background_blur),
    background_opacity: clampOpacity(user.background_opacity),
    cursor_url: user.cursor_url,
    avatar: user.avatar,
    profile_opacity: clampOpacity(user.profile_opacity),
    profile_blur: clampBlur(user.profile_blur),
    border_radius: clampRadius(user.border_radius),
    card_width: clampCardWidth(user.card_width),
    avatar_size: clampAvatarSize(user.avatar_size),
    effects_enabled: user.effects_enabled,
    effect_type: bg,
    background_effect: bg,
    cursor_effect: user.cursor_effect,
    profile_animation: user.page_transition === "zoom" ? "scale" : user.page_transition,
    page_transition: user.page_transition,
    username_effect: user.username_effect,
    avatar_animation: user.avatar_animation,
    accent_color: user.accent_color,
    text_color: user.text_color,
    background_color: user.background_color,
    icon_color: user.icon_color,
    primary_color: user.primary_color,
    secondary_color: user.secondary_color,
    gradient_enabled: user.gradient_enabled,
    glow_color: user.glow_color,
    button_color: user.button_color,
    button_text_color: user.button_text_color,
  };
}
