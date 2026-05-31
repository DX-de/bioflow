"use client";

import type { User } from "@/types/database";
import { SectionCard } from "@/components/customize/section-card";
import { SliderField } from "@/components/customize/field-controls";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type GeneralSectionProps = {
  draft: User;
  onChange: (patch: Partial<User>) => void;
};

export function GeneralSection({ draft, onChange }: GeneralSectionProps) {
  return (
    <SectionCard
      title="General Customization"
      description="Texte et dimensions de la carte profil"
    >
      <div className="space-y-5">
        <Textarea
          label="Description"
          value={draft.bio}
          onChange={(e) => onChange({ bio: e.target.value })}
          maxLength={160}
          placeholder="Votre bio..."
        />
        <Input
          label="Location"
          value={draft.location ?? ""}
          onChange={(e) => onChange({ location: e.target.value })}
          placeholder="Paris, France"
          maxLength={60}
        />
        <SliderField
          label="Opacité carte"
          value={Math.round((draft.profile_opacity ?? 1) * 100)}
          min={20}
          max={100}
          unit="%"
          onChange={(v) => onChange({ profile_opacity: v / 100 })}
        />
        <SliderField
          label="Flou carte"
          value={draft.profile_blur ?? 0}
          min={0}
          max={40}
          unit="px"
          onChange={(v) => onChange({ profile_blur: v })}
        />
        <SliderField
          label="Border radius"
          value={draft.border_radius ?? 24}
          min={0}
          max={48}
          unit="px"
          onChange={(v) => onChange({ border_radius: v })}
        />
        <SliderField
          label="Largeur carte"
          value={draft.card_width ?? 100}
          min={70}
          max={100}
          unit="%"
          onChange={(v) => onChange({ card_width: v })}
        />
        <SliderField
          label="Taille avatar"
          value={draft.avatar_size ?? 128}
          min={80}
          max={200}
          unit="px"
          onChange={(v) => onChange({ avatar_size: v })}
        />
      </div>
    </SectionCard>
  );
}
