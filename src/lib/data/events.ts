import { prisma } from "@/lib/prisma";
import { getDateRangeForFilter } from "@/lib/utils";
import type { Prisma } from "@prisma/client";

export type EventFilters = {
  q?: string;
  category?: string; // category slug
  when?: string; // hoje | amanha | fim-de-semana | esta-semana | este-mes
  free?: boolean;
  location?: string;
};

export function buildEventWhere(
  filters: EventFilters,
  { includeUnpublished = false }: { includeUnpublished?: boolean } = {}
): Prisma.EventWhereInput {
  const where: Prisma.EventWhereInput = {};

  if (!includeUnpublished) {
    where.status = "PUBLISHED";
  }

  if (filters.q) {
    // Postgres string filters are case-sensitive by default (unlike
    // SQLite), so "mode: insensitive" is required for search to behave
    // the way users expect.
    where.OR = [
      { title: { contains: filters.q, mode: "insensitive" } },
      { description: { contains: filters.q, mode: "insensitive" } },
      { location: { contains: filters.q, mode: "insensitive" } },
    ];
  }

  if (filters.category) {
    where.category = { slug: filters.category };
  }

  if (filters.location) {
    where.location = { contains: filters.location, mode: "insensitive" };
  }

  if (filters.free) {
    where.isFree = true;
  }

  if (filters.when) {
    const range = getDateRangeForFilter(filters.when);
    if (range) {
      where.date = { gte: range.from, lt: range.to };
    }
  } else if (!includeUnpublished) {
    // Public listings only show upcoming events by default.
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    where.date = { gte: today };
  }

  return where;
}

export async function getPublishedEvents(filters: EventFilters = {}) {
  const where = buildEventWhere(filters);
  return prisma.event.findMany({
    where,
    include: { category: true },
    orderBy: { date: "asc" },
  });
}

export async function getFeaturedEvents(limit = 6) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return prisma.event.findMany({
    where: { status: "PUBLISHED", isFeatured: true, date: { gte: today } },
    include: { category: true },
    orderBy: { date: "asc" },
    take: limit,
  });
}

export async function getUpcomingEvents(limit = 8) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return prisma.event.findMany({
    where: { status: "PUBLISHED", date: { gte: today } },
    include: { category: true },
    orderBy: { date: "asc" },
    take: limit,
  });
}

export async function getEventBySlug(slug: string) {
  return prisma.event.findUnique({
    where: { slug },
    include: { category: true },
  });
}

export async function incrementEventViews(id: string) {
  return prisma.event.update({
    where: { id },
    data: { views: { increment: 1 } },
  });
}

export async function getRelatedEvents(categoryId: string, excludeId: string, limit = 3) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return prisma.event.findMany({
    where: {
      status: "PUBLISHED",
      categoryId,
      date: { gte: today },
      id: { not: excludeId },
    },
    include: { category: true },
    orderBy: { date: "asc" },
    take: limit,
  });
}
