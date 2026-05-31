import type { SupabaseClient } from "@supabase/supabase-js";
import type { BackgroundType, Database } from "@/types/database";

export const PROFILE_MEDIA_BUCKET = "profile-media";

export const MAX_AUDIO_BYTES = 10 * 1024 * 1024;
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 25 * 1024 * 1024;
export const MAX_CURSOR_BYTES = 512 * 1024;

type AssetKind = "audio" | "background" | "avatar" | "cursor";

const AUDIO_EXT = new Set(["mp3", "wav", "ogg", "m4a", "aac"]);
const IMAGE_EXT = new Set(["jpg", "jpeg", "png", "webp", "avif"]);
const GIF_EXT = new Set(["gif"]);
const VIDEO_EXT = new Set(["mp4", "webm"]);
const CURSOR_EXT = new Set(["png", "cur", "webp"]);

function ext(name: string): string | null {
  const m = name.toLowerCase().match(/\.([a-z0-9]+)$/);
  return m ? m[1] : null;
}

export function detectBackgroundType(file: File): BackgroundType {
  const e = ext(file.name);
  if (e && GIF_EXT.has(e)) return "gif";
  if (e && VIDEO_EXT.has(e)) return "video";
  return "image";
}

export function validateAssetFile(file: File, kind: AssetKind): string | null {
  const e = ext(file.name);
  if (!e) return "Extension de fichier introuvable.";

  switch (kind) {
    case "audio":
      if (file.size > MAX_AUDIO_BYTES) return "Audio max 10 Mo.";
      if (!AUDIO_EXT.has(e)) return "Formats audio : mp3, wav, ogg, m4a.";
      break;
    case "background":
      if (VIDEO_EXT.has(e) && file.size > MAX_VIDEO_BYTES) {
        return "Vidéo max 25 Mo.";
      }
      if (!VIDEO_EXT.has(e) && file.size > MAX_IMAGE_BYTES) {
        return "Image/GIF max 8 Mo.";
      }
      const bgOk =
        IMAGE_EXT.has(e) || GIF_EXT.has(e) || VIDEO_EXT.has(e);
      if (!bgOk) {
        return "Fond : jpg, png, webp, gif, mp4 ou webm.";
      }
      break;
    case "avatar":
      if (file.size > MAX_IMAGE_BYTES) return "Avatar max 8 Mo.";
      if (!IMAGE_EXT.has(e)) return "Avatar : jpg, png ou webp.";
      break;
    case "cursor":
      if (file.size > MAX_CURSOR_BYTES) return "Curseur max 512 Ko.";
      if (!CURSOR_EXT.has(e)) return "Curseur : png ou webp.";
      break;
  }
  return null;
}

export async function uploadProfileAsset(
  supabase: SupabaseClient<Database>,
  userId: string,
  file: File,
  kind: AssetKind
): Promise<{ url: string; backgroundType?: BackgroundType }> {
  const err = validateAssetFile(file, kind);
  if (err) throw new Error(err);

  const extension = ext(file.name) ?? "bin";
  const paths: Record<AssetKind, string> = {
    audio: `${userId}/track.${extension}`,
    background: `${userId}/background.${extension}`,
    avatar: `${userId}/avatar.${extension}`,
    cursor: `${userId}/cursor.${extension}`,
  };

  const { error: uploadError } = await supabase.storage
    .from(PROFILE_MEDIA_BUCKET)
    .upload(paths[kind], file, {
      upsert: true,
      contentType: file.type || undefined,
    });

  if (uploadError) {
    if (uploadError.message.toLowerCase().includes("bucket")) {
      throw new Error(
        "Bucket « profile-media » manquant — exécutez la migration 004 dans Supabase."
      );
    }
    throw uploadError;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(PROFILE_MEDIA_BUCKET).getPublicUrl(paths[kind]);

  const url = `${publicUrl}?t=${Date.now()}`;
  return {
    url,
    backgroundType: kind === "background" ? detectBackgroundType(file) : undefined,
  };
}
