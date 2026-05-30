import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import type { Link, User } from "@/types/database";
import { normalizePlan } from "@/lib/plans";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .single();

  if (!profile) {
    redirect("/login");
  }

  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", authUser.id)
    .order("position", { ascending: true });

  const userWithPlan: User = {
    ...(profile as User),
    plan: normalizePlan((profile as User).plan),
  };

  return (
    <DashboardClient
      user={userWithPlan}
      links={(links ?? []) as Link[]}
      email={authUser.email ?? ""}
    />
  );
}
