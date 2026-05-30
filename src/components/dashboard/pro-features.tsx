"use client";

import Link from "next/link";
import {
  BarChart3,
  Globe,
  Lock,
  QrCode,
} from "lucide-react";
import type { User } from "@/types/database";
import { isPro } from "@/lib/plans";
import { Card } from "@/components/ui/card";
import { UpgradeButton } from "@/components/pricing/upgrade-button";
import { cn } from "@/lib/utils";

type ProFeaturesProps = {
  user: User;
  username: string;
};

function ProLock({ children, locked }: { children: React.ReactNode; locked: boolean }) {
  return (
    <div className="relative">
      {children}
      {locked && (
        <div className="absolute inset-0 rounded-2xl bg-zinc-950/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3 p-4">
          <Lock className="h-8 w-8 text-violet-400/80" />
          <p className="text-sm text-zinc-300 text-center max-w-xs">
            Fonctionnalité réservée au plan Pro
          </p>
          <UpgradeButton size="sm" label="Débloquer" />
        </div>
      )}
    </div>
  );
}

export function ProFeatures({ user, username }: ProFeaturesProps) {
  const pro = isPro(user.plan ?? "free");
  const profilePath = `/${username}`;

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Card className="sm:col-span-2">
        <ProLock locked={!pro}>
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-violet-400" />
            <h3 className="font-semibold">Statistiques détaillées</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Vues page", value: pro ? "—" : "0" },
              { label: "Clics liens", value: pro ? "—" : "0" },
              { label: "Taux clic", value: pro ? "—" : "0%" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl bg-zinc-900/80 border border-zinc-800 p-4 text-center"
              >
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-zinc-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
          {pro && (
            <p className="mt-4 text-xs text-zinc-500">
              Les statistiques en temps réel seront disponibles après
              l&apos;activation du suivi des clics.
            </p>
          )}
        </ProLock>
      </Card>

      <Card>
        <ProLock locked={!pro}>
          <div className="flex items-center gap-2 mb-4">
            <QrCode className="h-5 w-5 text-violet-400" />
            <h3 className="font-semibold">QR Code</h3>
          </div>
          <div
            className={cn(
              "mx-auto flex h-36 w-36 items-center justify-center rounded-2xl border-2 border-dashed",
              pro ? "border-violet-500/40 bg-violet-500/5" : "border-zinc-700"
            )}
          >
            <QrCode className="h-16 w-16 text-zinc-600" />
          </div>
          <p className="mt-4 text-xs text-zinc-500 text-center truncate px-2">
            {profilePath}
          </p>
        </ProLock>
      </Card>

      <Card>
        <ProLock locked={!pro}>
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-5 w-5 text-violet-400" />
            <h3 className="font-semibold">Domaine personnalisé</h3>
          </div>
          <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-500">
            links.votredomaine.com
          </div>
          <p className="mt-3 text-xs text-zinc-500">
            Connectez votre propre domaine (configuration DNS à venir).
          </p>
        </ProLock>
      </Card>

      {!pro && (
        <p className="sm:col-span-2 text-center text-sm text-zinc-500">
          <Link href="/pricing" className="text-violet-400 hover:underline">
            Voir tous les avantages Pro
          </Link>
        </p>
      )}
    </div>
  );
}
