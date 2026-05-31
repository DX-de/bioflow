"use client";

import { motion } from "framer-motion";
import { hexToRgba } from "@/lib/utils";

type EntryGateProps = {
  username: string;
  accent: string;
  hasMusic?: boolean;
  onEnter: () => void;
};

export function EntryGate({ username, accent, hasMusic, onEnter }: EntryGateProps) {
  return (
    <motion.button
      type="button"
      onClick={onEnter}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center cursor-pointer border-0 bg-black/85 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      aria-label="Entrer sur le profil"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="text-center px-6"
      >
        <p
          className="text-sm uppercase tracking-[0.35em] text-white/50 mb-4"
        >
          @{username}
        </p>
        <h2
          className="text-3xl sm:text-4xl font-bold text-white mb-3"
          style={{
            textShadow: `0 0 40px ${hexToRgba(accent, 0.6)}`,
          }}
        >
          Clique pour entrer
        </h2>
        <p className="text-white/40 text-sm mt-2">
          {hasMusic
            ? "La musique démarre après votre clic"
            : "Appuyez pour découvrir le profil"}
        </p>
        <motion.span
          className="mt-8 inline-block h-12 w-12 rounded-full border-2 border-white/30"
          animate={{
            boxShadow: [
              `0 0 0 0 ${hexToRgba(accent, 0.4)}`,
              `0 0 0 16px ${hexToRgba(accent, 0)}`,
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ borderColor: accent }}
        />
      </motion.div>
    </motion.button>
  );
}
