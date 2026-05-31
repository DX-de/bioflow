import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageWith3DBackground } from "@/components/background/background-3d";

export default function NotFound() {
  return (
    <PageWith3DBackground overlay={0.8}>
      <div className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
        <p className="text-8xl font-bold text-slate-200">404</p>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Page introuvable</h1>
        <p className="mt-2 text-slate-600">
          Ce profil n&apos;existe pas ou l&apos;URL est incorrecte.
        </p>
        <Link href="/" className="mt-8">
          <Button>Retour à l&apos;accueil</Button>
        </Link>
      </div>
    </PageWith3DBackground>
  );
}
