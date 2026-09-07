import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Plus, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatEventDateShort, formatPrice } from "@/lib/utils";
import { EventRowActions } from "@/components/admin/EventRowActions";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Eventos" };

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    include: { category: true },
    orderBy: { date: "asc" },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink md:text-3xl">
            Eventos
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            {events.length} {events.length === 1 ? "evento" : "eventos"} no total
          </p>
        </div>
        <Button href="/admin/eventos/novo" icon={<Plus size={18} />}>
          Novo evento
        </Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink/5">
        {events.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="Ainda não há eventos"
              description="Cria o primeiro evento para começar a preencher a agenda de Braga."
              action={<Button href="/admin/eventos/novo">Criar evento</Button>}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-ink/8 bg-cream-soft/60 text-xs font-bold uppercase tracking-wide text-ink-soft">
                <tr>
                  <th className="px-4 py-3">Evento</th>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Categoria</th>
                  <th className="px-4 py-3">Preço</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Vistas</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {events.map((event) => (
                  <tr key={event.id} className="transition-colors hover:bg-cream-soft/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-14 shrink-0 overflow-hidden rounded-lg bg-cream-soft">
                          <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/eventos/${event.id}`}
                            className="flex items-center gap-1.5 truncate font-semibold text-ink hover:underline"
                          >
                            {event.isFeatured && (
                              <Star size={12} className="shrink-0 fill-amber-500 text-amber-500" />
                            )}
                            {event.title}
                          </Link>
                          <p className="truncate text-xs text-ink-soft">
                            {event.location}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-ink-soft">
                      {formatEventDateShort(event.date)} · {event.startTime}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-ink-soft">
                        {event.category.icon} {event.category.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-ink-soft">
                      {formatPrice(event.price, event.isFree)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                          event.status === "PUBLISHED"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {event.status === "PUBLISHED" ? "Publicado" : "Rascunho"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink-soft">{event.views}</td>
                    <td className="px-4 py-3">
                      <EventRowActions
                        eventId={event.id}
                        isPublished={event.status === "PUBLISHED"}
                        isFeatured={event.isFeatured}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
