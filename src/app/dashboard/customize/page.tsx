import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CustomizeClient } from "@/components/dashboard/customize-client";
import { normalizeUserRow, normalizeLinkRow } from "@/lib/sanitize-profile";
import type { Link } from "@/types/database";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Personnaliser — BioFlow",
};

export default async function CustomizePage() {
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

  const user = normalizeUserRow(profile as Record<string, unknown>);
  const normalizedLinks = (links ?? []).map((l) =>
    normalizeLinkRow(l as Record<string, unknown>)
  ) as Link[];

  return (
    <CustomizeClient
      user={user}
      links={normalizedLinks}
      email={authUser.email ?? ""}
    />
  );
}
