"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Link as BioLink, SocialNetwork, User } from "@/types/database";
import { SOCIAL_NETWORKS } from "@/lib/constants";
import {
  canAddLink,
  FREE_LINK_LIMIT,
  getRemainingLinks,
  isPro,
} from "@/lib/plans";
import { normalizeUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { SocialIcon, getNetworkColor } from "@/components/social-icons";
import { UpgradeButton } from "@/components/pricing/upgrade-button";
import { GripVertical, Plus, Trash2, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type LinksManagerProps = {
  user: User;
  links: BioLink[];
  onUpdate: (links: BioLink[]) => void;
};

export function LinksManager({ user, links, onUpdate }: LinksManagerProps) {
  const supabase = createClient();
  const plan = user.plan ?? "free";
  const pro = isPro(plan);
  const atLimit = !canAddLink(plan, links.length);
  const remaining = getRemainingLinks(plan, links.length);

  const [items, setItems] = useState(links);
  const [selectedNetwork, setSelectedNetwork] = useState<SocialNetwork>("instagram");
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const network = SOCIAL_NETWORKS.find((n) => n.id === selectedNetwork)!;

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;

    if (atLimit) {
      setError("Passe en Pro pour ajouter des liens illimités.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const normalized = normalizeUrl(url);
      const nextPosition =
        items.length > 0 ? Math.max(...items.map((l) => l.position)) + 1 : 0;

      const { data, error: insertError } = await supabase
        .from("links")
        .insert({
          user_id: user.id,
          title: title.trim() || network.label,
          url: normalized,
          icon: selectedNetwork,
          position: nextPosition,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      const updated = [...items, data].sort((a, b) => a.position - b.position);
      setItems(updated);
      onUpdate(updated);
      setUrl("");
      setTitle("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'ajout");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const { error: deleteError } = await supabase.from("links").delete().eq("id", id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    const updated = items.filter((l) => l.id !== id);
    setItems(updated);
    onUpdate(updated);
  }

  async function moveLink(index: number, direction: "up" | "down") {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;

    const reordered = [...items];
    [reordered[index], reordered[newIndex]] = [
      reordered[newIndex],
      reordered[index],
    ];

    const withPositions = reordered.map((link, i) => ({ ...link, position: i }));
    setItems(withPositions);
    onUpdate(withPositions);

    await Promise.all(
      withPositions.map((link) =>
        supabase.from("links").update({ position: link.position }).eq("id", link.id)
      )
    );
  }

  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
        <h2 className="text-lg font-semibold">Liens sociaux</h2>
        {!pro && (
          <span className="text-xs font-medium text-zinc-400 bg-zinc-800/80 rounded-full px-3 py-1 w-fit">
            {items.length}/{FREE_LINK_LIMIT} liens
          </span>
        )}
      </div>
      <p className="text-sm text-zinc-400 mb-6">
        {pro
          ? "Ajoutez autant de liens que vous voulez."
          : `Plan Gratuit : maximum ${FREE_LINK_LIMIT} liens.`}
      </p>

      {atLimit && (
        <div className="mb-6 rounded-xl border border-violet-500/30 bg-violet-600/10 px-4 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Zap className="h-5 w-5 text-violet-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-violet-200">
                Passe en Pro pour ajouter des liens illimités.
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                Vous avez atteint la limite de {FREE_LINK_LIMIT} liens du plan
                Gratuit.
              </p>
            </div>
          </div>
          <UpgradeButton size="sm" className="shrink-0" />
        </div>
      )}

      <form
        onSubmit={handleAdd}
        className={`space-y-4 mb-8 ${atLimit ? "opacity-50 pointer-events-none" : ""}`}
      >
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Réseau
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {SOCIAL_NETWORKS.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => {
                  setSelectedNetwork(n.id);
                  setTitle("");
                }}
                disabled={atLimit}
                className={`flex flex-col items-center gap-1 rounded-xl p-2 text-xs transition-all ${
                  selectedNetwork === n.id
                    ? "bg-violet-600/20 ring-2 ring-violet-500 text-white"
                    : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800"
                }`}
                title={n.label}
              >
                <SocialIcon network={n.id} className="h-5 w-5" />
                <span className="truncate w-full text-center hidden sm:block">
                  {n.label.split(" ")[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        <Input
          label="Titre (optionnel)"
          placeholder={network.label}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={atLimit}
        />
        <Input
          label="URL"
          type="url"
          placeholder={network.placeholder}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          disabled={atLimit}
        />

        {error && (
          <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {!atLimit && remaining !== null && (
          <p className="text-xs text-zinc-500">
            Il vous reste {remaining} lien{remaining > 1 ? "s" : ""} sur{" "}
            {FREE_LINK_LIMIT}.
          </p>
        )}

        <Button
          type="submit"
          loading={loading}
          disabled={atLimit}
          className="w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Ajouter le lien
        </Button>
      </form>

      <ul className="space-y-2">
        <AnimatePresence mode="popLayout">
          {items.length === 0 ? (
            <li className="text-center py-8 text-sm text-zinc-500 border border-dashed border-zinc-700 rounded-xl">
              Aucun lien ajouté
            </li>
          ) : (
            items.map((link, index) => (
              <motion.li
                key={link.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3"
              >
                <GripVertical className="h-4 w-4 text-zinc-600 shrink-0" />
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-800"
                  style={{ color: getNetworkColor(link.icon) }}
                >
                  <SocialIcon network={link.icon} className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">{link.title}</p>
                  <p className="text-xs text-zinc-500 truncate">{link.url}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => moveLink(index, "up")}
                    disabled={index === 0}
                    aria-label="Monter"
                  >
                    ↑
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => moveLink(index, "down")}
                    disabled={index === items.length - 1}
                    aria-label="Descendre"
                  >
                    ↓
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(link.id)}
                    aria-label="Supprimer"
                  >
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </Button>
                </div>
              </motion.li>
            ))
          )}
        </AnimatePresence>
      </ul>

      {!pro && !atLimit && (
        <p className="mt-4 text-center text-xs text-zinc-500">
          <Link href="/pricing" className="text-violet-400 hover:underline">
            Voir le plan Pro
          </Link>
        </p>
      )}
    </Card>
  );
}
