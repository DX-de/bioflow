"use client";

import type { BioThemeId, User } from "@/types/database";
import { SectionCard } from "@/components/customize/section-card";
import { THEME_LIST } from "@/lib/themes";
import { canUseThemeId, isPro, PRO_LOCKED_MESSAGE } from "@/lib/plans";
import { UpgradeButton } from "@/components/pricing/upgrade-button";
import { cn } from "@/lib/utils";
import { Crown } from "lucide-react";

type ThemesSectionProps = {
  draft: User;
  onChange: (patch: Partial<User>) => void;
};

export function ThemesSection({ draft, onChange }: ThemesSectionProps) {
  const pro = isPro(draft.plan);

  return (
    <SectionCard title="Preset Themes" description="Thèmes complets BioFlow">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {THEME_LIST.map((t) => {
          const locked = !canUseThemeId(draft.plan, t.id);
          return (
            <button
              key={t.id}
              type="button"
              disabled={locked}
              onClick={() => !locked && onChange({ theme: t.id as BioThemeId })}
              className={cn(
                "rounded-xl border p-3 text-left transition",
                draft.theme === t.id
                  ? "border-violet-500 ring-1 ring-violet-500/40"
                  : "border-zinc-700 hover:border-zinc-600",
                locked && "opacity-50 cursor-not-allowed"
              )}
            >
              <div
                className="h-10 rounded-lg mb-2"
                style={{ background: t.bgGradient }}
              />
              <span className="text-sm font-medium text-zinc-200">{t.name}</span>
              {t.proOnly && (
                <span className="ml-1.5 inline-flex items-center gap-0.5 text-[10px] uppercase text-amber-400 font-bold">
                  <Crown className="h-3 w-3" />
                  Pro
                </span>
              )}
            </button>
          );
        })}
      </div>
      {!pro && (
        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="text-xs text-zinc-400 flex-1">{PRO_LOCKED_MESSAGE}</p>
          <UpgradeButton size="sm" />
        </div>
      )}
    </SectionCard>
  );
}
