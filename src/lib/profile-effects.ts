import type {
  CursorEffect,
  EffectType,
  ProfileAnimation,
  ProfileEffects,
} from "@/types/database";

export const DEFAULT_PROFILE_EFFECTS: ProfileEffects = {
  particles: false,
  glass: true,
  glow: true,
  entrance: true,
};

export function parseProfileEffects(raw: unknown): ProfileEffects {
  if (!raw || typeof raw !== "object") {
    return { ...DEFAULT_PROFILE_EFFECTS };
  }
  const o = raw as Record<string, unknown>;
  return {
    particles: Boolean(o.particles),
    glass: o.glass !== false,
    glow: o.glow !== false,
    entrance: o.entrance !== false,
  };
}

export function parseEffectType(raw: unknown): EffectType {
  const valid: EffectType[] = ["none", "particles", "rain", "snow", "stars"];
  if (typeof raw === "string" && valid.includes(raw as EffectType)) {
    return raw as EffectType;
  }
  return "none";
}

export function parseCursorEffect(raw: unknown): CursorEffect {
  if (raw === "trail") return "trail";
  return "none";
}

export function parseProfileAnimation(raw: unknown): ProfileAnimation {
  const valid: ProfileAnimation[] = ["none", "fade", "scale", "slide"];
  if (typeof raw === "string" && valid.includes(raw as ProfileAnimation)) {
    return raw as ProfileAnimation;
  }
  return "fade";
}

export function clampVolume(value: number | null | undefined): number {
  if (value == null || Number.isNaN(value)) return 0.7;
  return Math.min(1, Math.max(0, value));
}

export function clampBlur(px: number | null | undefined): number {
  if (px == null || Number.isNaN(px)) return 0;
  return Math.min(40, Math.max(0, Math.round(px)));
}

export function clampOpacity(value: number | null | undefined): number {
  if (value == null || Number.isNaN(value)) return 0.55;
  return Math.min(1, Math.max(0, value));
}
