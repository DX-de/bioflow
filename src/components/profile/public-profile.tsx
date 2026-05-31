"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { Link as BioLink, PageTransition, User } from "@/types/database";
import { SocialIcon, getNetworkColor, getNetworkLabel } from "@/components/social-icons";
import { normalizeUrl } from "@/lib/utils";
import { parseProfileEffects } from "@/lib/profile-effects";
import {
  canUseCustomBackground,
  canUseProfileMusic,
  canUseVisualEffects,
  isPro,
} from "@/lib/plans";
import { resolveProfileStyle } from "@/lib/profile-settings";
import { ProfileBackground } from "@/components/profile/profile-background";
import {
  ProfileCursorTrail,
  ProfileEffectsLayer,
} from "@/components/profile/profile-effects-layer";
import { EntryGate } from "@/components/profile/entry-gate";
import { ProfileAudioControls } from "@/components/profile/profile-audio-controls";
import { ExternalLink, Eye, MapPin, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type PublicProfileProps = {
  user: User;
  links: BioLink[];
  previewMode?: boolean;
};

function trackView(userId: string) {
  void fetch("/api/track/view", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
}

function trackClick(linkId: string) {
  void fetch("/api/track/click", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ linkId }),
  });
}

function pageTransitionVariants(type: PageTransition) {
  switch (type) {
    case "zoom":
      return {
        initial: { opacity: 0, scale: 0.88 },
        animate: { opacity: 1, scale: 1 },
      };
    case "slide":
      return {
        initial: { opacity: 0, x: -24 },
        animate: { opacity: 1, x: 0 },
      };
    case "none":
      return { initial: false, animate: { opacity: 1 } };
    default:
      return {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
      };
  }
}

function avatarMotion(type: string) {
  switch (type) {
    case "float":
      return {
        animate: { y: [0, -8, 0] },
        transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const },
      };
    case "pulse":
      return {
        animate: { scale: [1, 1.05, 1] },
        transition: { duration: 2.5, repeat: Infinity },
      };
    case "rotate-slow":
      return {
        animate: { rotate: [0, 6, -6, 0] },
        transition: { duration: 6, repeat: Infinity },
      };
    default:
      return {};
  }
}

const usernameFxClass: Record<string, string> = {
  glow: "bio-username-glow",
  pulse: "bio-username-pulse",
  glitch: "bio-username-glitch",
  sparkle: "bio-username-sparkle",
};

