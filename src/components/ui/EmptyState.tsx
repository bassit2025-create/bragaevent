import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
  icon = "🌱",
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-ink/15 bg-cream-soft/60 px-6 py-16 text-center">
      <div className="text-4xl">{icon}</div>
      <h3 className="mt-4 font-display text-lg font-bold text-ink">
        {title}
      </h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-ink-soft">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
