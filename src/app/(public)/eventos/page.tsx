import type { Metadata } from "next";
import { Suspense } from "react";
import { getPublishedEvents } from "@/lib/data/events";
import { getAllCategories } from "@/lib/data/categories";
import { prisma } from "@/lib/prisma";
import { FilterBar } from "@/components/events/FilterBar";
import { EventCard } from "@/components/EventCard";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = {
  title: "Eventos em Braga",
  description:
    "Encontra concertos, festas, cultura, mercados e workshops em Braga. Filtra por data, categoria e preço.",
  alternates: { canonical: "/eventos" },
};

type SearchParams = Promise<{
  q?: string;
  categoria?: string;
  quando?: string;
  gratis?: string;
  local?: string;
}>;

async function EventsResults({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  const [events, categories, locationRows] = await Promise.all([
    getPublishedEvents({
      q: params.q,
      category: params.categoria,
      when: params.quando,
      free: params.gratis === "1",
      location: params.local,
    }),
    getAllCategories(),
    prisma.event.findMany({
      where: { status: "PUBLISHED" },
      select: { location: true },
      distinct: ["location"],
    }),
  ]);

  const locations = locationRows.map((r) => r.location).sort();

  return (
    <>
      <FilterBar categories={categories} locations={locations} />

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <p className="mb-6 text-sm font-semibold text-ink-soft">
          {events.length} {events.length === 1 ? "evento encontrado" : "eventos encontrados"}
        </p>

        {events.length === 0 ? (
          <EmptyState
            title="Não encontrámos eventos com estes filtros"
            description="Tenta remover alguns filtros ou procura por outra palavra-chave."
            icon="🔍"
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {events.map((event, i) => (
              <EventCard key={event.id} event={event} priority={i < 4} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default function EventsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 pt-10 md:px-8">
        <h1 className="font-display text-3xl font-bold text-ink md:text-4xl">
          Eventos em Braga
        </h1>
        <p className="mt-2 text-ink-soft">
          Tudo o que está a acontecer na cidade, num só lugar.
        </p>
      </div>

      <Suspense>
        <EventsResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
