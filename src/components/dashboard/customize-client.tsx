"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type {
  BackgroundType,
  BioThemeId,
  CursorEffect,
  EffectType,
  Link as BioLink,
  ProfileAnimation,
  ProfileEffects,
  User,
} from "@/types/database";
import { PublicProfile } from "@/components/profile/public-profile";
import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProGate } from "@/components/ui/pro-gate";
import { UpgradeButton } from "@/components/pricing/upgrade-button";
import { THEME_LIST, getTheme } from "@/lib/themes";
import {
  canUseBackgroundType,
  canUseCustomBackground,
  canUseProfileMusic,
  canUseThemeId,
  canUseVideoBackground,
  canUseVisualEffects,
  isPro,
  PRO_LOCKED_MESSAGE,
} from "@/lib/plans";
import {
  DEFAULT_PROFILE_EFFECTS,
  parseProfileEffects,
  clampVolume,
  clampBlur,
  clampOpacity,
} from "@/lib/profile-effects";
import { validateHttpsMediaUrl } from "@/lib/validate-media-url";
import { sanitizePublicProfile } from "@/lib/sanitize-profile";
import { cn } from "@/lib/utils";
import {
  uploadProfileAudio,
  MAX_PROFILE_AUDIO_BYTES,
} from "@/lib/upload-profile-audio";
import { ArrowLeft, Crown, Music, Save, Trash2, Upload } from "lucide-react";

type CustomizeClientProps = {
  user: User;
  links: BioLink[];
  email: string;
};

const BG_TYPES: { id: BackgroundType; label: string }[] = [
  { id: "image", label: "Image" },
  { id: "gif", label: "GIF" },
  { id: "video", label: "Vidéo" },
];

const EFFECT_TYPES: { id: EffectType; label: string }[] = [
  { id: "none", label: "Aucun" },
  { id: "particles", label: "Particules" },
  { id: "rain", label: "Pluie" },
  { id: "snow", label: "Neige" },
  { id: "stars", label: "Étoiles" },
];

const PROFILE_ANIMATIONS: { id: ProfileAnimation; label: string }[] = [
  { id: "fade", label: "Fondu" },
  { id: "scale", label: "Zoom" },
  { id: "slide", label: "Glissement" },
  { id: "none", label: "Aucune" },
];

