"use client";

import type { User } from "@/types/database";
import { SectionCard } from "@/components/customize/section-card";
import { SliderField, ToggleField } from "@/components/customize/field-controls";
import { Input } from "@/components/ui/input";
import { ProGate } from "@/components/ui/pro-gate";
import { isPro } from "@/lib/plans";

type AudioSectionProps = {
  draft: User;
  onChange: (patch: Partial<User>) => void;
};

export function AudioSection({ draft, onChange }: AudioSectionProps) {
  const pro = isPro(draft.plan);

  return (
    <SectionCard
      title="Audio Player"
      description="Lecture uniquement après « Clique pour entrer »"
    >
      <ProGate locked={!pro}>
        <div className="space-y-4">
          <Input
            label="URL audio (optionnel si import Assets)"
            value={draft.audio_url ?? ""}
            onChange={(e) => onChange({ audio_url: e.target.value || null })}
            disabled={!pro}
            placeholder="https://..."
          />
          <Input
            label="Titre affiché"
            value={draft.audio_title ?? ""}
            onChange={(e) => onChange({ audio_title: e.target.value })}
            disabled={!pro}
          />
          <SliderField
            label="Volume"
            value={Math.round((draft.volume ?? 0.7) * 100)}
            min={0}
            max={100}
            unit="%"
            disabled={!pro}
            onChange={(v) => onChange({ volume: v / 100 })}
          />
          <ToggleField
            label="Lecture en boucle"
            checked={draft.audio_loop !== false}
            disabled={!pro}
            onChange={(v) => onChange({ audio_loop: v })}
          />
        </div>
      </ProGate>
    </SectionCard>
  );
}
