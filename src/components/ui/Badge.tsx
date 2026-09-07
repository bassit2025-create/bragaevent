import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Tone = "accent" | "ink" | "success" | "warning" | "neutral" | "azul";

const toneClasses: Record<Tone, string> = {
  accent: "bg-accent text-white",
  ink: "bg-ink text-cream",
  success: "bg-emerald-600 text-white",
  warning: "bg-amber-500 text-white",
  neutral: "bg-ink/8 text-ink",
  azul: "bg-azul text-white",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
