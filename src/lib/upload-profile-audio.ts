import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export const PROFILE_AUDIO_BUCKET = "profile-media";
export const MAX_PROFILE_AUDIO_BYTES = 10 * 1024 * 1024; // 10 Mo

const ALLOWED_EXTENSIONS = new Set(["mp3", "wav", "ogg", "m4a", "aac", "webm"]);
const ALLOWED_MIME = new Set([
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/wave",
  "audio/x-wav",
  "audio/ogg",
  "audio/mp4",
  "audio/x-m4a",
  "audio/aac",
  "audio/webm",
]);

function extensionFromName(name: string): string | null {
  const match = name.toLowerCase().match(/\.([a-z0-9]+)$/);
  return match ? match[1] : null;
}

export function validateProfileAudioFile(file: File): string | null {
  if (file.size > MAX_PROFILE_AUDIO_BYTES) {
    return "Fichier trop volumineux (max 10 Mo).";
  }

  const ext = extensionFromName(file.name);
  if (!ext || !ALLOWED_EXTENSIONS.has(ext)) {
    return "Format non supporté. Utilisez .mp3, .wav, .ogg ou .m4a.";
  }

  if (file.type && !ALLOWED_MIME.has(file.type)) {
    return "Type de fichier audio non autorisé.";
  }

  return null;
}

export async function uploadProfileAudio(
  supabase: SupabaseClient<Database>,
  userId: string,
  file: File
): Promise<string> {
  const validationError = validateProfileAudioFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const ext = extensionFromName(file.name) ?? "mp3";
  const path = `${userId}/track.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(PROFILE_AUDIO_BUCKET)
    .upload(path, file, {
      upsert: true,
      contentType: file.type || `audio/${ext === "mp3" ? "mpeg" : ext}`,
    });

  if (uploadError) {
    if (uploadError.message.toLowerCase().includes("bucket")) {
      throw new Error(
        "Bucket « profile-media » manquant. Exécutez supabase/migrations/004_profile_audio_storage.sql dans Supabase."
      );
    }
    throw uploadError;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(PROFILE_AUDIO_BUCKET).getPublicUrl(path);

  return `${publicUrl}?t=${Date.now()}`;
}
