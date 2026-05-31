"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Link as BioLink, ProfileEffects, User } from "@/types/database";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { AssetsStudio } from "@/components/customize/assets-studio";
import { LivePreviewPanel } from "@/components/customize/live-preview-panel";
import { GeneralSection } from "@/components/customize/general-section";
import { AudioSection } from "@/components/customize/audio-section";
import { EffectsSection } from "@/components/customize/effects-section";
import { ColorsSection } from "@/components/customize/colors-section";
import { ThemesSection } from "@/components/customize/themes-section";
import {
  buildUserCustomizePayload,
  sanitizePublicProfile,
} from "@/lib/sanitize-profile";
import {
  DEFAULT_PROFILE_EFFECTS,
  parseProfileEffects,
} from "@/lib/profile-effects";
import { validateHttpsMediaUrl } from "@/lib/validate-media-url";
import {
  canUseCustomBackground,
  canUseProfileMusic,
  canUseThemeId,
  canUseVideoBackground,
  canUseVisualEffects,
  isPro,
} from "@/lib/plans";
import type { BioThemeId } from "@/types/database";
import { ArrowLeft, Save } from "lucide-react";

type CustomizeClientProps = {
  user: User;
  links: BioLink[];
  email: string;
};

export function CustomizeClient({
  user: initialUser,
  links,
  email,
}: CustomizeClientProps) {
  const router = useRouter();
  const supabase = createClient();

  const [draft, setDraft] = useState<User>(initialUser);
  const [effects, setEffects] = useState<ProfileEffects>(
    parseProfileEffects(initialUser.effects_enabled)
  );
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("mobile");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const previewUser = useMemo(
    () => sanitizePublicProfile({ ...draft, effects_enabled: effects }),
    [draft, effects]
  );

  function patch(p: Partial<User>) {
    setDraft((d) => ({ ...d, ...p }));
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const themeId = (draft.theme || "classic") as BioThemeId;
      if (!canUseThemeId(draft.plan, themeId)) {
        throw new Error("Thème réservé au plan Pro.");
      }

      let audio_url = draft.audio_url;
      let background_url = draft.background_url;
      let background_type = draft.background_type;
      let cursor_url = draft.cursor_url;

      if (canUseProfileMusic(draft.plan) && audio_url?.trim()) {
        const check = validateHttpsMediaUrl(audio_url, "audio");
        if (!check.ok) throw new Error(check.error);
        audio_url = check.url || null;
      } else if (!isPro(draft.plan)) {
        audio_url = null;
      }

      if (canUseCustomBackground(draft.plan) && background_url?.trim()) {
        const kind =
          background_type === "gif"
            ? "gif"
            : background_type === "video"
              ? "video"
              : "image";
        if (background_type === "video" && !canUseVideoBackground(draft.plan)) {
          throw new Error("Fond vidéo réservé au plan Pro.");
        }
        const check = validateHttpsMediaUrl(background_url, kind);
        if (!check.ok) throw new Error(check.error);
        background_url = check.url || null;
        background_type = background_url ? background_type : null;
      } else if (!isPro(draft.plan)) {
        background_url = null;
        background_type = null;
      }

      if (isPro(draft.plan) && cursor_url?.trim()) {
        const check = validateHttpsMediaUrl(cursor_url, "image");
        if (!check.ok) throw new Error(check.error);
        cursor_url = check.url || null;
      } else if (!isPro(draft.plan)) {
        cursor_url = null;
      }

      const payload = buildUserCustomizePayload({
        ...draft,
        audio_url,
        background_url,
        background_type,
        cursor_url,
        effects_enabled: canUseVisualEffects(draft.plan)
          ? effects
          : DEFAULT_PROFILE_EFFECTS,
      });

      const { data, error: updateError } = await supabase
        .from("users")
        .update(payload)
        .eq("id", draft.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setDraft({ ...draft, ...(data as User) });
      setMessage("Personnalisation enregistrée.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100">
      <Header user={{ email }} onLogout={handleLogout} />

      <div className="border-b border-zinc-800/80 bg-zinc-900/40">
        <div className="mx-auto max-w-[1600px] px-4 py-4 flex flex-wrap items-center gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">Customize Studio</h1>
            <p className="text-sm text-zinc-500">
              Personnalisation avancée — @{draft.username}
            </p>
          </div>
          <Button
            type="submit"
            form="customize-form"
            loading={saving}
            className="ml-auto"
          >
            <Save className="h-4 w-4" />
            Enregistrer
          </Button>
        </div>
      </div>

      <form
        id="customize-form"
        onSubmit={handleSave}
        className="mx-auto max-w-[1600px] px-4 py-6"
      >
        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-6 min-w-0">
            <AssetsStudio
              draft={draft}
              supabase={supabase}
              onChange={patch}
              onError={setError}
            />
            <GeneralSection draft={draft} onChange={patch} />
            <AudioSection draft={draft} onChange={patch} />
            <EffectsSection
              draft={draft}
              effects={effects}
              onChange={patch}
              onEffectsChange={setEffects}
            />
            <ColorsSection draft={draft} onChange={patch} />
            <ThemesSection draft={draft} onChange={patch} />

            {error && (
              <p className="text-sm text-red-400 bg-red-950/40 border border-red-900/50 rounded-xl px-4 py-3">
                {error}
              </p>
            )}
            {message && (
              <p className="text-sm text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 rounded-xl px-4 py-3">
                {message}
              </p>
            )}
          </div>

          <LivePreviewPanel
            user={previewUser}
            links={links}
            previewMode={previewMode}
            onPreviewModeChange={setPreviewMode}
          />
        </div>
      </form>
    </div>
  );
}
