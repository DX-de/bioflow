import { validateAssetFile, uploadProfileAsset, PROFILE_MEDIA_BUCKET, MAX_AUDIO_BYTES } from "@/lib/upload-profile-media";

export {
  uploadProfileAsset as uploadProfileAudio,
  PROFILE_MEDIA_BUCKET as PROFILE_AUDIO_BUCKET,
  MAX_AUDIO_BYTES as MAX_PROFILE_AUDIO_BYTES,
};

export function validateProfileAudioFile(file: File): string | null {
  return validateAssetFile(file, "audio");
}
