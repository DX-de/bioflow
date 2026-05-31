import type { ProfileEffects } from "@/types/database";

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

export function clampVolume(value: number | null | undefined): number {
  if (value == null || Number.isNaN(value)) return 0.7;
  return Math.min(1, Math.max(0, value));
}
