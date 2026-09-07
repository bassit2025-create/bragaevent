"use client";

import { useActionState } from "react";
import type { Banner } from "@prisma/client";
import type { BannerFormState } from "@/lib/actions/banners";

type Props = {
  banner?: Banner;
  action: (
    state: BannerFormState,
    formData: FormData
  ) => Promise<BannerFormState>;
  submitLabel: string;
};

function toDateInputValue(date: Date) {
  return new Date(date).toISOString().slice(0, 10);
}

export function BannerForm({ banner, action, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState<BannerFormState, FormData>(
    action,
    undefined
  );
  const errors = state?.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state?.error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {state.error}
        </p>
      )}

      <Section title="Detalhes da campanha">
        <Field label="Nome do banner" error={errors.name?.[0]}>
          <input
            name="name"
            required
            defaultValue={banner?.name}
            className="input"
            placeholder="Café Rioja — Promoção de Verão"
          />
        </Field>

        <Field label="Nome do projeto/negócio" error={errors.projectName?.[0]}>
          <input
            name="projectName"
            required
            defaultValue={banner?.projectName}
            className="input"
            placeholder="Café Rioja"
          />
        </Field>

        <Field label="Descrição (opcional)" error={errors.description?.[0]}>
          <textarea
            name="description"
            rows={3}
            defaultValue={banner?.description ?? undefined}
            className="input resize-none"
            placeholder="15% de desconto em todas as bebidas..."
          />
        </Field>
      </Section>

      <Section title="Imagem e destino">
        <Field label="Imagem do banner (URL)" error={errors.image?.[0]}>
          <input
            name="image"
            type="url"
            required
            defaultValue={banner?.image}
            className="input"
            placeholder="https://..."
          />
        </Field>
        <Field label="URL de destino" error={errors.destinationUrl?.[0]}>
          <input
            name="destinationUrl"
            type="url"
            required
            defaultValue={banner?.destinationUrl}
            className="input"
            placeholder="https://..."
          />
        </Field>
      </Section>

      <Section title="Agendamento">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Data de início" error={errors.startDate?.[0]}>
            <input
              name="startDate"
              type="date"
              required
              defaultValue={banner ? toDateInputValue(banner.startDate) : undefined}
              className="input"
            />
          </Field>
          <Field label="Data de fim" error={errors.endDate?.[0]}>
            <input
              name="endDate"
              type="date"
              required
              defaultValue={banner ? toDateInputValue(banner.endDate) : undefined}
              className="input"
            />
          </Field>
        </div>
        <p className="text-xs text-ink-soft">
          O banner é ativado automaticamente na data de início e removido na
          data de fim.
        </p>
      </Section>

      <Section title="Visibilidade">
        <label className="flex items-center gap-2 text-sm font-semibold text-ink">
          <input
            type="checkbox"
            name="publish"
            defaultChecked={banner ? banner.status !== "DISABLED" : true}
            className="h-4 w-4 rounded accent-accent"
          />
          Publicar (segue o agendamento definido acima)
        </label>
      </Section>

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-2xl bg-accent px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-accent-dark disabled:opacity-60"
        >
          {pending ? "A guardar..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink/5">
      <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wide text-ink-soft">
        {title}
      </h2>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
