"use client";

import type { User } from "@/types/database";
import { SectionCard } from "@/components/customize/section-card";
import { ColorField, ToggleField } from "@/components/customize/field-controls";
import { getTheme } from "@/lib/themes";
import { ProGate } from "@/components/ui/pro-gate";
import { isPro } from "@/lib/plans";

type ColorsSectionProps = {
  draft: User;
  onChange: (patch: Partial<User>) => void;
};

export function ColorsSection({ draft, onChange }: ColorsSectionProps) {
  const pro = isPro(draft.plan);
  const preset = getTheme(draft.theme);

  const accent = draft.accent_color ?? preset.accent;
  const text = draft.text_color ?? preset.textPrimary;
  const bg = draft.background_color ?? preset.bgBase;
  const icon = draft.icon_color ?? preset.accent;
  const primary = draft.primary_color ?? preset.accent;
  const secondary = draft.secondary_color ?? preset.accentSecondary;
  const glow = draft.glow_color ?? preset.accent;
  const btn = draft.button_color ?? preset.accent;
  const btnText = draft.button_text_color ?? "#ffffff";

  return (
    <SectionCard
      title="Colors & Theme Builder"
      description="Couleurs personnalisées — prioritaires sur le preset"
    >
      <ProGate locked={!pro}>
        <div className="grid sm:grid-cols-2 gap-4">
          <ColorField
            label="Accent"
            value={accent}
            disabled={!pro}
            onChange={(v) => onChange({ accent_color: v })}
          />
          <ColorField
            label="Texte"
            value={text}
            disabled={!pro}
            onChange={(v) => onChange({ text_color: v })}
          />
          <ColorField
            label="Fond"
            value={bg}
            disabled={!pro}
            onChange={(v) => onChange({ background_color: v })}
          />
          <ColorField
            label="Icônes"
            value={icon}
            disabled={!pro}
            onChange={(v) => onChange({ icon_color: v })}
          />
          <ColorField
            label="Gradient primaire"
            value={primary}
            disabled={!pro}
            onChange={(v) => onChange({ primary_color: v })}
          />
          <ColorField
            label="Gradient secondaire"
            value={secondary}
            disabled={!pro}
            onChange={(v) => onChange({ secondary_color: v })}
          />
          <ColorField
            label="Glow"
            value={glow}
            disabled={!pro}
            onChange={(v) => onChange({ glow_color: v })}
          />
          <ColorField
            label="Boutons"
            value={btn}
            disabled={!pro}
            onChange={(v) => onChange({ button_color: v })}
          />
          <ColorField
            label="Texte boutons"
            value={btnText}
            disabled={!pro}
            onChange={(v) => onChange({ button_text_color: v })}
          />
        </div>
        <div className="mt-4">
          <ToggleField
            label="Activer le dégradé sur le pseudo"
            checked={Boolean(draft.gradient_enabled)}
            disabled={!pro}
            onChange={(v) => onChange({ gradient_enabled: v })}
          />
        </div>
      </ProGate>
    </SectionCard>
  );
}
