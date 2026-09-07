import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPublishedEvents } from "@/lib/data/events";
import { getAllCategories } from "@/lib/data/categories";
import { prisma } from "@/lib/prisma";
import { FilterBar } from "@/components/events/FilterBar";
import { EventCard } from "@/components/EventCard";
import { EmptyState } from "@/components/ui/EmptyState";

type Params = Promise<{ locale: string }>;
type SearchParams = Promise<{
  q?: string;
  categoria?: string;
  quando?: string;
  gratis?: string;
  local?: string;
}>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "eventsPage" });
  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: { canonical: `/${locale}/eventos` },
  };
}

async function EventsResults({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const t = await getTranslations("eventsPage");

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
          {t(events.length === 1 ? "resultsCount_one" : "resultsCount_other", {
            count: events.length,
          })}
        </p>

        {events.length === 0 ? (
          <EmptyState
            title={t("emptyTitle")}
            description={t("emptyDescription")}
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

export default async function EventsPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("eventsPage");

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 pt-10 md:px-8">
        <h1 className="font-display text-3xl font-bold text-ink md:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-ink-soft">{t("subtitle")}</p>
      </div>

      <Suspense>
        <EventsResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
