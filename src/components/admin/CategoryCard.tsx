"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, X } from "lucide-react";
import type { Category } from "@prisma/client";
import {
  updateCategory,
  deleteCategory,
  type CategoryFormState,
} from "@/lib/actions/categories";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";

export function CategoryCard({
  category,
  eventCount,
}: {
  category: Category;
  eventCount: number;
}) {
  const [editing, setEditing] = useState(false);
  const router = useRouter();
  const boundAction = updateCategory.bind(null, category.id);
  const [state, formAction, pending] = useActionState<
    CategoryFormState,
    FormData
  >(boundAction, undefined);

  if (editing) {
    return (
      <form
        action={async (formData) => {
          await formAction(formData);
          router.refresh();
        }}
        className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-ink/10"
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wide text-ink-soft">
            Editar categoria
          </span>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="text-ink-soft hover:text-ink"
          >
            <X size={16} />
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <input
            name="name"
            defaultValue={category.name}
            className="input"
            placeholder="Nome"
          />
          <div className="flex gap-2">
            <input
              name="icon"
              defaultValue={category.icon}
              className="input w-20 text-center"
              placeholder="🎵"
            />
            <input
              name="color"
              type="color"
              defaultValue={category.color}
              className="h-10 w-14 shrink-0 rounded-lg border-0"
            />
          </div>
          {state?.error && (
            <p className="text-xs font-medium text-red-600">{state.error}</p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="mt-1 rounded-lg bg-accent py-2 text-xs font-bold text-white disabled:opacity-60"
          >
            {pending ? "A guardar..." : "Guardar"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div
      className="relative flex flex-col justify-between overflow-hidden rounded-2xl p-5"
      style={{ backgroundColor: category.color }}
    >
      <div className="flex items-start justify-between">
        <span className="text-3xl">{category.icon}</span>
        <button
          onClick={() => setEditing(true)}
          className="rounded-full bg-white/20 p-1.5 text-white hover:bg-white/30"
        >
          <Pencil size={14} />
        </button>
      </div>
      <div className="mt-4">
        <h3 className="font-display text-base font-bold text-white">
          {category.name}
        </h3>
        <p className="text-sm text-white/80">
          {eventCount} {eventCount === 1 ? "evento" : "eventos"}
        </p>
      </div>
      {eventCount === 0 && (
        <div className="mt-3">
          <ConfirmDeleteButton
            confirmMessage="Eliminar categoria?"
            label="Eliminar"
            action={async () => {
              await deleteCategory(category.id);
              router.refresh();
            }}
          />
        </div>
      )}
    </div>
  );
}
