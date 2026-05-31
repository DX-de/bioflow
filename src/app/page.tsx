import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import {
  ArrowRight,
  Link2,
  Palette,
  Share2,
  Sparkles,
  Zap,
} from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { PageWith3DBackground } from "@/components/background/background-3d";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let user = null;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  }

  const features = [
    {
      icon: Link2,
      title: "Tous vos liens",
      description:
        "Instagram, TikTok, YouTube, Discord et 8 réseaux supportés sur une page unique.",
    },
    {
      icon: Palette,
      title: "Design personnalisé",
      description:
        "Photo, bio, couleur principale — votre page reflète votre identité.",
    },
    {
      icon: Share2,
      title: "URL mémorable",
      description: "bioflow.app/votrepseudo — partagez partout en un clic.",
    },
    {
      icon: Zap,
      title: "Ultra rapide",
      description: "Optimisé pour mobile, animations fluides, interface claire.",
    },
  ];

  return (
    <PageWith3DBackground overlay={0.75}>
      <Header user={user ? { email: user.email } : null} />

      <main>
        <section className="relative mx-auto max-w-6xl px-4 pt-16 pb-24 sm:pt-24 sm:pb-32 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm text-blue-700 mb-8">
            <Sparkles className="h-4 w-4" />
            La bio link nouvelle génération
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl mx-auto text-slate-900">
            Votre univers digital,{" "}
            <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 bg-clip-text text-transparent">
              une seule page
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
            {APP_NAME} centralise vos réseaux sociaux dans une page élégante.
            Inscrivez-vous gratuitement et partagez votre lien en 2 minutes.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Link href="/dashboard">
                <Button size="lg" className="min-w-[200px]">
                  Accéder au dashboard
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/signup">
                  <Button size="lg" className="min-w-[200px]">
                    Commencer gratuitement
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="secondary" size="lg" className="min-w-[200px]">
                    Se connecter
                  </Button>
                </Link>
              </>
            )}
          </div>
          <p className="mt-4 text-sm text-slate-500">
            <Link href="/pricing" className="text-blue-600 hover:underline font-medium">
              Voir les plans Gratuit & Pro →
            </Link>
          </p>

          <div className="mt-16 mx-auto max-w-sm glass rounded-3xl p-6 animate-shimmer">
            <div className="flex flex-col items-center">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-600 to-sky-400 mb-4 shadow-lg shadow-blue-500/30" />
              <p className="font-bold text-lg text-slate-900">@votrepseudo</p>
              <p className="text-sm text-slate-500 mt-1">Créateur · Streamer · Artist</p>
              <div className="mt-6 w-full space-y-2">
                {["Instagram", "TikTok", "YouTube"].map((label) => (
                  <div
                    key={label}
                    className="rounded-xl bg-slate-50 border border-slate-200 py-3 text-sm font-medium text-slate-700"
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 border-t border-slate-200/80">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 text-slate-900">
            Tout ce dont vous avez besoin
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="glass rounded-2xl p-6 transition hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-4">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="font-semibold text-lg mb-2 text-slate-900">{title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-slate-900">
            Prêt à lancer votre page ?
          </h2>
          <p className="text-slate-600 mb-8">
            Rejoignez des créateurs qui centralisent leur présence en ligne.
          </p>
          <Link href={user ? "/dashboard" : "/signup"}>
            <Button size="lg">
              {user ? "Ouvrir le dashboard" : "Créer mon compte"}
            </Button>
          </Link>
        </section>
      </main>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} {APP_NAME}. Tous droits réservés.
      </footer>
    </PageWith3DBackground>
  );
}
