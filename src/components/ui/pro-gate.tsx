import { Crown } from "lucide-react";
import { PRO_LOCKED_MESSAGE } from "@/lib/plans";
import { cn } from "@/lib/utils";

type ProGateProps = {
  locked: boolean;
  className?: string;
  children: React.ReactNode;
};

export function ProGate({ locked, className, children }: ProGateProps) {
  if (!locked) return <>{children}</>;

  return (
    <div className={cn("relative", className)}>
      <div className="pointer-events-none select-none opacity-50">{children}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-slate-900/60 backdrop-blur-[2px] p-4 text-center">
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400 border border-amber-500/30 mb-2">
          <Crown className="h-3 w-3" />
          Pro
        </span>
        <p className="text-xs text-slate-300 max-w-[220px]">{PRO_LOCKED_MESSAGE}</p>
      </div>
    </div>
  );
}
