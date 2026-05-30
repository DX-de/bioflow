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
  const [user, setUser] = useState({
    ...initialUser,
    plan: normalizePlan(initialUser.plan),
  });
  const [links, setLinks] = useState(initialLinks);
  const pro = isPro(user.plan);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-dvh gradient-mesh">
      <Header user={{ email }} onLogout={handleLogout} />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
            <p className="mt-1 text-zinc-400 text-sm sm:text-base">
              Personnalisez votre page — /{user.username}
            </p>
          </div>
          {pro && (
            <span className="inline-flex items-center gap-1 rounded-full bg-violet-600/20 px-3 py-1 text-xs font-semibold text-violet-300 ring-1 ring-violet-500/30 w-fit">
              Pro
            </span>
          )}
        </div>

        <SubscriptionSection user={user} />
        <ProfileEditor user={user} onUpdate={setUser} />
        <LinksManager user={user} links={links} onUpdate={setLinks} />
        <ProFeatures user={user} username={user.username} />
      </main>
    </div>
  );
}
