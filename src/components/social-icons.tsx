import type { SocialNetwork } from "@/types/database";
import {
  Github,
  Globe,
  Instagram,
  MessageCircle,
  Send,
  Tv,
  Twitter,
  Youtube,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<SocialNetwork, LucideIcon> = {
  instagram: Instagram,
  tiktok: Tv,
  snapchat: MessageCircle,
  twitch: Tv,
  discord: MessageCircle,
  youtube: Youtube,
  facebook: Globe,
  website: Globe,
  telegram: Send,
  twitter: Twitter,
  github: Github,
};

export function SocialIcon({
  network,
  className,
}: {
  network: string;
  className?: string;
}) {
  const Icon = iconMap[network as SocialNetwork] || Globe;
  return <Icon className={className} />;
}

export function getNetworkLabel(network: string): string {
  const labels: Record<string, string> = {
    instagram: "Instagram",
    tiktok: "TikTok",
    snapchat: "Snapchat",
    twitch: "Twitch",
    discord: "Discord",
    youtube: "YouTube",
    facebook: "Facebook",
    website: "Site web",
    telegram: "Telegram",
    twitter: "X / Twitter",
    github: "GitHub",
  };
  return labels[network] || network;
}

export function getNetworkColor(network: string): string {
  const colors: Record<string, string> = {
    instagram: "#E4405F",
    tiktok: "#00f2ea",
    snapchat: "#FFFC00",
    twitch: "#9146FF",
    discord: "#5865F2",
    youtube: "#FF0000",
    facebook: "#1877F2",
    website: "#6366f1",
    telegram: "#26A5E4",
    twitter: "#e7e9ea",
    github: "#f0f6fc",
  };
  return colors[network] || "#8b5cf6";
}
