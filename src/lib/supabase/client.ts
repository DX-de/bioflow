import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv, isSupabaseConfigured } from "@/lib/supabase/config";

export function createClient() {
  const { url, anonKey } = getSupabaseEnv();

  if (!isSupabaseConfigured()) {
    throw new Error(
      "SUPABASE_NOT_CONFIGURED"
    );
  }

  return createBrowserClient(url, anonKey);
}
