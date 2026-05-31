import type { SocialNetwork } from "@/types/database";
import { DEFAULT_FREE_THEME } from "@/lib/plans";

export const SOCIAL_NETWORKS: {
  id: SocialNetwork;
  label: string;
  placeholder: string;
  color: string;
}[] = [
  {
    id: "instagram",
    label: "Instagram",
    placeholder: "https://instagram.com/username",
    color: "#E4405F",
  },
  {
    id: "tiktok",
    label: "TikTok",
    placeholder: "https://tiktok.com/@username",
    color: "#000000",
  },
  {
    id: "snapchat",
    label: "Snapchat",
    placeholder: "https://snapchat.com/add/username",
    color: "#FFFC00",
  },
  {
    id: "twitch",
    label: "Twitch",
    placeholder: "https://twitch.tv/username",
    color: "#9146FF",
  },
  {
    id: "discord",
    label: "Discord",
    placeholder: "https://discord.gg/invite",
    color: "#5865F2",
  },
  {
    id: "youtube",
    label: "YouTube",
    placeholder: "https://youtube.com/@channel",
    color: "#FF0000",
  },
  {
    id: "facebook",
    label: "Facebook",
    placeholder: "https://facebook.com/username",
    color: "#1877F2",
  },
  {
    id: "website",
    label: "Site web",
    placeholder: "https://votresite.com",
    color: "#6366f1",
  },
];

/** Thème unique pour le plan Gratuit */
export const FREE_THEME_PRESETS = [DEFAULT_FREE_THEME];

/** Palettes premium (plan Pro) */
export const PRO_THEME_PRESETS = [
  "#2563eb",
  "#3b82f6",
  "#0ea5e9",
  "#1d4ed8",
  "#60a5fa",
  "#0284c7",
  "#0369a1",
  "#38bdf8",
  "#1e40af",
  "#0c4a6e",
];

/** @deprecated Utilisez FREE_THEME_PRESETS ou PRO_THEME_PRESETS */
export const THEME_PRESETS = PRO_THEME_PRESETS;

export const APP_NAME = "BioFlow";
