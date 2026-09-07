import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getAllCategories } from "@/lib/data/categories";
import { updateEvent } from "@/lib/actions/events";
import { EventForm } from "@/components/admin/EventForm";

export const metadata: Metadata = { title: "Editar evento" };

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [event, categories] = await Promise.all([
    prisma.event.findUnique({ where: { id } }),
    getAllCategories(),
  ]);

  if (!event) notFound();

  const boundAction = updateEvent.bind(null, id);

  return (
    <div>
      <div className="flex items-center justify-between">
        <Link
          href="/admin/eventos"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink"
        >
          <ArrowLeft size={16} /> Eventos
        </Link>
        {event.status === "PUBLISHED" && (
          <Link
            href={`/eventos/${event.slug}`}
            target="_blank"
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-azul hover:underline"
          >
            Ver no site <ExternalLink size={14} />
          </Link>
        )}
      </div>

      <h1 className="font-display text-2xl font-bold text-ink md:text-3xl">
        {event.title}
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        {event.views} visualizações totais
      </p>

      <div className="mt-6 max-w-3xl">
        <EventForm
          categories={categories}
          event={event}
          action={boundAction}
          submitLabel="Guardar alterações"
        />
      </div>
    </div>
  );
}
