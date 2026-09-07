"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

export function ConfirmDeleteButton({
  action,
  confirmMessage,
  label,
}: {
  action: () => Promise<void>;
  confirmMessage: string;
  label?: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-red-50 px-2 py-1">
        <span className="text-xs font-semibold text-red-700">
          {confirmMessage}
        </span>
        <button
          disabled={pending}
          onClick={async () => {
            setPending(true);
            await action();
            setPending(false);
          }}
          className="rounded-md bg-red-600 px-2 py-1 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-60"
        >
          {pending ? "..." : "Sim"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="rounded-md px-2 py-1 text-xs font-semibold text-ink-soft hover:bg-ink/5"
        >
          Não
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
      title={label ?? "Eliminar"}
    >
      <Trash2 size={14} />
      {label}
    </button>
  );
}
