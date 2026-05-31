"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { Link as BioLink, User } from "@/types/database";
import { SocialIcon, getNetworkColor, getNetworkLabel } from "@/components/social-icons";
import { normalizeUrl } from "@/lib/utils";
import { parseProfileEffects } from "@/lib/profile-effects";
import {
  canUseCustomBackground,
  canUseProfileMusic,
  canUseVisualEffects,
  isPro,
} from "@/lib/plans";
import { getTheme } from "@/lib/themes";
import { ProfileBackground } from "@/components/profile/profile-background";
import {
  ProfileCursorTrail,
  ProfileEffectsLayer,
} from "@/components/profile/profile-effects-layer";
import { EntryGate } from "@/components/profile/entry-gate";
import { ProfileAudioControls } from "@/components/profile/profile-audio-controls";
import { ExternalLink, Eye, Sparkles } from "lucide-react";
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

function animationVariants(type: string) {
  switch (type) {
    case "scale":
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

export function PublicProfile({
  user,
  links,
  previewMode = false,
}: PublicProfileProps) {
  const themePreset = getTheme(user.theme);
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
  const accent = themePreset.accent;

  const needsGate = !previewMode;
  const [entered, setEntered] = useState(!needsGate);
  const audioRef = useRef<HTMLAudioElement>(null);
  const viewTracked = useRef(false);

  function handleEnter() {
    setEntered(true);
    if (!viewTracked.current && !previewMode) {
      viewTracked.current = true;
      trackView(user.id);
    }
    const audio = audioRef.current;
    if (audio && showMusic) {
      audio.volume = volume;
      audio.muted = false;
      void audio.play().catch(() => {});
    }
  }

  const useGlass = proEffects && effects.glass;
  const useGlow = proEffects && effects.glow;
  const anim = user.profile_animation ?? "fade";
  const cardAnim = animationVariants(anim);
  const avatarAnim =
    anim === "scale"
      ? { animate: { scale: [1, 1.04, 1] }, transition: { duration: 3, repeat: Infinity } }
      : undefined;

  const effectType =
    proEffects && user.effect_type !== "none" ? user.effect_type : "none";
  const cursorTrail =
    proEffects && user.cursor_effect === "trail";

  return (
    <div
      className="relative min-h-dvh w-full overflow-x-hidden"
      style={{ color: themePreset.textPrimary }}
    >
      <ProfileBackground
        url={showBg ? user.background_url : null}
        type={showBg ? user.background_type : null}
        theme={themePreset}
        enabled={showBg}
        blur={user.background_blur ?? 0}
        opacity={user.background_opacity ?? 0.55}
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
            onEnter={handleEnter}
          />
        )}
      </AnimatePresence>

      {showMusic && entered && (
        <ProfileAudioControls
          audioRef={audioRef}
          audioUrl={user.audio_url!}
          audioTitle={user.audio_title}
          accent={accent}
          defaultVolume={volume}
          visible
        />
      )}

      {showMusic && !entered && (
        <audio
          ref={audioRef}
          src={user.audio_url!}
          loop
          preload="none"
          className="hidden"
        />
      )}

      <main
        className={cn(
          "relative z-10 mx-auto flex min-h-dvh max-w-lg flex-col items-center px-4 py-10 sm:py-14",
          !entered && needsGate && "pointer-events-none opacity-0"
        )}
      >
        <motion.div
          {...cardAnim}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "w-full flex flex-col items-center text-center",
            useGlass &&
              "rounded-3xl px-6 py-8 backdrop-blur-xl shadow-2xl border"
          )}
          style={
            useGlass
              ? {
                  background: themePreset.glassBg,
                  borderColor: themePreset.glassBorder,
                  boxShadow: useGlow
                    ? `0 0 60px ${accent}33, 0 25px 50px -12px rgba(0,0,0,0.5)`
                    : undefined,
                }
              : undefined
          }
        >
          <motion.div
            className={cn(
              "relative mb-5 h-28 w-28 overflow-hidden rounded-full sm:h-32 sm:w-32",
              "ring-2 ring-offset-4 ring-offset-transparent"
            )}
            style={{
              boxShadow: useGlow
                ? `0 0 48px ${accent}88, 0 0 96px ${accent}33, 0 0 0 2px ${accent}55`
                : `0 0 0 2px ${accent}44`,
            }}
            animate={avatarAnim?.animate}
            transition={avatarAnim?.transition}
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
                  background: `linear-gradient(135deg, ${accent}, ${themePreset.accentSecondary})`,
                }}
              >
                {initials}
              </div>
            )}
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
            <h1
              className="text-2xl sm:text-3xl font-bold tracking-tight"
              style={{
                backgroundImage: `linear-gradient(135deg, ${themePreset.textPrimary}, ${accent})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
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
              style={{ color: themePreset.textMuted }}
            >
              {user.bio}
            </p>
          )}

          <div
            className="mt-4 flex items-center gap-1.5 text-xs"
            style={{ color: themePreset.textMuted }}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>
              {(user.views ?? 0).toLocaleString("fr-FR")} vues
            </span>
          </div>
        </motion.div>

        <motion.ul
          className="mt-8 flex w-full flex-col gap-3"
          initial={effects.entrance && entered ? "hidden" : false}
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
          }}
        >
          {links.length === 0 ? (
            <li
              className="rounded-2xl border border-dashed py-12 text-center text-sm"
              style={{ borderColor: themePreset.glassBorder, color: themePreset.textMuted }}
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
                      background: useGlass ? themePreset.glassBg : "rgba(0,0,0,0.45)",
                      borderColor: themePreset.glassBorder,
                      boxShadow: useGlow ? `0 0 24px ${color}22` : undefined,
                    }}
                  >
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                      style={{
                        background: `${color}33`,
                        color,
                      }}
                    >
                      <SocialIcon network={link.icon} className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1 text-left">
                      <span className="block font-semibold transition-colors">
                        {link.title || getNetworkLabel(link.icon)}
                      </span>
                      <span
                        className="block truncate text-xs"
                        style={{ color: themePreset.textMuted }}
                      >
                        {link.url.replace(/^https?:\/\//, "")}
                      </span>
                      {(link.clicks ?? 0) > 0 && (
                        <span className="text-[10px] opacity-60">
                          {link.clicks} clic{link.clicks !== 1 ? "s" : ""}
                        </span>
                      )}
                    </span>
                    <ExternalLink className="h-4 w-4 shrink-0 opacity-40 group-hover:opacity-80 transition-opacity" />
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
              style={{ color: themePreset.textMuted }}
            >
              Créé avec BioFlow
            </Link>
          </footer>
        )}
      </main>
    </div>
  );
}
