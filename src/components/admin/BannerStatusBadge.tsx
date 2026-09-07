import type { BannerStatus } from "@prisma/client";

const config: Record<BannerStatus, { label: string; className: string }> = {
  DRAFT: { label: "Rascunho", className: "bg-ink/8 text-ink" },
  SCHEDULED: { label: "Agendado", className: "bg-azul-soft text-azul" },
  ACTIVE: { label: "Ativo", className: "bg-emerald-100 text-emerald-700" },
  EXPIRED: { label: "Expirado", className: "bg-ink/8 text-ink-soft" },
  DISABLED: { label: "Desativado", className: "bg-red-50 text-red-600" },
};

export function BannerStatusBadge({ status }: { status: BannerStatus }) {
  const { label, className } = config[status];
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${className}`}>
      {label}
    </span>
  );
}
