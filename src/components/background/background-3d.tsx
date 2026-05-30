"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const Scene3DCanvas = dynamic(() => import("./scene-3d-canvas"), {
  ssr: false,
  loading: () => null,
});

type Background3DProps = {
  className?: string;
  /** Intensité du voile sombre par-dessus la scène (0–1) */
  overlay?: number;
};

export function Background3D({ className, overlay = 0.55 }: Background3DProps) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const lowPower =
      typeof navigator !== "undefined" &&
      "hardwareConcurrency" in navigator &&
      navigator.hardwareConcurrency <= 4;

    setEnabled(!reducedMotion && !lowPower);
  }, []);

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
        className
      )}
      aria-hidden
    >
      {/* Fallback CSS toujours présent */}
      <div className="absolute inset-0 gradient-mesh" />

      {enabled ? (
        <>
          <div className="absolute inset-0">
            <Scene3DCanvas />
          </div>
          <div
            className="absolute inset-0 bg-zinc-950"
            style={{ opacity: overlay }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/20 to-zinc-950/80" />
        </>
      ) : (
        <div className="absolute inset-0 animate-gradient-shift opacity-60" />
      )}
    </div>
  );
}

/**
 * Enveloppe de page avec fond 3D + contenu au premier plan.
 */
export function PageWith3DBackground({
  children,
  className,
  overlay,
}: Background3DProps & { children: React.ReactNode }) {
  return (
    <div className={cn("relative min-h-dvh", className)}>
      <Background3D overlay={overlay} />
      <div className="relative z-0">{children}</div>
    </div>
  );
}
