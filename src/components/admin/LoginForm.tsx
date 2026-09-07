"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/lib/actions/auth";
import { Lock, Mail } from "lucide-react";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    undefined
  );

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-semibold text-ink"
        >
          Email
        </label>
        <div className="flex items-center gap-2 rounded-xl bg-cream-soft px-3 ring-1 ring-ink/10 focus-within:ring-2 focus-within:ring-accent">
          <Mail size={18} className="text-ink-soft" />
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="username"
            placeholder="admin@bragaevent.pt"
            className="w-full bg-transparent py-3 text-sm text-ink placeholder:text-ink-soft/50 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-semibold text-ink"
        >
          Palavra-passe
        </label>
        <div className="flex items-center gap-2 rounded-xl bg-cream-soft px-3 ring-1 ring-ink/10 focus-within:ring-2 focus-within:ring-accent">
          <Lock size={18} className="text-ink-soft" />
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full bg-transparent py-3 text-sm text-ink placeholder:text-ink-soft/50 focus:outline-none"
          />
        </div>
      </div>

      {state?.error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-xl bg-accent py-3 text-sm font-bold text-white transition-colors hover:bg-accent-dark active:scale-[0.98] disabled:opacity-60"
      >
        {pending ? "A entrar..." : "Entrar"}
      </button>
    </form>
  );
}
