"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { BioThemeId, User } from "@/types/database";
import { DEFAULT_FREE_THEME, canUseThemeId, isPro } from "@/lib/plans";
import { THEME_LIST } from "@/lib/themes";
import { isValidUsername } from "@/lib/utils";
import { Lock } from "lucide-react";
import { UpgradeButton } from "@/components/pricing/upgrade-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Camera, Check, Copy, ExternalLink } from "lucide-react";
import { getPublicProfileUrl, cn } from "@/lib/utils";
import { getTheme } from "@/lib/themes";

type ProfileEditorProps = {
  user: User;
  onUpdate: (user: User) => void;
};

export function ProfileEditor({ user, onUpdate }: ProfileEditorProps) {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pro = isPro(user.plan ?? "free");
  const currentTheme = getTheme(user.theme);

  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio || "");
  const [theme, setTheme] = useState(user.theme || DEFAULT_FREE_THEME);
  const [avatar, setAvatar] = useState(user.avatar);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(path);

      const url = `${publicUrl}?t=${Date.now()}`;

      const { error: updateError } = await supabase
        .from("users")
        .update({ avatar: url })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setAvatar(url);
      onUpdate({ ...user, avatar: url });
      setMessage("Photo mise à jour");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur upload. Créez le bucket 'avatars' dans Supabase Storage."
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      if (!isValidUsername(username)) {
        throw new Error(
          "Nom d'utilisateur invalide (3-30 caractères, lettres/chiffres/_)"
        );
      }

      if (username !== user.username) {
        const { data: existing } = await supabase
          .from("users")
          .select("id")
          .eq("username", username)
          .neq("id", user.id)
          .maybeSingle();

        if (existing) {
          throw new Error("Ce nom d'utilisateur est déjà pris");
        }
      }

      const themeId = theme as BioThemeId;
      const themeToSave = canUseThemeId(user.plan, themeId)
        ? themeId
        : DEFAULT_FREE_THEME;

      const { data, error: updateError } = await supabase
        .from("users")
        .update({ username, bio, theme: themeToSave })
        .eq("id", user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      onUpdate({ ...user, ...data });
      setMessage("Profil enregistré");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  }

  function copyProfileLink() {
    const url = `${window.location.origin}/${username}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const initials = username.slice(0, 2).toUpperCase();
  const accent = currentTheme.accent;

  return (
    <Card>
      <h2 className="text-lg font-semibold mb-6 text-slate-900">Mon profil</h2>

      <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="relative group h-24 w-24 rounded-full overflow-hidden ring-2 ring-slate-200 focus:outline-none focus:ring-blue-500"
          style={{ boxShadow: `0 0 24px ${accent}40` }}
          disabled={uploading}
        >
          {avatar ? (
            <Image
              src={avatar}
              alt="Avatar"
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-2xl font-bold text-white"
              style={{
                background: `linear-gradient(135deg, ${accent}, ${currentTheme.accentSecondary})`,
              }}
            >
              {initials}
            </div>
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="h-6 w-6" />
          </span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarUpload}
        />
        <div className="text-center sm:text-left flex-1">
          <p className="text-sm text-slate-600">Cliquez pour changer votre photo</p>
          <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={copyProfileLink}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copié !" : "Copier le lien"}
            </Button>
            <a
              href={getPublicProfileUrl(username)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button type="button" variant="ghost" size="sm">
                <ExternalLink className="h-4 w-4" />
                Voir ma page
              </Button>
            </a>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <Input
          label="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase())}
          placeholder="monpseudo"
        />
        <Textarea
          label="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Parlez de vous en quelques mots..."
          maxLength={160}
        />

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-slate-700">Thème</label>
            {!pro && (
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Lock className="h-3 w-3" />
                Classic (Gratuit)
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {THEME_LIST.map((t) => {
              const locked = !canUseThemeId(user.plan, t.id);
              return (
                <button
                  key={t.id}
                  type="button"
                  disabled={locked}
                  onClick={() => !locked && setTheme(t.id)}
                  className={cn(
                    "rounded-lg border p-2 text-left text-xs transition",
                    theme === t.id
                      ? "border-blue-500 ring-1 ring-blue-200"
                      : "border-slate-200",
                    locked && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div
                    className="h-6 rounded mb-1"
                    style={{ background: t.bgGradient }}
                  />
                  {t.name}
                </button>
              );
            })}
          </div>
          {!pro && (
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
              <p className="text-xs text-slate-600 flex-1">
                4 thèmes premium avec BioFlow Pro.
              </p>
              <UpgradeButton size="sm" label="Passer Pro" className="shrink-0" />
            </div>
          )}
        </div>

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

        <Button type="submit" loading={saving}>
          Enregistrer le profil
        </Button>
      </form>
    </Card>
  );
}
