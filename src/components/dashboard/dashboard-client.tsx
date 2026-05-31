"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Link as BioLink, User } from "@/types/database";
import { isPro } from "@/lib/plans";
import { normalizeUserRow } from "@/lib/sanitize-profile";
import { Header } from "@/components/layout/header";
import { ProfileEditor } from "@/components/dashboard/profile-editor";
import { LinksManager } from "@/components/dashboard/links-manager";
import { SubscriptionSection } from "@/components/dashboard/subscription-section";
import { ProFeatures } from "@/components/dashboard/pro-features";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";
import { PageWith3DBackground } from "@/components/background/background-3d";
import { Card } from "@/components/ui/card";

type DashboardClientProps = {
  user: User;
  links: BioLink[];
  email: string;
};

export function DashboardClient({
  user: initialUser,
  links: initialLinks,
  email,
}: DashboardClientProps) {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User>(
    normalizeUserRow(initialUser as unknown as Record<string, unknown>)
  );
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
        <Card className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Bio-page premium</h2>
            <p className="text-sm text-slate-600 mt-1">
              Musique, fond animé, effets visuels et thèmes
            </p>
          </div>
          <Link href="/dashboard/customize">
            <Button type="button">
              <Palette className="h-4 w-4" />
              Personnaliser
            </Button>
          </Link>
        </Card>
        <ProfileEditor user={user} onUpdate={setUser} />
        <LinksManager user={user} links={links} onUpdate={setLinks} />
        <ProFeatures user={user} username={user.username} />
      </main>
    </PageWith3DBackground>
  );
}
