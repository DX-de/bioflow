import type {
  AvatarAnimation,
  EffectType,
  PageTransition,
  User,
  UsernameEffect,
} from "@/types/database";
import { getTheme, type ThemePreset } from "@/lib/themes";
import {
  clampBlur,
  clampOpacity,
  parseEffectType,
  parseProfileAnimation,
} from "@/lib/profile-effects";

export type ResolvedProfileStyle = {
  preset: ThemePreset;
  accent: string;
  text: string;
  textMuted: string;
  bgBase: string;
  bgGradient: string;
  glassBg: string;
  glassBorder: string;
  icon: string;
  glow: string;
  buttonBg: string;
  buttonText: string;
  primary: string;
  secondary: string;
  gradientEnabled: boolean;
  profileOpacity: number;
  profileBlur: number;
  borderRadius: number;
  cardWidth: number;
  avatarSize: number;
  backgroundEffect: EffectType;
  usernameEffect: UsernameEffect;
  avatarAnimation: AvatarAnimation;
  pageTransition: PageTransition;
  cursorTrail: boolean;
  customCursorUrl: string | null;
};

function pickColor(custom: string | null | undefined, fallback: string): string {
  if (custom && /^#[0-9a-fA-F]{3,8}$/.test(custom.trim())) return custom.trim();
  return fallback;
}

export function parseUsernameEffect(raw: unknown): UsernameEffect {
  const v = ["none", "glow", "pulse", "glitch", "sparkle"];
  return v.includes(raw as string) ? (raw as UsernameEffect) : "none";
}

export function parseAvatarAnimation(raw: unknown): AvatarAnimation {
  const v = ["none", "float", "pulse", "rotate-slow"];
  return v.includes(raw as string) ? (raw as AvatarAnimation) : "none";
}

export function parsePageTransition(raw: unknown): PageTransition {
  const v = ["fade", "zoom", "slide", "none"];
  if (v.includes(raw as string)) return raw as PageTransition;
  const legacy = parseProfileAnimation(raw);
  if (legacy === "scale") return "zoom";
  if (legacy === "slide") return "slide";
  if (legacy === "none") return "none";
  return "fade";
}

export function parseBackgroundEffect(
  row: Record<string, unknown>
): EffectType {
  if (row.background_effect) {
    return parseEffectType(row.background_effect);
  }
  return parseEffectType(row.effect_type);
}

export function clampRadius(px: number | null | undefined): number {
  if (px == null || Number.isNaN(px)) return 24;
  return Math.min(48, Math.max(0, Math.round(px)));
}

export function clampCardWidth(pct: number | null | undefined): number {
  if (pct == null || Number.isNaN(pct)) return 100;
  return Math.min(100, Math.max(70, Math.round(pct)));
}

export function clampAvatarSize(px: number | null | undefined): number {
  if (px == null || Number.isNaN(px)) return 128;
  return Math.min(200, Math.max(80, Math.round(px)));
}

export function resolveProfileStyle(user: User): ResolvedProfileStyle {
  const preset = getTheme(user.theme);

  return {
    preset,
    accent: pickColor(user.accent_color, preset.accent),
    text: pickColor(user.text_color, preset.textPrimary),
    textMuted: preset.textMuted,
    bgBase: pickColor(user.background_color, preset.bgBase),
    bgGradient: preset.bgGradient,
    glassBg: preset.glassBg,
    glassBorder: preset.glassBorder,
    icon: pickColor(user.icon_color, preset.accent),
    glow: pickColor(user.glow_color, preset.accent),
    buttonBg: pickColor(user.button_color, preset.accent),
    buttonText: pickColor(user.button_text_color, "#ffffff"),
    primary: pickColor(user.primary_color, preset.accent),
    secondary: pickColor(user.secondary_color, preset.accentSecondary),
    gradientEnabled: Boolean(user.gradient_enabled),
    profileOpacity: clampOpacity(user.profile_opacity ?? 1),
    profileBlur: clampBlur(user.profile_blur),
    borderRadius: clampRadius(user.border_radius),
    cardWidth: clampCardWidth(user.card_width),
    avatarSize: clampAvatarSize(user.avatar_size),
    backgroundEffect: user.background_effect ?? user.effect_type ?? "none",
    usernameEffect: user.username_effect ?? "none",
    avatarAnimation: user.avatar_animation ?? "none",
    pageTransition: user.page_transition ?? "fade",
    cursorTrail: user.cursor_effect === "trail",
    customCursorUrl: user.cursor_url,
  };
}

export const DEFAULT_USER_CUSTOM_FIELDS: Pick<
  User,
  | "location"
  | "audio_loop"
  | "profile_opacity"
  | "profile_blur"
  | "border_radius"
  | "card_width"
  | "avatar_size"
  | "background_effect"
  | "username_effect"
  | "avatar_animation"
  | "page_transition"
  | "gradient_enabled"
> = {
  location: "",
  audio_loop: true,
  profile_opacity: 1,
  profile_blur: 0,
  border_radius: 24,
  card_width: 100,
  avatar_size: 128,
  background_effect: "none",
  username_effect: "none",
  avatar_animation: "none",
  page_transition: "fade",
  gradient_enabled: false,
};
