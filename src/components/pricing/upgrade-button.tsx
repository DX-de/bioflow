"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STRIPE_NOT_CONNECTED_MESSAGE } from "@/lib/stripe/config";
import { cn } from "@/lib/utils";

type UpgradeButtonProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary";
  label?: string;
};

export function UpgradeButton({
  className,
  size = "md",
  variant = "primary",
  label = "Passer en Pro",
}: UpgradeButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleUpgrade() {
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();

      if (res.status === 501 || data.code === "STRIPE_NOT_CONFIGURED") {
        router.push("/pricing?upgrade=1");
        return;
      }

      if (!res.ok) {
        throw new Error(data.error ?? "Erreur checkout");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setMessage(STRIPE_NOT_CONNECTED_MESSAGE);
      router.push("/pricing?upgrade=1");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Button
        type="button"
        variant={variant}
        size={size}
        loading={loading}
        onClick={handleUpgrade}
        className={cn(!className?.includes("w-full") && "w-full sm:w-auto")}
      >
        <Crown className="h-4 w-4" />
        {label}
      </Button>
      {message && (
        <p className="text-xs text-amber-700">{message}</p>
      )}
    </div>
  );
}
