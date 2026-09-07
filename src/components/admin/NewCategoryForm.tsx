"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { createCategory, type CategoryFormState } from "@/lib/actions/categories";

export function NewCategoryForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<
    CategoryFormState,
    FormData
  >(createCategory, undefined);

  return (
    <form
      action={async (formData) => {
        await formAction(formData);
        router.refresh();
      }}
      className="flex flex-wrap items-end gap-2 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-ink/5"
    >
      <div>
        <label className="mb-1 block text-xs font-semibold text-ink-soft">
          Nome
        </label>
        <input name="name" required className="input" placeholder="Nova categoria" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-ink-soft">
          Ícone
        </label>
        <input
          name="icon"
          required
          defaultValue="✨"
          className="input w-20 text-center"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-ink-soft">
          Cor
        </label>
        <input
          name="color"
          type="color"
          defaultValue="#FF5A3C"
          className="h-[42px] w-16 rounded-lg border-0"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
      >
        <Plus size={16} /> {pending ? "A criar..." : "Adicionar"}
      </button>
      {state?.error && (
        <p className="w-full text-xs font-medium text-red-600">{state.error}</p>
      )}
    </form>
  );
}