export function CustomizeClient({
  user: initialUser,
  links,
  email,
}: CustomizeClientProps) {
  const router = useRouter();
  const supabase = createClient();
  const pro = isPro(initialUser.plan);

  const [draft, setDraft] = useState<User>(initialUser);
  const [effects, setEffects] = useState<ProfileEffects>(
    parseProfileEffects(initialUser.effects_enabled)
  );
  const [saving, setSaving] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const previewUser = useMemo(
    () => sanitizePublicProfile({ ...draft, effects_enabled: effects }),
    [draft, effects]
  );

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  function setField<K extends keyof User>(key: K, value: User[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function toggleEffect(key: keyof ProfileEffects) {
    if (!pro) return;
    setEffects((e) => ({ ...e, [key]: !e[key] }));
  }

  async function handleAudioFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !pro) return;

    setUploadingAudio(true);
    setError(null);
    setMessage(null);

    try {
      const url = await uploadProfileAudio(supabase, draft.id, file);
      setField("audio_url", url);
      if (!draft.audio_title?.trim()) {
        const name = file.name.replace(/\.[^.]+$/, "");
        setField("audio_title", name.slice(0, 80));
      }
      setMessage("Fichier audio importé — cliquez sur Enregistrer pour publier.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l’upload");
    } finally {
      setUploadingAudio(false);
      if (audioInputRef.current) audioInputRef.current.value = "";
    }
  }

  function clearAudio() {
    setField("audio_url", null);
    setMessage("Musique retirée — enregistrez pour appliquer.");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      let finalAudio: string | null = null;
      let finalBg: string | null = null;
      let finalBgType: BackgroundType | null = null;
      const themeId = (draft.theme || "classic") as BioThemeId;

      if (!canUseThemeId(draft.plan, themeId)) {
        throw new Error(PRO_LOCKED_MESSAGE);
      }

      if (canUseProfileMusic(draft.plan) && draft.audio_url?.trim()) {
        const audioCheck = validateHttpsMediaUrl(draft.audio_url, "audio");
        if (!audioCheck.ok) throw new Error(audioCheck.error);
        finalAudio = audioCheck.url || null;
      }

      if (canUseCustomBackground(draft.plan) && draft.background_url?.trim()) {
        const bgType = draft.background_type ?? "image";
        if (!canUseBackgroundType(draft.plan, bgType)) {
          throw new Error(PRO_LOCKED_MESSAGE);
        }
        if (bgType === "video" && !canUseVideoBackground(draft.plan)) {
          throw new Error(PRO_LOCKED_MESSAGE);
        }
        const kind =
          bgType === "gif" ? "gif" : bgType === "video" ? "video" : "image";
        const bgCheck = validateHttpsMediaUrl(draft.background_url, kind);
        if (!bgCheck.ok) throw new Error(bgCheck.error);
        finalBg = bgCheck.url || null;
        finalBgType = finalBg ? bgType : null;
      }

      const payload = {
        bio: draft.bio,
        theme: themeId,
        audio_url: finalAudio,
        audio_title: pro ? draft.audio_title || null : null,
        volume: clampVolume(draft.volume),
        background_url: finalBg,
        background_type: finalBgType,
        background_blur: pro ? clampBlur(draft.background_blur) : 0,
        background_opacity: pro ? clampOpacity(draft.background_opacity) : 0.55,
        effect_type: pro ? draft.effect_type : "none",
        cursor_effect: pro ? draft.cursor_effect : "none",
        profile_animation: draft.profile_animation ?? "fade",
        effects_enabled: canUseVisualEffects(draft.plan)
          ? effects
          : DEFAULT_PROFILE_EFFECTS,
      };

      const { data, error: updateError } = await supabase
        .from("users")
        .update(payload)
        .eq("id", draft.id)
        .select()
        .single();

      if (updateError) throw updateError;

      const updated = { ...draft, ...data } as User;
      setDraft(updated);
      setMessage("Personnalisation enregistrée");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-dvh bg-slate-50">
      <Header user={{ email }} onLogout={handleLogout} />
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6 flex items-center gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Personnaliser</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <form onSubmit={handleSave} className="space-y-6">
            <Card>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Bio</h2>
              <Input
                label="Bio"
                value={draft.bio}
                onChange={(e) => setField("bio", e.target.value)}
                maxLength={160}
              />
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Thème</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {THEME_LIST.map((t) => {
                  const locked = !canUseThemeId(draft.plan, t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      disabled={locked}
                      onClick={() => !locked && setField("theme", t.id)}
                      className={cn(
                        "relative rounded-xl border p-3 text-left transition",
                        draft.theme === t.id
                          ? "border-blue-500 ring-2 ring-blue-200"
                          : "border-slate-200 hover:border-slate-300",
                        locked && "opacity-60 cursor-not-allowed"
                      )}
                    >
                      <div
                        className="h-8 rounded-lg mb-2"
                        style={{ background: t.bgGradient }}
                      />
                      <span className="text-sm font-medium text-slate-900">
                        {t.name}
                      </span>
                      {t.proOnly && (
                        <span className="ml-2 text-[10px] uppercase text-amber-600 font-bold">
                          Pro
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {!pro && (
                <p className="mt-3 text-xs text-slate-500">{PRO_LOCKED_MESSAGE}</p>
              )}
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                Musique
                {!pro && <Crown className="h-4 w-4 text-amber-500" />}
              </h2>
              <ProGate locked={!pro}>
                <div className="space-y-4">
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                    <p className="text-sm font-medium text-slate-800 mb-2">
                      Importer un fichier
                    </p>
                    <p className="text-xs text-slate-500 mb-3">
                      MP3, WAV, OGG ou M4A — max{" "}
                      {Math.round(MAX_PROFILE_AUDIO_BYTES / 1024 / 1024)} Mo
                    </p>
                    <input
                      ref={audioInputRef}
                      type="file"
                      accept="audio/mpeg,audio/wav,audio/ogg,audio/mp4,audio/x-m4a,.mp3,.wav,.ogg,.m4a"
                      className="hidden"
                      disabled={!pro || uploadingAudio}
                      onChange={handleAudioFileUpload}
                    />
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        disabled={!pro || uploadingAudio}
                        onClick={() => audioInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4" />
                        {uploadingAudio ? "Import…" : "Choisir un fichier"}
                      </Button>
                      {draft.audio_url && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={!pro || uploadingAudio}
                          onClick={clearAudio}
                        >
                          <Trash2 className="h-4 w-4" />
                          Retirer
                        </Button>
                      )}
                    </div>
                    {draft.audio_url && (
                      <p className="mt-3 flex items-center gap-2 text-xs text-emerald-700">
                        <Music className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">
                          {draft.audio_title || "Piste prête à enregistrer"}
                        </span>
                      </p>
                    )}
                  </div>

                  <p className="text-center text-xs text-slate-400">ou lien direct</p>

                  <Input
                    label="URL audio (HTTPS, .mp3/.wav/.ogg)"
                    value={draft.audio_url ?? ""}
                    onChange={(e) => setField("audio_url", e.target.value)}
                    placeholder="https://..."
                    disabled={!pro}
                  />
                  <Input
                    label="Titre affiché"
                    value={draft.audio_title ?? ""}
                    onChange={(e) => setField("audio_title", e.target.value)}
                    placeholder="Ma track"
                    disabled={!pro}
                  />
                  <label className="block text-sm text-slate-700">
                    Volume ({Math.round((draft.volume ?? 0.7) * 100)}%)
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={Math.round((draft.volume ?? 0.7) * 100)}
                      onChange={(e) =>
                        setField("volume", parseInt(e.target.value, 10) / 100)
                      }
                      className="mt-2 w-full"
                      disabled={!pro}
                    />
                  </label>
                </div>
              </ProGate>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                Fond
                {!pro && <Crown className="h-4 w-4 text-amber-500" />}
              </h2>
              <ProGate locked={!pro}>
                <div className="space-y-4">
                  <Input
                    label="URL du fond"
                    value={draft.background_url ?? ""}
                    onChange={(e) => setField("background_url", e.target.value)}
                    disabled={!pro}
                  />
                  <div className="flex flex-wrap gap-2">
                    {BG_TYPES.map((bt) => (
                      <button
                        key={bt.id}
                        type="button"
                        disabled={!pro}
                        onClick={() => setField("background_type", bt.id)}
                        className={cn(
                          "rounded-lg px-3 py-1.5 text-sm border",
                          draft.background_type === bt.id
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-slate-200"
                        )}
                      >
                        {bt.label}
                      </button>
                    ))}
                  </div>
                  <label className="block text-sm text-slate-700">
                    Flou ({draft.background_blur ?? 0}px)
                    <input
                      type="range"
                      min={0}
                      max={40}
                      value={draft.background_blur ?? 0}
                      onChange={(e) =>
                        setField("background_blur", parseInt(e.target.value, 10))
                      }
                      className="mt-2 w-full"
                      disabled={!pro}
                    />
                  </label>
                  <label className="block text-sm text-slate-700">
                    Opacité média ({Math.round((draft.background_opacity ?? 0.55) * 100)}%)
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={Math.round((draft.background_opacity ?? 0.55) * 100)}
                      onChange={(e) =>
                        setField(
                          "background_opacity",
                          parseInt(e.target.value, 10) / 100
                        )
                      }
                      className="mt-2 w-full"
                      disabled={!pro}
                    />
                  </label>
                </div>
              </ProGate>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                Effets visuels
                {!pro && <Crown className="h-4 w-4 text-amber-500" />}
              </h2>
              <ProGate locked={!pro}>
                <div className="space-y-4">
                  <label className="text-sm text-slate-700">Effet de fond</label>
                  <div className="flex flex-wrap gap-2">
                    {EFFECT_TYPES.map((ef) => (
                      <button
                        key={ef.id}
                        type="button"
                        disabled={!pro}
                        onClick={() => setField("effect_type", ef.id)}
                        className={cn(
                          "rounded-lg px-3 py-1.5 text-sm border",
                          draft.effect_type === ef.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-200"
                        )}
                      >
                        {ef.label}
                      </button>
                    ))}
                  </div>
                  <label className="text-sm text-slate-700">Curseur</label>
                  <div className="flex gap-2">
                    {(["none", "trail"] as CursorEffect[]).map((c) => (
                      <button
                        key={c}
                        type="button"
                        disabled={!pro}
                        onClick={() => setField("cursor_effect", c)}
                        className={cn(
                          "rounded-lg px-3 py-1.5 text-sm border capitalize",
                          draft.cursor_effect === c
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-200"
                        )}
                      >
                        {c === "trail" ? "Traînée" : "Aucun"}
                      </button>
                    ))}
                  </div>
                  <label className="text-sm text-slate-700">Animation profil</label>
                  <div className="flex flex-wrap gap-2">
                    {PROFILE_ANIMATIONS.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => setField("profile_animation", a.id)}
                        className={cn(
                          "rounded-lg px-3 py-1.5 text-sm border",
                          draft.profile_animation === a.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-200"
                        )}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3 pt-2">
                    {(
                      [
                        ["glass", "Carte glass"],
                        ["glow", "Glow"],
                        ["entrance", "Entrée animée"],
                      ] as const
                    ).map(([key, label]) => (
                      <label
                        key={key}
                        className="flex items-center gap-2 text-sm text-slate-700"
                      >
                        <input
                          type="checkbox"
                          checked={effects[key]}
                          onChange={() => toggleEffect(key)}
                          disabled={!pro}
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
              </ProGate>
            </Card>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            {message && (
              <p className="text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">
                {message}
              </p>
            )}

            <Button type="submit" loading={saving} className="w-full sm:w-auto">
              <Save className="h-4 w-4" />
              Enregistrer
            </Button>
            {!pro && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm text-slate-700 mb-3">{PRO_LOCKED_MESSAGE}</p>
                <UpgradeButton />
              </div>
            )}
          </form>

          <div className="lg:sticky lg:top-6 h-fit">
            <Card className="overflow-hidden p-0">
              <div className="border-b border-slate-200 px-4 py-3 bg-white">
                <p className="text-sm font-medium text-slate-900">Aperçu live</p>
                <p className="text-xs text-slate-500">
                  Thème : {getTheme(previewUser.theme).name}
                </p>
              </div>
              <div className="relative h-[min(80dvh,720px)] overflow-hidden rounded-b-xl">
                <div className="absolute inset-0 scale-[0.85] origin-top">
                  <PublicProfile
                    user={previewUser}
                    links={links}
                    previewMode
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
