"use client";

import type { Link as BioLink, User } from "@/types/database";
import { PublicProfile } from "@/components/profile/public-profile";
import { Button } from "@/components/ui/button";
import { getPublicProfileUrl } from "@/lib/utils";
import { ExternalLink, Monitor, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

type LivePreviewPanelProps = {
  user: User;
  links: BioLink[];
  previewMode: "mobile" | "desktop";
  onPreviewModeChange: (mode: "mobile" | "desktop") => void;
};

export function LivePreviewPanel({
  user,
  links,
  previewMode,
  onPreviewModeChange,
}: LivePreviewPanelProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 overflow-hidden sticky top-4">
      <div className="flex items-center justify-between gap-2 border-b border-zinc-800 px-4 py-3">
        <p className="text-sm font-medium text-zinc-200">Live Preview</p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPreviewModeChange("mobile")}
            className={cn(
              "p-1.5 rounded-lg transition",
              previewMode === "mobile"
                ? "bg-violet-600 text-white"
                : "text-zinc-500 hover:text-zinc-300"
            )}
            aria-label="Vue mobile"
          >
            <Smartphone className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onPreviewModeChange("desktop")}
            className={cn(
              "p-1.5 rounded-lg transition",
              previewMode === "desktop"
                ? "bg-violet-600 text-white"
                : "text-zinc-500 hover:text-zinc-300"
            )}
            aria-label="Vue desktop"
          >
            <Monitor className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        className={cn(
          "mx-auto bg-black transition-all duration-300 overflow-hidden",
          previewMode === "mobile"
            ? "w-[280px] h-[520px] my-4 rounded-[2rem] border-4 border-zinc-700"
            : "w-full h-[min(520px,55vh)]"
        )}
      >
        <div className="h-full overflow-y-auto overflow-x-hidden scale-[0.98] origin-top">
          <PublicProfile user={user} links={links} previewMode />
        </div>
      </div>

      <div className="p-4 border-t border-zinc-800">
        <a
          href={getPublicProfileUrl(user.username)}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Button type="button" variant="secondary" className="w-full">
            <ExternalLink className="h-4 w-4" />
            Ouvrir la page publique
          </Button>
        </a>
      </div>
    </div>
  );
}
