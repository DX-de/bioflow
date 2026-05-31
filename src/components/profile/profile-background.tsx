"use client";

import type { BackgroundType } from "@/types/database";
import { hexToRgba } from "@/lib/utils";

type ProfileBackgroundProps = {
  url: string | null;
  type: BackgroundType | null;
  theme: string;
  enabled: boolean;
};

export function ProfileBackground({
  url,
  type,
  theme,
  enabled,
}: ProfileBackgroundProps) {
  const baseGradient = (
    <div
      className="absolute inset-0"
      style={{
        background: `
          radial-gradient(ellipse 80% 60% at 50% -10%, ${hexToRgba(theme, 0.35)} 0%, transparent 55%),
          radial-gradient(ellipse 50% 40% at 100% 80%, ${hexToRgba(theme, 0.15)} 0%, transparent 50%),
          linear-gradient(180deg, #0c0c12 0%, #050508 50%, #0a0a10 100%)
        `,
      }}
    />
  );

  if (!enabled || !url || !type) {
    return (
      <div className="fixed inset-0 -z-20 overflow-hidden">
        {baseGradient}
        <div className="absolute inset-0 bg-black/40" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden">
      {type === "video" ? (
        <video
          src={url}
          className="absolute inset-0 h-full w-full object-cover"
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
        />
      )}
      <div className="absolute inset-0 bg-black/55" />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 70% 50% at 50% 30%, ${hexToRgba(theme, 0.2)}, transparent 70%)`,
        }}
      />
    </div>
  );
}
