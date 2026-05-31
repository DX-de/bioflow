"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { BackgroundType, User } from "@/types/database";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UpgradeButton } from "@/components/pricing/upgrade-button";
import {
  canUseBackgroundType,
  canUseCustomBackground,
  canUseProfileMusic,
  canUseVideoBackground,
  canUseVisualEffects,
  isPro,
} from "@/lib/plans";
import {
  DEFAULT_PROFILE_EFFECTS,
  parseProfileEffects,
  clampVolume,
} from "@/lib/profile-effects";
import { validateHttpsMediaUrl } from "@/lib/validate-media-url";
import type { ProfileEffects } from "@/types/database";
import {
  ExternalLink,
  Image as ImageIcon,
  Lock,
  Music,
  Sparkles,
  Video,
} from "lucide-react";
import { getPublicProfileUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";

type AdvancedCustomizationProps = {
  user: User;
  onUpdate: (user: User) => void;
};

const BG_TYPES: { id: BackgroundType; label: string; icon: typeof ImageIcon }[] = [
  { id: "image", label: "Image", icon: ImageIcon },
  { id: "gif", label: "GIF", icon: Sparkles },
  { id: "video", label: "Vidéo", icon: Video },
];

export function AdvancedCustomization({
  user,
  onUpdate,
}: AdvancedCustomizationProps) {
  const supabase = createClient();
  const pro = isPro(user.plan ?? "free");

  const [audioUrl, setAudioUrl] = useState(user.audio_url ?? "");
  const [backgroundUrl, setBackgroundUrl] = useState(user.background_url ?? "");
  const [backgroundType, setBackgroundType] = useState<BackgroundType>(
    user.background_type ?? "image"
  );
  const [effects, setEffects] = useState<ProfileEffects>(
    parseProfileEffects(user.effects_enabled)
  );
  const [volumePercent, setVolumePercent] = useState(
    Math.round(clampVolume(user.volume) * 100)
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function toggleEffect(key: keyof ProfileEffects) {
    setEffects((e) => ({ ...e, [key]: !e[key] }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!pro) return;

    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      let finalAudio: string | null = null;
      let finalBg: string | null = null;
      let finalBgType: BackgroundType | null = null;

      if (canUseProfileMusic(user.plan)) {
        const audioCheck = validateHttpsMediaUrl(audioUrl, "audio");
        if (!audioCheck.ok) throw new Error(audioCheck.error);
        finalAudio = audioCheck.url || null;
      }

      if (canUseCustomBackground(user.plan) && backgroundUrl.trim()) {
        const kind =
          backgroundType === "gif"
            ? "gif"
            : backgroundType === "video"
              ? "video"
              : "image";
        if (backgroundType === "video" && !canUseVideoBackground(user.plan)) {
          throw new Error("Le fond vidéo est réservé au plan Pro");
        }
        const bgCheck = validateHttpsMediaUrl(backgroundUrl, kind);
        if (!bgCheck.ok) throw new Error(bgCheck.error);
        finalBg = bgCheck.url || null;
        finalBgType = finalBg ? backgroundType : null;
      }

      const vol = clampVolume(volumePercent / 100);

      const { data, error: updateError } = await supabase
        .from("users")
        .update({
          audio_url: finalAudio,
          background_url: finalBg,
          background_type: finalBgType,
          effects_enabled: canUseVisualEffects(user.plan) ? effects : DEFAULT_PROFILE_EFFECTS,
          volume: vol,
        })
        .eq("id", user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      const updated = data as User;
      onUpdate({
        ...updated,
        effects_enabled: parseProfileEffects(updated.effects_enabled),
        volume: clampVolume(updated.volume),
      });
      setMessage("Personnalisation enregistrée");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de sauvegarde");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            Personnalisation avancée
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Musique, fond et effets style bio-page moderne (Pro).
          </p>
        </div>
        <a href={getPublicProfileUrl(user.username)} target="_blank" rel="noopener noreferrer">
          <Button type="button" variant="secondary" size="sm">
            <ExternalLink className="h-4 w-4" />
            Prévisualiser
          </Button>
        </a>
      </div>

      {!pro ? (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 flex flex-col sm:flex-row items-center gap-4">
          <Lock className="h-8 w-8 text-blue-600 shrink-0" />
          <div className="flex-1 text-center sm:text-left">
            <p className="font-medium text-blue-900">Fonctionnalités Pro</p>
            <p className="text-sm text-slate-600 mt-1">
              Musique, fond image/GIF/vidéo et effets visuels sont réservés au plan Pro.
            </p>
          </div>
          <UpgradeButton size="sm" />
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-8">
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
              <Music className="h-4 w-4 text-blue-600" />
              Musique de profil
            </div>
            <Input
              label="URL audio (HTTPS direct)"
              placeholder="https://.../musique.mp3"
              value={audioUrl}
              onChange={(e) => setAudioUrl(e.target.value)}
            />
            <p className="text-xs text-slate-500">
              Les visiteurs verront « Clique pour entrer » — la musique ne démarre qu&apos;après
              leur clic (requis par les navigateurs).
            </p>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Volume par défaut ({volumePercent}%)
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={volumePercent}
                onChange={(e) => setVolumePercent(parseInt(e.target.value, 10))}
                className="w-full accent-blue-600"
              />
            </div>
          </section>

          <section className="space-y-4 border-t border-slate-200 pt-6">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
              <ImageIcon className="h-4 w-4 text-blue-600" />
              Fond personnalisé
            </div>
            <div className="grid grid-cols-3 gap-2">
              {BG_TYPES.map(({ id, label, icon: Icon }) => {
                const allowed = canUseBackgroundType(user.plan, id);
                return (
                  <button
                    key={id}
                    type="button"
                    disabled={!allowed}
                    onClick={() => setBackgroundType(id)}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-xl p-3 text-xs border transition",
                      backgroundType === id
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50",
                      !allowed && "opacity-40 cursor-not-allowed"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {label}
                  </button>
                );
              })}
            </div>
            <Input
              label="URL du fond"
              placeholder="https://.../fond.mp4 ou .gif ou .jpg"
              value={backgroundUrl}
              onChange={(e) => setBackgroundUrl(e.target.value)}
            />
          </section>

          <section className="space-y-3 border-t border-slate-200 pt-6">
            <p className="text-sm font-medium text-slate-800">Effets visuels</p>
            {(
              [
                ["particles", "Particules légères"],
                ["glass", "Glassmorphism"],
                ["glow", "Glow autour du profil"],
                ["entrance", "Animation d'apparition"],
              ] as const
            ).map(([key, label]) => (
              <label
                key={key}
                className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 cursor-pointer hover:bg-slate-50"
              >
                <span className="text-sm text-slate-700">{label}</span>
                <input
                  type="checkbox"
                  checked={effects[key]}
                  onChange={() => toggleEffect(key)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
            ))}
          </section>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          {message && (
            <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
              {message}
            </p>
          )}

          <Button type="submit" loading={saving} className="w-full sm:w-auto">
            Enregistrer la personnalisation
          </Button>
        </form>
      )}

      {pro && (
        <div className="mt-6 rounded-xl overflow-hidden border border-slate-800 bg-[#0a0a10] aspect-[9/16] max-h-64 sm:max-h-80 relative">
          <p className="absolute top-2 left-2 z-10 text-[10px] uppercase tracking-wider text-white/40 bg-black/50 px-2 py-1 rounded">
            Aperçu rapide
          </p>
          <iframe
            title="Aperçu profil"
            src={getPublicProfileUrl(user.username)}
            className="w-[200%] h-[200%] origin-top-left scale-50 pointer-events-none"
          />
        </div>
      )}
    </Card>
  );
}
