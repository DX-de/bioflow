"use client";

import type { BackgroundType } from "@/types/database";
import type { ThemePreset } from "@/lib/themes";

type ProfileBackgroundProps = {
  url: string | null;
  type: BackgroundType | null;
  theme: ThemePreset;
  enabled: boolean;
  blur: number;
  opacity: number;
};

export function ProfileBackground({
  url,
  type,
  theme,
  enabled,
  blur,
  opacity,
}: ProfileBackgroundProps) {
  const overlayOpacity = 1 - opacity;

  if (!enabled || !url || !type) {
    return (
      <div className="fixed inset-0 -z-20 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: theme.bgGradient }}
        />
        <div
          className="absolute inset-0"
          style={{ backgroundColor: theme.bgBase, opacity: 0.85 }}
        />
      </div>
    );
  }

  const mediaStyle = {
    filter: blur > 0 ? `blur(${blur}px)` : undefined,
    transform: blur > 0 ? "scale(1.05)" : undefined,
  };

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden">
      {type === "video" ? (
        <video
          src={url}
          className="absolute inset-0 h-full w-full object-cover"
          style={mediaStyle}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={mediaStyle}
        />
      )}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: theme.bgBase,
          opacity: Math.min(0.92, overlayOpacity + 0.15),
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 70% 50% at 50% 30%, ${theme.accent}22, transparent 70%)`,
        }}
      />
    </div>
  );
}
