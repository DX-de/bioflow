const PLACEHOLDER_MARKERS = [
  "votre-projet",
  "votre-cle",
  "your-project",
  "your-anon-key",
  "placeholder",
];

export function getSupabaseEnv() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "",
  };
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseEnv();

  if (!url || !anonKey) return false;

  const looksLikePlaceholder = PLACEHOLDER_MARKERS.some(
    (marker) =>
      url.toLowerCase().includes(marker) ||
      anonKey.toLowerCase().includes(marker)
  );

  if (looksLikePlaceholder) return false;

  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      parsed.hostname.endsWith(".supabase.co")
    );
  } catch {
    return false;
  }
}

export const SUPABASE_SETUP_MESSAGE =
  "Supabase n'est pas configuré. Ouvrez .env.local et ajoutez votre Project URL et votre clé anon (Settings → API dans le dashboard Supabase), puis redémarrez npm run dev.";

export function getConfigErrorMessage(error: unknown): string {
  if (!isSupabaseConfigured()) {
    return SUPABASE_SETUP_MESSAGE;
  }

  const message =
    error instanceof Error ? error.message : "Une erreur est survenue";

  if (
    message.includes("Failed to fetch") ||
    message.includes("NetworkError") ||
    message.includes("fetch resource")
  ) {
    return "Connexion à Supabase impossible. Vérifiez l'URL du projet, que le projet n'est pas en pause, et votre connexion internet.";
  }

  return message;
}
