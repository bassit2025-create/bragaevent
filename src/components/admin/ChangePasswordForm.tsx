"use client";

import { useActionState } from "react";
import { changePassword, type SettingsState } from "@/lib/actions/settings";

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState<SettingsState, FormData>(
    changePassword,
    undefined
  );
  const errors = state?.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink">
          Palavra-passe atual
        </label>
        <input
          name="currentPassword"
          type="password"
          required
          className="input"
        />
        {errors.currentPassword && (
          <p className="mt-1 text-xs font-medium text-red-600">
            {errors.currentPassword[0]}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink">
          Nova palavra-passe
        </label>
        <input name="newPassword" type="password" required className="input" />
        {errors.newPassword && (
          <p className="mt-1 text-xs font-medium text-red-600">
            {errors.newPassword[0]}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink">
          Confirmar nova palavra-passe
        </label>
        <input
          name="confirmPassword"
          type="password"
          required
          className="input"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-xs font-medium text-red-600">
            {errors.confirmPassword[0]}
          </p>
        )}
      </div>

      {state?.error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
          {state.success}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-2xl bg-accent px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-accent-dark disabled:opacity-60"
      >
        {pending ? "A guardar..." : "Atualizar palavra-passe"}
      </button>
    </form>
  );
}
