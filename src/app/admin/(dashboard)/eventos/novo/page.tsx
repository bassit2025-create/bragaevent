import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAllCategories } from "@/lib/data/categories";
import { createEvent } from "@/lib/actions/events";
import { EventForm } from "@/components/admin/EventForm";

export const metadata: Metadata = { title: "Novo evento" };

export default async function NewEventPage() {
  const categories = await getAllCategories();

  return (
    <div>
      <Link
        href="/admin/eventos"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink"
      >
        <ArrowLeft size={16} /> Eventos
      </Link>
      <h1 className="font-display text-2xl font-bold text-ink md:text-3xl">
        Novo evento
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        Preenche os detalhes para adicionar um novo evento à agenda.
      </p>

      <div className="mt-6 max-w-3xl">
        <EventForm
          categories={categories}
          action={createEvent}
          submitLabel="Criar evento"
        />
      </div>
    </div>
  );
}