export function PublicProfile({
  user,
  links,
  previewMode = false,
}: PublicProfileProps) {
  const style = resolveProfileStyle(user);
  const plan = user.plan ?? "free";
  const pro = isPro(plan);
  const effects = parseProfileEffects(user.effects_enabled);
  const proEffects = pro && canUseVisualEffects(plan);
  const showMusic =
    pro && canUseProfileMusic(plan) && Boolean(user.audio_url?.trim());
  const showBg =
    pro &&
    canUseCustomBackground(plan) &&
    Boolean(user.background_url?.trim() && user.background_type);

  const volume = user.volume ?? 0.7;
  const initials = user.username.slice(0, 2).toUpperCase();
  const accent = style.accent;

  const needsGate = !previewMode;
  const [entered, setEntered] = useState(!needsGate);
  const audioRef = useRef<HTMLAudioElement>(null);
  const viewTracked = useRef(false);
  const shouldPlayOnEnter = useRef(false);

  const customCursor =
    pro && style.customCursorUrl
      ? `url(${style.customCursorUrl}) 12 12, auto`
      : undefined;

  function handleEnter() {
    shouldPlayOnEnter.current = showMusic;
    setEntered(true);
    if (!viewTracked.current && !previewMode) {
      viewTracked.current = true;
      trackView(user.id);
    }
  }

  useLayoutEffect(() => {
    if (!entered || !shouldPlayOnEnter.current || !showMusic) return;
    shouldPlayOnEnter.current = false;
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.muted = false;
    void audio.play().catch(() => {});
  }, [entered, showMusic, volume]);

  const useGlass = proEffects && effects.glass;
  const useGlow = proEffects && effects.glow;
  const cardAnim = pageTransitionVariants(style.pageTransition);
  const avMotion = avatarMotion(style.avatarAnimation);
  const effectType =
    proEffects && style.backgroundEffect !== "none"
      ? style.backgroundEffect
      : "none";
  const cursorTrail = proEffects && style.cursorTrail;

  const usernameGradient = style.gradientEnabled
    ? `linear-gradient(135deg, ${style.primary}, ${style.secondary})`
    : `linear-gradient(135deg, ${style.text}, ${accent})`;

  const cardMaxWidth = `${Math.round((style.cardWidth / 100) * 32)}rem`;

  return (
    <div
      className="relative min-h-dvh w-full overflow-x-hidden"
      style={{
        color: style.text,
        cursor: customCursor,
        backgroundColor: showBg ? undefined : style.bgBase,
      }}
    >
      <ProfileBackground
        url={showBg ? user.background_url : null}
        type={showBg ? user.background_type : null}
        theme={style.preset}
        enabled={showBg}
        blur={user.background_blur ?? 0}
        opacity={user.background_opacity ?? 0.55}
        fallbackBase={style.bgBase}
      />

      {entered && (
        <ProfileEffectsLayer
          effectType={effectType}
          accent={accent}
          enabled={proEffects}
        />
      )}

      {entered && cursorTrail && (
        <ProfileCursorTrail accent={accent} enabled />
      )}

      <AnimatePresence>
        {needsGate && !entered && (
          <EntryGate
            key="gate"
            username={user.username}
            accent={accent}
            hasMusic={showMusic}
            onEnter={handleEnter}
          />
        )}
      </AnimatePresence>

      {showMusic && (
        <audio
          ref={audioRef}
          src={user.audio_url!}
          loop={user.audio_loop !== false}
          preload="metadata"
          playsInline
          className="hidden"
        />
      )}

      {showMusic && entered && (
        <ProfileAudioControls
          audioRef={audioRef}
          audioTitle={user.audio_title}
          accent={accent}
          defaultVolume={volume}
        />
      )}

      <main
        className={cn(
          "relative z-10 mx-auto flex min-h-dvh flex-col items-center px-4 py-10 sm:py-14",
          !entered && needsGate && "pointer-events-none opacity-0"
        )}
        style={{ maxWidth: cardMaxWidth, width: "100%" }}
      >
        <motion.div
          {...cardAnim}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "w-full flex flex-col items-center text-center",
            useGlass && "px-6 py-8 backdrop-blur-xl shadow-2xl border"
          )}
          style={{
            opacity: style.profileOpacity,
            borderRadius: style.borderRadius,
            backdropFilter:
              style.profileBlur > 0 ? `blur(${style.profileBlur}px)` : undefined,
            ...(useGlass
              ? {
                  background: style.glassBg,
                  borderColor: style.glassBorder,
                  boxShadow: useGlow
                    ? `0 0 60px ${style.glow}33, 0 25px 50px -12px rgba(0,0,0,0.5)`
                    : undefined,
                }
              : {}),
          }}
        >
          <motion.div
            className="relative mb-5 overflow-hidden rounded-full shrink-0"
            style={{
              width: style.avatarSize,
              height: style.avatarSize,
              boxShadow: useGlow
                ? `0 0 48px ${style.glow}88, 0 0 0 2px ${accent}55`
                : `0 0 0 2px ${accent}44`,
            }}
            animate={avMotion.animate}
            transition={avMotion.transition}
          >
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.username}
                fill
                className="object-cover"
                priority
                unoptimized
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center text-3xl font-bold text-white"
                style={{
                  background: `linear-gradient(135deg, ${style.primary}, ${style.secondary})`,
                }}
              >
                {initials}
              </div>
            )}
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
            <h1
              className={cn(
                "text-2xl sm:text-3xl font-bold tracking-tight",
                usernameFxClass[style.usernameEffect]
              )}
              style={{
                backgroundImage: usernameGradient,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                ["--bio-glow-color" as string]: style.glow,
              }}
            >
              @{user.username}
            </h1>
            {pro && (
              <span
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                style={{
                  background: `${accent}33`,
                  color: accent,
                  border: `1px solid ${accent}66`,
                }}
              >
                <Sparkles className="h-3 w-3" />
                Pro
              </span>
            )}
          </div>

          {user.bio && (
            <p
              className="max-w-sm text-sm leading-relaxed sm:text-base"
              style={{ color: style.textMuted }}
            >
              {user.bio}
            </p>
          )}

          {user.location?.trim() && (
            <p
              className="mt-2 flex items-center justify-center gap-1 text-xs"
              style={{ color: style.textMuted }}
            >
              <MapPin className="h-3.5 w-3.5" />
              {user.location}
            </p>
          )}

          <div
            className="mt-4 flex items-center gap-1.5 text-xs"
            style={{ color: style.textMuted }}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>{(user.views ?? 0).toLocaleString("fr-FR")} vues</span>
          </div>
        </motion.div>

        <motion.ul
          className="mt-8 flex w-full flex-col gap-3"
          initial={effects.entrance && entered ? "hidden" : false}
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.07, delayChildren: 0.15 },
            },
          }}
        >
          {links.length === 0 ? (
            <li
              className="rounded-2xl border border-dashed py-12 text-center text-sm"
              style={{ borderColor: style.glassBorder, color: style.textMuted }}
            >
              Aucun lien pour le moment
            </li>
          ) : (
            links.map((link) => {
              const color = getNetworkColor(link.icon);
              const href = normalizeUrl(link.url);

              return (
                <motion.li
                  key={link.id}
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => !previewMode && trackClick(link.id)}
                    className={cn(
                      "group flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-200",
                      "border hover:scale-[1.02] active:scale-[0.99]",
                      useGlass ? "backdrop-blur-md" : ""
                    )}
                    style={{
                      borderRadius: Math.max(12, style.borderRadius - 8),
                      background: style.buttonBg,
                      color: style.buttonText,
                      borderColor: style.glassBorder,
                      boxShadow: useGlow ? `0 0 20px ${style.glow}22` : undefined,
                    }}
                  >
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                      style={{
                        background: `${style.icon}33`,
                        color: style.icon || color,
                      }}
                    >
                      <SocialIcon network={link.icon} className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1 text-left">
                      <span className="block font-semibold">
                        {link.title || getNetworkLabel(link.icon)}
                      </span>
                      <span
                        className="block truncate text-xs"
                        style={{ color: style.textMuted }}
                      >
                        {link.url.replace(/^https?:\/\//, "")}
                      </span>
                      {(link.clicks ?? 0) > 0 && (
                        <span className="text-[10px] opacity-60">
                          {link.clicks} clic{link.clicks !== 1 ? "s" : ""}
                        </span>
                      )}
                    </span>
                    <ExternalLink className="h-4 w-4 shrink-0 opacity-40 group-hover:opacity-80" />
                  </a>
                </motion.li>
              );
            })
          )}
        </motion.ul>

        {!previewMode && (
          <footer className="mt-auto pt-12 pb-6">
            <Link
              href="/"
              className="text-xs transition-colors hover:opacity-80"
              style={{ color: style.textMuted }}
            >
              Créé avec BioFlow
            </Link>
          </footer>
        )}
      </main>
    </div>
  );
}
