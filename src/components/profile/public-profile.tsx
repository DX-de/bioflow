"use client";

import Image from "next/image";
import NextLink from "next/link";
import { motion } from "framer-motion";
import type { Link as BioLink, User } from "@/types/database";
import { SocialIcon, getNetworkColor, getNetworkLabel } from "@/components/social-icons";
import { hexToRgba, normalizeUrl } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

type PublicProfileProps = {
  user: User;
  links: BioLink[];
};

export function PublicProfile({ user, links }: PublicProfileProps) {
  const theme = user.theme || "#8b5cf6";
  const displayName = user.username;
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div
      className="min-h-dvh w-full"
      style={{
        background: `linear-gradient(180deg, ${hexToRgba(theme, 0.15)} 0%, #09090b 40%, #09090b 100%)`,
      }}
    >
      <div
        className="pointer-events-none fixed inset-0 opacity-40"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 50% 0%, ${hexToRgba(theme, 0.35)}, transparent)`,
        }}
      />

      <main className="relative mx-auto flex min-h-dvh max-w-lg flex-col items-center px-4 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex w-full flex-col items-center text-center"
        >
          <div
            className="relative mb-6 h-28 w-28 overflow-hidden rounded-full ring-4 ring-offset-4 ring-offset-zinc-950 sm:h-32 sm:w-32"
            style={{ boxShadow: `0 0 40px ${hexToRgba(theme, 0.5)}`, borderColor: theme }}
          >
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={displayName}
                fill
                className="object-cover"
                priority
                unoptimized
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center text-3xl font-bold text-white"
                style={{ background: `linear-gradient(135deg, ${theme}, ${hexToRgba(theme, 0.6)})` }}
              >
                {initials}
              </div>
            )}
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            @{user.username}
          </h1>

          {user.bio && (
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-400 sm:text-base">
              {user.bio}
            </p>
          )}
        </motion.div>

        <motion.ul
          className="mt-10 flex w-full flex-col gap-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.08 },
            },
          }}
        >
          {links.length === 0 ? (
            <li className="rounded-2xl border border-dashed border-zinc-700/80 py-12 text-center text-sm text-zinc-500">
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
                    hidden: { opacity: 0, y: 16 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-card-glow group flex items-center gap-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 px-5 py-4"
                    style={{
                      borderColor: hexToRgba(color, 0.2),
                    }}
                  >
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                      style={{ background: hexToRgba(color, 0.15), color }}
                    >
                      <SocialIcon network={link.icon} className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1 text-left">
                      <span className="block font-medium text-white group-hover:text-violet-200 transition-colors">
                        {link.title || getNetworkLabel(link.icon)}
                      </span>
                      <span className="block truncate text-xs text-zinc-500">
                        {link.url.replace(/^https?:\/\//, "")}
                      </span>
                    </span>
                    <ExternalLink className="h-4 w-4 shrink-0 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                  </a>
                </motion.li>
              );
            })
          )}
        </motion.ul>

        <footer className="mt-auto pt-16 pb-4">
          <NextLink
            href="/"
            className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            Créé avec BioFlow
          </NextLink>
        </footer>
      </main>
    </div>
  );
}
