"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Link, User } from "@/types/database";
import { normalizePlan, isPro } from "@/lib/plans";
import { Header } from "@/components/layout/header";
import { ProfileEditor } from "@/components/dashboard/profile-editor";
import { LinksManager } from "@/components/dashboard/links-manager";
import { SubscriptionSection } from "@/components/dashboard/subscription-section";
import { ProFeatures } from "@/components/dashboard/pro-features";
import { AdvancedCustomization } from "@/components/dashboard/advanced-customization";
import { parseProfileEffects, clampVolume } from "@/lib/profile-effects";
import { PageWith3DBackground } from "@/components/background/background-3d";

type DashboardClientProps = {
  user: User;
  links: Link[];
  email: string;
};

export function DashboardClient({
  user: initialUser,
  links: initialLinks,
  email,
}: DashboardClientProps) {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User>({
    ...initialUser,
    plan: normalizePlan(initialUser.plan),
    effects_enabled: parseProfileEffects(initialUser.effects_enabled),
    volume: clampVolume(initialUser.volume),
    audio_url: initialUser.audio_url ?? null,
    background_url: initialUser.background_url ?? null,
    background_type: initialUser.background_type ?? null,
  });
  const [links, setLinks] = useState(initialLinks);
  const pro = isPro(user.plan);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <PageWith3DBackground overlay={0.82}>
      <Header user={{ email }} onLogout={handleLogout} />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="mt-1 text-slate-600 text-sm sm:text-base">
              Personnalisez votre page — /{user.username}
            </p>
          </div>
          {pro && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200 w-fit">
              Pro
            </span>
          )}
        </div>

        <SubscriptionSection user={user} />
        <ProfileEditor user={user} onUpdate={setUser} />
        <AdvancedCustomization user={user} onUpdate={setUser} />
        <LinksManager user={user} links={links} onUpdate={setLinks} />
        <ProFeatures user={user} username={user.username} />
      </main>
    </PageWith3DBackground>
  );
}
