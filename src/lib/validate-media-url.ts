import type { BackgroundType } from "@/types/database";

const BLOCKED_PROTOCOLS = /^(javascript|data|vbscript|file):/i;
const BLOCKED_CHARS = /[<>"'`]/;

const AUDIO_EXT = /\.(mp3|wav|ogg|m4a|aac|webm)(\?|#|$)/i;
const IMAGE_EXT = /\.(jpg|jpeg|png|webp|avif)(\?|#|$)/i;
const GIF_EXT = /\.gif(\?|#|$)/i;
const VIDEO_EXT = /\.(mp4|webm)(\?|#|$)/i;

const TRUSTED_HOSTS = [
  ".supabase.co",
  "cdn.discordapp.com",
  "media.discordapp.net",
  "i.imgur.com",
  "imgur.com",
];

function hasTrustedHost(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  return TRUSTED_HOSTS.some(
    (h) => lower === h.slice(1) || lower.endsWith(h)
  );
}

export type MediaValidationResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

export function validateHttpsMediaUrl(
  raw: string,
  kind: "audio" | "image" | "gif" | "video"
): MediaValidationResult {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: true, url: "" };
  }

  if (BLOCKED_CHARS.test(trimmed) || BLOCKED_PROTOCOLS.test(trimmed)) {
    return { ok: false, error: "URL non autorisée" };
  }

  let parsed: URL;
  try {
    parsed = new URL(
      /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
    );
  } catch {
    return { ok: false, error: "URL invalide" };
  }

  if (parsed.protocol !== "https:") {
    return { ok: false, error: "Seules les URLs HTTPS sont acceptées" };
  }

  const path = parsed.pathname.toLowerCase();
  const trusted = hasTrustedHost(parsed.hostname);

  switch (kind) {
    case "audio":
      if (!AUDIO_EXT.test(path) && !trusted) {
        return {
          ok: false,
          error:
            "Audio : utilisez un lien direct (.mp3, .wav, .ogg, .m4a, .webm) ou Supabase Storage",
        };
      }
      break;
    case "image":
      if (!IMAGE_EXT.test(path) && !trusted) {
        return {
          ok: false,
          error: "Image : .jpg, .png, .webp ou hébergeur autorisé",
        };
      }
      break;
    case "gif":
      if (!GIF_EXT.test(path) && !trusted) {
        return { ok: false, error: "GIF : lien se terminant par .gif" };
      }
      break;
    case "video":
      if (!VIDEO_EXT.test(path) && !trusted) {
        return {
          ok: false,
          error: "Vidéo : .mp4 ou .webm (HTTPS direct)",
        };
      }
      break;
  }

  return { ok: true, url: parsed.toString() };
}

export function backgroundKindFromType(
  type: BackgroundType | null
): "image" | "gif" | "video" | null {
  if (!type) return null;
  return type;
}
