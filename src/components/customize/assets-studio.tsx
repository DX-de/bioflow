"use client";

import Image from "next/image";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { BackgroundType, Database, User } from "@/types/database";
import { SectionCard } from "@/components/customize/section-card";
import { Button } from "@/components/ui/button";
import { ProGate } from "@/components/ui/pro-gate";
import { isPro } from "@/lib/plans";
import { uploadProfileAsset } from "@/lib/upload-profile-media";
import { ImageIcon, Music, MousePointer2, UserCircle, Video, X } from "lucide-react";

type AssetsStudioProps = {
  draft: User;
  supabase: SupabaseClient<Database>;
  onChange: (patch: Partial<User>) => void;
  onError: (msg: string) => void;
};

function AssetTile({
  label,
  icon: Icon,
  preview,
  isVideo,
  uploading,
  onUpload,
  onRemove,
  proLocked,
}: {
  label: string;
  icon: typeof ImageIcon;
  preview?: string | null;
  isVideo?: boolean;
  uploading?: boolean;
  onUpload: () => void;
  onRemove: () => void;
  proLocked?: boolean;
}) {
  return (
    <div className="relative rounded-xl border border-zinc-700/80 bg-zinc-800/40 overflow-hidden">
      <div className="aspect-[4/3] flex flex-col items-center justify-center p-3">
        {preview ? (
          isVideo ? (
            <video
              src={preview}
              className="absolute inset-0 h-full w-full object-cover"
              muted
              playsInline
            />
          ) : (
            <Image
              src={preview}
              alt={label}
              fill
              className="object-cover"
              unoptimized
            />
          )
        ) : (
          <div className="flex flex-col items-center gap-2 text-zinc-500">
            <Icon className="h-8 w-8" />
            <span className="text-xs text-center">{label}</span>
          </div>
        )}
      </div>
      <div className="flex gap-1 p-2 border-t border-zinc-700/60">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="flex-1 text-xs"
          disabled={uploading || proLocked}
          onClick={onUpload}
        >
          {uploading ? "…" : preview ? "Remplacer" : "Importer"}
        </Button>
        {preview && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="text-red-400"
            disabled={proLocked}
            onClick={onRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

export function AssetsStudio({
  draft,
  supabase,
  onChange,
  onError,
}: AssetsStudioProps) {
  const pro = isPro(draft.plan);

  async function pickFile(accept: string, handler: (f: File) => Promise<void>) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        await handler(file);
      } catch (e) {
        onError(e instanceof Error ? e.message : "Erreur upload");
      }
    };
    input.click();
  }

  return (
    <SectionCard
      title="Assets Studio"
      description="Importez vos médias — stockés sur Supabase Storage"
    >
      <ProGate locked={!pro} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <AssetTile
          label="Background"
          icon={Video}
          preview={draft.background_url}
          isVideo={draft.background_type === "video"}
          proLocked={!pro}
          onUpload={() =>
            pickFile("image/*,video/mp4,video/webm,.gif", async (file) => {
              const { url, backgroundType } = await uploadProfileAsset(
                supabase,
                draft.id,
                file,
                "background"
              );
              onChange({
                background_url: url,
                background_type: backgroundType as BackgroundType,
              });
            })
          }
          onRemove={() =>
            onChange({ background_url: null, background_type: null })
          }
        />
        <AssetTile
          label="Audio"
          icon={Music}
          preview={null}
          proLocked={!pro}
          onUpload={() =>
            pickFile("audio/*,.mp3,.wav,.ogg", async (file) => {
              const { url } = await uploadProfileAsset(
                supabase,
                draft.id,
                file,
                "audio"
              );
              onChange({ audio_url: url });
            })
          }
          onRemove={() => onChange({ audio_url: null })}
        />
        <AssetTile
          label="Avatar"
          icon={UserCircle}
          preview={draft.avatar}
          onUpload={() =>
            pickFile("image/*", async (file) => {
              const { url } = await uploadProfileAsset(
                supabase,
                draft.id,
                file,
                "avatar"
              );
              onChange({ avatar: url });
            })
          }
          onRemove={() => onChange({ avatar: null })}
        />
        <AssetTile
          label="Curseur"
          icon={MousePointer2}
          preview={draft.cursor_url}
          proLocked={!pro}
          onUpload={() =>
            pickFile("image/png,image/webp", async (file) => {
              const { url } = await uploadProfileAsset(
                supabase,
                draft.id,
                file,
                "cursor"
              );
              onChange({ cursor_url: url });
            })
          }
          onRemove={() => onChange({ cursor_url: null })}
        />
      </ProGate>
      {draft.audio_url && (
        <p className="mt-3 text-xs text-emerald-400/90 truncate">
          Audio : {draft.audio_title || "fichier importé"}
        </p>
      )}
    </SectionCard>
  );
}
