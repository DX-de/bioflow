"use client";

import type {
  AvatarAnimation,
  CursorEffect,
  EffectType,
  PageTransition,
  ProfileEffects,
  UsernameEffect,
  User,
} from "@/types/database";
import { SectionCard } from "@/components/customize/section-card";
import { ToggleField } from "@/components/customize/field-controls";
import { ProGate } from "@/components/ui/pro-gate";
import { isPro } from "@/lib/plans";
import { cn } from "@/lib/utils";

const BG_EFFECTS: { id: EffectType; label: string }[] = [
  { id: "none", label: "Aucun" },
  { id: "snow", label: "Neige" },
  { id: "stars", label: "Étoiles" },
  { id: "rain", label: "Pluie" },
  { id: "particles", label: "Particules" },
];

const USERNAME_FX: { id: UsernameEffect; label: string }[] = [
  { id: "none", label: "Aucun" },
  { id: "glow", label: "Glow" },
  { id: "pulse", label: "Pulse" },
  { id: "glitch", label: "Glitch" },
  { id: "sparkle", label: "Sparkle" },
];

const AVATAR_FX: { id: AvatarAnimation; label: string }[] = [
  { id: "none", label: "Aucune" },
  { id: "float", label: "Float" },
  { id: "pulse", label: "Pulse" },
  { id: "rotate-slow", label: "Rotation" },
];

const PAGE_FX: { id: PageTransition; label: string }[] = [
  { id: "fade", label: "Fade" },
  { id: "zoom", label: "Zoom" },
  { id: "slide", label: "Slide" },
  { id: "none", label: "Aucune" },
];

function ChipGroup<T extends string>({
  options,
  value,
  disabled,
  onSelect,
}: {
  options: { id: T; label: string }[];
  value: T;
  disabled?: boolean;
  onSelect: (id: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(o.id)}
          className={cn(
            "rounded-lg px-3 py-1.5 text-xs border transition",
            value === o.id
              ? "border-violet-500 bg-violet-600/20 text-violet-200"
              : "border-zinc-700 text-zinc-400 hover:border-zinc-600",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

type EffectsSectionProps = {
  draft: User;
  effects: ProfileEffects;
  onChange: (patch: Partial<User>) => void;
  onEffectsChange: (fx: ProfileEffects) => void;
};

export function EffectsSection({
  draft,
  effects,
  onChange,
  onEffectsChange,
}: EffectsSectionProps) {
  const pro = isPro(draft.plan);
  const bg = draft.background_effect ?? draft.effect_type ?? "none";

  return (
    <SectionCard title="Visual Effects" description="Effets de fond et animations">
      <ProGate locked={!pro}>
        <div className="space-y-6">
          <div>
            <p className="text-sm text-zinc-400 mb-2">Background effects</p>
            <ChipGroup
              options={BG_EFFECTS}
              value={bg}
              disabled={!pro}
              onSelect={(id) =>
                onChange({ background_effect: id, effect_type: id })
              }
            />
          </div>
          <div>
            <p className="text-sm text-zinc-400 mb-2">Username effects</p>
            <ChipGroup
              options={USERNAME_FX}
              value={draft.username_effect ?? "none"}
              disabled={!pro}
              onSelect={(id) => onChange({ username_effect: id })}
            />
          </div>
          <div>
            <p className="text-sm text-zinc-400 mb-2">Avatar animation</p>
            <ChipGroup
              options={AVATAR_FX}
              value={draft.avatar_animation ?? "none"}
              disabled={!pro}
              onSelect={(id) => onChange({ avatar_animation: id })}
            />
          </div>
          <div>
            <p className="text-sm text-zinc-400 mb-2">Page transition</p>
            <ChipGroup
              options={PAGE_FX}
              value={draft.page_transition ?? "fade"}
              disabled={!pro}
              onSelect={(id) => onChange({ page_transition: id })}
            />
          </div>
          <ToggleField
            label="Cursor trail"
            checked={draft.cursor_effect === "trail"}
            disabled={!pro}
            onChange={(v) =>
              onChange({ cursor_effect: (v ? "trail" : "none") as CursorEffect })
            }
          />
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800">
            <ToggleField
              label="Glass card"
              checked={effects.glass}
              disabled={!pro}
              onChange={() => onEffectsChange({ ...effects, glass: !effects.glass })}
            />
            <ToggleField
              label="Glow"
              checked={effects.glow}
              disabled={!pro}
              onChange={() => onEffectsChange({ ...effects, glow: !effects.glow })}
            />
          </div>
        </div>
      </ProGate>
    </SectionCard>
  );
}
