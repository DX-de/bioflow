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
    <header className="sticky top-0 z-50 border-b border-slate-200/80 glass">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white transition group-hover:bg-blue-500 shadow-md shadow-blue-600/20">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            {APP_NAME}
          </span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/pricing"
            className={cn(
              "hidden sm:inline text-sm font-medium transition-colors",
              pathname === "/pricing"
                ? "text-blue-600"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            Tarifs
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                className={cn(
                  "hidden sm:inline text-sm font-medium transition-colors",
                  isDashboard ? "text-blue-600" : "text-slate-600 hover:text-slate-900"
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
