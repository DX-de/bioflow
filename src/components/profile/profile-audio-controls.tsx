"use client";

import { useEffect, useState, type RefObject } from "react";
import { Music2, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

type ProfileAudioControlsProps = {
  audioRef: RefObject<HTMLAudioElement | null>;
  audioUrl: string;
  audioTitle?: string | null;
  accent: string;
  defaultVolume: number;
  visible: boolean;
};

export function ProfileAudioControls({
  audioRef,
  audioUrl,
  audioTitle,
  accent,
  defaultVolume,
  visible,
}: ProfileAudioControlsProps) {
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(defaultVolume);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = volume;
    el.muted = muted;
  }, [volume, muted, audioRef]);

  if (!visible) return null;

  const label = audioTitle?.trim() || "Musique de profil";

  return (
    <>
      <audio ref={audioRef} src={audioUrl} loop preload="none" className="hidden" />
      <div
        className={cn(
          "fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3",
          "rounded-2xl border border-white/10 bg-black/70 px-3 py-2 backdrop-blur-xl",
          "shadow-lg shadow-black/50 max-w-[min(100vw-1.5rem,360px)]"
        )}
      >
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          style={{ background: `${accent}33`, color: accent }}
        >
          <Music2 className="h-4 w-4" />
        </span>
        <span className="hidden min-w-0 flex-1 truncate text-xs text-white/70 sm:block">
          {label}
        </span>
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition"
          aria-label={muted ? "Activer le son" : "Couper le son"}
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={muted ? 0 : volume}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            setVolume(v);
            if (v > 0) setMuted(false);
          }}
          className="h-1.5 w-20 sm:w-28 cursor-pointer"
          style={{ accentColor: accent }}
          aria-label="Volume"
        />
      </div>
    </>
  );
}
