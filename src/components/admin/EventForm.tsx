"use client";

import { useActionState, useState } from "react";
import type { Category, Event } from "@prisma/client";
import type { EventFormState } from "@/lib/actions/events";

type Props = {
  categories: Category[];
  event?: Event;
  action: (
    state: EventFormState,
    formData: FormData
  ) => Promise<EventFormState>;
  submitLabel: string;
};

function toDateInputValue(date: Date) {
  return new Date(date).toISOString().slice(0, 10);
}

export function EventForm({ categories, event, action, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState<EventFormState, FormData>(
    action,
    undefined
  );
  const [isFree, setIsFree] = useState(event?.isFree ?? true);

  const errors = state?.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state?.error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {state.error}
        </p>
      )}

      <Section title="Informação principal">
        <Field label="Título do evento" error={errors.title?.[0]}>
          <input
            name="title"
            required
            defaultValue={event?.title}
            className="input"
            placeholder="Braga Music Nights"
          />
        </Field>

        <Field label="Imagem de capa (URL)" error={errors.image?.[0]}>
          <input
            name="image"
            type="url"
            required
            defaultValue={event?.image}
            className="input"
            placeholder="https://..."
          />
        </Field>

        <Field label="Descrição" error={errors.description?.[0]}>
          <textarea
            name="description"
            required
            rows={5}
            defaultValue={event?.description}
            className="input resize-none"
            placeholder="Descreve o evento..."
          />
        </Field>
      </Section>

      <Section title="Data, hora e local">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Data" error={errors.date?.[0]}>
            <input
              name="date"
              type="date"
              required
              defaultValue={event ? toDateInputValue(event.date) : undefined}
              className="input"
            />
          </Field>
          <Field label="Hora de início" error={errors.startTime?.[0]}>
            <input
              name="startTime"
              type="time"
              required
              defaultValue={event?.startTime}
              className="input"
            />
          </Field>
          <Field label="Hora de fim (opcional)" error={errors.endTime?.[0]}>
            <input
              name="endTime"
              type="time"
              defaultValue={event?.endTime ?? undefined}
              className="input"
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Local" error={errors.location?.[0]}>
            <input
              name="location"
              required
              defaultValue={event?.location}
              className="input"
              placeholder="Theatro Circo"
            />
          </Field>
          <Field label="Endereço" error={errors.address?.[0]}>
            <input
              name="address"
              required
              defaultValue={event?.address}
              className="input"
              placeholder="Av. da Liberdade 697, Braga"
            />
          </Field>
        </div>
      </Section>

      <Section title="Categoria e preço">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Categoria" error={errors.categoryId?.[0]}>
            <select
              name="categoryId"
              required
              defaultValue={event?.categoryId}
              className="input"
            >
              <option value="">Escolhe uma categoria</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Preço (€)" error={errors.price?.[0]}>
            <input
              name="price"
              type="number"
              min={0}
              step={0.01}
              disabled={isFree}
              defaultValue={event?.price ?? 0}
              className="input disabled:opacity-50"
            />
          </Field>
        </div>

        <label className="flex items-center gap-2 text-sm font-semibold text-ink">
          <input
            type="checkbox"
            name="isFree"
            defaultChecked={event?.isFree ?? true}
            onChange={(e) => setIsFree(e.target.checked)}
            className="h-4 w-4 rounded accent-accent"
          />
          Evento gratuito
        </label>
      </Section>

      <Section title="Organizador e contactos">
        <Field label="Organizador" error={errors.organizer?.[0]}>
          <input
            name="organizer"
            required
            defaultValue={event?.organizer}
            className="input"
            placeholder="Nome do organizador"
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Website (opcional)" error={errors.website?.[0]}>
            <input
              name="website"
              type="url"
              defaultValue={event?.website ?? undefined}
              className="input"
              placeholder="https://..."
            />
          </Field>
          <Field label="Instagram (opcional)" error={errors.instagram?.[0]}>
            <input
              name="instagram"
              type="url"
              defaultValue={event?.instagram ?? undefined}
              className="input"
              placeholder="https://instagram.com/..."
            />
          </Field>
        </div>
      </Section>

      <Section title="Visibilidade">
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-8">
          <label className="flex items-center gap-2 text-sm font-semibold text-ink">
            <input
              type="checkbox"
              name="isFeatured"
              defaultChecked={event?.isFeatured}
              className="h-4 w-4 rounded accent-accent"
            />
            Destacar este evento
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-ink">
            <input
              type="checkbox"
              name="published"
              defaultChecked={event?.status === "PUBLISHED"}
              className="h-4 w-4 rounded accent-accent"
            />
            Publicar (visível no site)
          </label>
        </div>
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
