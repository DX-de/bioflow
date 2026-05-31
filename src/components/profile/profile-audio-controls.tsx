"use client";

import { useEffect, useState, type RefObject } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

type ProfileAudioControlsProps = {
  audioRef: RefObject<HTMLAudioElement | null>;
  audioUrl: string;
  defaultVolume: number;
  visible: boolean;
};

export function ProfileAudioControls({
  audioRef,
  audioUrl,
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

  return (
    <>
      <audio ref={audioRef} src={audioUrl} loop preload="none" />
      <div
        className={cn(
          "fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3",
          "rounded-2xl border border-white/10 bg-black/60 px-4 py-2.5 backdrop-blur-xl",
          "shadow-lg shadow-black/40 max-w-[calc(100vw-2rem)]"
        )}
      >
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
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
          className="h-1.5 w-24 sm:w-32 accent-blue-500 cursor-pointer"
          aria-label="Volume"
        />
        <span className="text-xs text-white/60 tabular-nums w-8">
          {Math.round((muted ? 0 : volume) * 100)}%
        </span>
      </div>
    </>
  );
}
