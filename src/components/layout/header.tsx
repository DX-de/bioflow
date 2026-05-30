"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

type HeaderProps = {
  user?: { email?: string } | null;
  onLogout?: () => void;
};

export function Header({ user, onLogout }: HeaderProps) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/50 glass">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600/20 text-violet-400 transition group-hover:bg-violet-600/30">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight">{APP_NAME}</span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/pricing"
            className={cn(
              "hidden sm:inline text-sm transition-colors",
              pathname === "/pricing"
                ? "text-violet-400"
                : "text-zinc-400 hover:text-white"
            )}
          >
            Tarifs
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                className={cn(
                  "hidden sm:inline text-sm transition-colors",
                  isDashboard ? "text-violet-400" : "text-zinc-400 hover:text-white"
                )}
              >
                Dashboard
              </Link>
              {onLogout && (
                <Button variant="ghost" size="sm" onClick={onLogout}>
                  Déconnexion
                </Button>
              )}
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Connexion
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary" size="sm">
                  S&apos;inscrire
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
