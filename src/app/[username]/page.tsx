import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PublicProfile } from "@/components/profile/public-profile";
import type { Metadata } from "next";
import type { Link } from "@/types/database";
import {
  sanitizePublicProfile,
  normalizeUserRow,
  normalizeLinkRow,
} from "@/lib/sanitize-profile";

type PageProps = {
  params: Promise<{ username: string }>;
};

export const dynamic = "force-dynamic";

const RESERVED = new Set([
  "login",
  "signup",
  "dashboard",
  "pricing",
  "customize",
  "api",
  "auth",
  "_next",
  "favicon.ico",
]);

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username } = await params;

  if (RESERVED.has(username.toLowerCase())) {
    return { title: "Page introuvable" };
  }

  const supabase = await createClient();
  const { data: user } = await supabase
    .from("users")
    .select("username, bio")
    .eq("username", username.toLowerCase())
    .maybeSingle();

  if (!user) {
    return { title: "Profil introuvable" };
  }

  return {
    title: `@${user.username}`,
    description: user.bio || `Page BioFlow de @${user.username}`,
  };
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { username } = await params;
  const slug = username.toLowerCase();

  if (RESERVED.has(slug)) {
    notFound();
  }

  const supabase = await createClient();

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("username", slug)
    .maybeSingle();

  if (!user) {
    notFound();
  }

  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", user.id)
    .order("position", { ascending: true });

  const profile = sanitizePublicProfile(
    normalizeUserRow(user as Record<string, unknown>)
  );
  const normalizedLinks = (links ?? []).map((l) =>
    normalizeLinkRow(l as Record<string, unknown>)
  ) as Link[];

  return <PublicProfile user={profile} links={normalizedLinks} />;
}
