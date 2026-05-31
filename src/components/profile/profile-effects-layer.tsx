"use client";

import { useEffect, useRef } from "react";
import type { EffectType } from "@/types/database";
import { ProfileParticles } from "@/components/profile/profile-particles";

type ProfileEffectsLayerProps = {
  effectType: EffectType;
  accent: string;
  enabled: boolean;
};

function RainEffect({ accent }: { accent: string }) {
  const drops = Array.from({ length: 48 }, (_, i) => i);
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {drops.map((i) => (
        <span
          key={i}
          className="absolute w-px animate-[rain_1.2s_linear_infinite] opacity-30"
          style={{
            left: `${(i * 17) % 100}%`,
            height: `${40 + (i % 5) * 12}px`,
            background: `linear-gradient(transparent, ${accent})`,
            animationDelay: `${(i % 10) * 0.12}s`,
            animationDuration: `${0.8 + (i % 4) * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
}

function SnowEffect() {
  const flakes = Array.from({ length: 36 }, (_, i) => i);
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {flakes.map((i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white/70 animate-[snow_4s_linear_infinite]"
          style={{
            width: 2 + (i % 3),
            height: 2 + (i % 3),
            left: `${(i * 13) % 100}%`,
            animationDelay: `${(i % 8) * 0.4}s`,
            animationDuration: `${3 + (i % 5)}s`,
          }}
        />
      ))}
    </div>
  );
}

function StarsEffect({ accent }: { accent: string }) {
  const stars = Array.from({ length: 60 }, (_, i) => i);
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {stars.map((i) => (
        <span
          key={i}
          className="absolute rounded-full animate-pulse"
          style={{
            width: 1 + (i % 2),
            height: 1 + (i % 2),
            left: `${(i * 7.3) % 100}%`,
            top: `${(i * 11.7) % 100}%`,
            background: i % 5 === 0 ? accent : "rgba(255,255,255,0.8)",
            opacity: 0.3 + (i % 7) * 0.1,
            animationDuration: `${1.5 + (i % 4)}s`,
          }}
        />
      ))}
    </div>
  );
}

export function ProfileEffectsLayer({
  effectType,
  accent,
  enabled,
}: ProfileEffectsLayerProps) {
  if (!enabled || effectType === "none") return null;

  if (effectType === "particles") {
    return <ProfileParticles theme={accent} enabled />;
  }
  if (effectType === "rain") return <RainEffect accent={accent} />;
  if (effectType === "snow") return <SnowEffect />;
  if (effectType === "stars") return <StarsEffect accent={accent} />;

  return null;
}

export function ProfileCursorTrail({
  accent,
  enabled,
}: {
  accent: string;
  enabled: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const canvas = ref.current;
    if (!canvas) return;

    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;
    const ctx: CanvasRenderingContext2D = ctx2d;
    const c = canvas;

    const points: { x: number; y: number; life: number }[] = [];

    function resize() {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function onMove(e: MouseEvent) {
      points.push({ x: e.clientX, y: e.clientY, life: 1 });
      if (points.length > 24) points.shift();
    }
    window.addEventListener("mousemove", onMove);

    let raf = 0;
    function draw() {
      ctx.clearRect(0, 0, c.width, c.height);
      for (let i = points.length - 1; i >= 0; i--) {
        const p = points[i];
        p.life -= 0.04;
        if (p.life <= 0) {
          points.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4 * p.life, 0, Math.PI * 2);
        ctx.fillStyle = accent;
        ctx.globalAlpha = p.life * 0.35;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [enabled, accent]);

  if (!enabled) return null;

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 z-[60]"
      aria-hidden
    />
  );
}
