import type { SocialNetwork } from "@/types/database";

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
    color: "#00f2ea",
  },
  {
    id: "snapchat",
    label: "Snapchat",
    placeholder: "https://snapchat.com/add/username",
    color: "#FFFC00",
  },
  {
    id: "youtube",
    label: "YouTube",
    placeholder: "https://youtube.com/@channel",
    color: "#FF0000",
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
    id: "telegram",
    label: "Telegram",
    placeholder: "https://t.me/username",
    color: "#26A5E4",
  },
  {
    id: "twitter",
    label: "X / Twitter",
    placeholder: "https://x.com/username",
    color: "#e7e9ea",
  },
  {
    id: "github",
    label: "GitHub",
    placeholder: "https://github.com/username",
    color: "#f0f6fc",
  },
  {
    id: "website",
    label: "Site web",
    placeholder: "https://votresite.com",
    color: "#6366f1",
  },
];

export const APP_NAME = "BioFlow";
