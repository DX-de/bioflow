"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { Link as BioLink, User } from "@/types/database";
import { SocialIcon, getNetworkColor, getNetworkLabel } from "@/components/social-icons";
import { hexToRgba, normalizeUrl } from "@/lib/utils";
import { parseProfileEffects, clampVolume } from "@/lib/profile-effects";
import {
  canUseCustomBackground,
  canUseProfileMusic,
  canUseVisualEffects,
  isPro,
} from "@/lib/plans";
import { ProfileBackground } from "@/components/profile/profile-background";
import { ProfileParticles } from "@/components/profile/profile-particles";
import { EntryGate } from "@/components/profile/entry-gate";
import { ProfileAudioControls } from "@/components/profile/profile-audio-controls";
import { ExternalLink, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type PublicProfileProps = {
  user: User;
  links: BioLink[];
};

export function PublicProfile({ user, links }: PublicProfileProps) {
  const theme = user.theme || "#2563eb";
  const plan = user.plan ?? "free";
  const pro = isPro(plan);
  const effects = parseProfileEffects(user.effects_enabled);
  const proEffects = pro && canUseVisualEffects(plan);
  const showMusic = pro && canUseProfileMusic(plan) && Boolean(user.audio_url?.trim());
  const showBg =
    pro &&
    canUseCustomBackground(plan) &&
    Boolean(user.background_url?.trim() && user.background_type);

  const volume = clampVolume(user.volume);
  const initials = user.username.slice(0, 2).toUpperCase();

  const needsGate = showMusic;
  const [entered, setEntered] = useState(!needsGate);
  const audioRef = useRef<HTMLAudioElement>(null);

  function handleEnter() {
    setEntered(true);
    const audio = audioRef.current;
    if (audio && showMusic) {
      audio.volume = volume;
      audio.muted = false;
      void audio.play().catch(() => {});
    }
  }

  const useGlass = proEffects && effects.glass;
  const useGlow = proEffects && effects.glow;
  const useEntrance = proEffects && effects.entrance;

  return (
    <div className="relative min-h-dvh w-full text-white overflow-x-hidden">
      <ProfileBackground
        url={showBg ? user.background_url : null}
        type={showBg ? user.background_type : null}
        theme={theme}
        enabled={showBg}
      />

      {proEffects && effects.particles && (
        <ProfileParticles theme={theme} enabled />
      )}

      <AnimatePresence>
        {needsGate && !entered && (
          <EntryGate
            key="gate"
            username={user.username}
            theme={theme}
            onEnter={handleEnter}
          />
        )}
      </AnimatePresence>

      {showMusic && entered && (
        <ProfileAudioControls
          audioRef={audioRef}
          audioUrl={user.audio_url!}
          defaultVolume={volume}
          visible
        />
      )}

      {showMusic && !entered && (
        <audio ref={audioRef} src={user.audio_url!} loop preload="none" className="hidden" />
      )}

      <main
        className={cn(
          "relative z-10 mx-auto flex min-h-dvh max-w-lg flex-col items-center px-4 py-10 sm:py-14",
          !entered && needsGate && "pointer-events-none opacity-0"
        )}
      >
        <motion.div
          initial={useEntrance ? { opacity: 0, y: 24, scale: 0.96 } : false}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "w-full flex flex-col items-center text-center",
            useGlass &&
              "rounded-3xl border border-white/10 bg-white/5 px-6 py-8 backdrop-blur-xl shadow-2xl"
          )}
        >
          <div
            className={cn(
              "relative mb-5 h-28 w-28 overflow-hidden rounded-full sm:h-32 sm:w-32",
              "ring-2 ring-white/20 ring-offset-4 ring-offset-transparent"
            )}
            style={
              useGlow
                ? {
                    boxShadow: `0 0 48px ${hexToRgba(theme, 0.55)}, 0 0 96px ${hexToRgba(theme, 0.25)}`,
                  }
                : undefined
            }
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
                className="flex h-full w-full items-center justify-center text-3xl font-bold"
                style={{
                  background: `linear-gradient(135deg, ${theme}, ${hexToRgba(theme, 0.5)})`,
                }}
              >
                {initials}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
            <h1
              className="text-2xl sm:text-3xl font-bold tracking-tight bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, #fff 0%, ${theme} 100%)`,
              }}
            >
              @{user.username}
            </h1>
            {pro && (
              <span
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                style={{
                  background: hexToRgba(theme, 0.2),
                  color: theme,
                  border: `1px solid ${hexToRgba(theme, 0.4)}`,
                }}
              >
                <Sparkles className="h-3 w-3" />
                Pro
              </span>
            )}
          </div>

          {user.bio && (
            <p className="max-w-sm text-sm leading-relaxed text-white/70 sm:text-base">
              {user.bio}
            </p>
          )}
        </motion.div>

        <motion.ul
          className="mt-8 flex w-full flex-col gap-3"
          initial={useEntrance ? "hidden" : false}
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
          }}
        >
          {links.length === 0 ? (
            <li className="rounded-2xl border border-dashed border-white/20 py-12 text-center text-sm text-white/40">
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
                    className={cn(
                      "bio-link-card group flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-200",
                      useGlass
                        ? "border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10"
                        : "border border-white/15 bg-black/40 hover:bg-black/55"
                    )}
                    style={{
                      ["--link-accent" as string]: color,
                    }}
                  >
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
                      style={{
                        background: hexToRgba(color, 0.2),
                        color,
                        boxShadow: useGlow ? `0 0 20px ${hexToRgba(color, 0.35)}` : undefined,
                      }}
                    >
                      <SocialIcon network={link.icon} className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1 text-left">
                      <span className="block font-semibold text-white group-hover:text-white transition-colors">
                        {link.title || getNetworkLabel(link.icon)}
                      </span>
                      <span className="block truncate text-xs text-white/45">
                        {link.url.replace(/^https?:\/\//, "")}
                      </span>
                    </span>
                    <ExternalLink className="h-4 w-4 shrink-0 text-white/30 group-hover:text-white/70 transition-colors" />
                  </a>
                </motion.li>
              );
            })
          )}
        </motion.ul>

        <footer className="mt-auto pt-12 pb-6">
          <Link
            href="/"
            className="text-xs text-white/35 hover:text-white/60 transition-colors"
          >
            Créé avec BioFlow
          </Link>
        </footer>
      </main>
    </div>
  );
}
