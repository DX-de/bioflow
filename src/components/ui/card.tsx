import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Card({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "glass rounded-2xl p-6 shadow-xl shadow-black/20",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
