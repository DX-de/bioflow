import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-dvh gradient-mesh flex flex-col items-center justify-center px-4 text-center">
      <p className="text-8xl font-bold text-zinc-800">404</p>
      <h1 className="mt-4 text-2xl font-bold">Page introuvable</h1>
      <p className="mt-2 text-zinc-400">
        Ce profil n&apos;existe pas ou l&apos;URL est incorrecte.
      </p>
      <Link href="/" className="mt-8">
        <Button>Retour à l&apos;accueil</Button>
      </Link>
    </div>
  );
}
