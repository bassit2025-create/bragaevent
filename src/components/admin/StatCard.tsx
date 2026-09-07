import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon,
  tone = "default",
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
  tone?: "default" | "accent" | "success" | "warning";
}) {
  const toneClasses = {
    default: "bg-white text-ink",
    accent: "bg-accent text-white",
    success: "bg-emerald-600 text-white",
    warning: "bg-amber-500 text-white",
  } as const;

  return (
    <div
      className={cn(
        "rounded-2xl p-5 shadow-sm ring-1 ring-ink/5",
        toneClasses[tone]
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "text-sm font-semibold",
            tone === "default" ? "text-ink-soft" : "opacity-90"
          )}
        >
          {label}
        </span>
        <span className={cn(tone === "default" ? "text-ink-soft" : "opacity-90")}>
          {icon}
        </span>
      </div>
      <p className="mt-3 font-display text-3xl font-bold">{value}</p>
    </div>
  );
}
