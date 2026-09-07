import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarCheck,
  CalendarClock,
  ImageIcon,
  ImageOff,
  Eye,
  ArrowUpRight,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/admin/StatCard";
import { formatEventDateShort } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

async function getStats() {
  const [
    publishedEvents,
    draftEvents,
    activeBanners,
    expiredBanners,
    viewsAgg,
    recentEvents,
    topCategories,
  ] = await Promise.all([
    prisma.event.count({ where: { status: "PUBLISHED" } }),
    prisma.event.count({ where: { status: "DRAFT" } }),
    prisma.banner.count({ where: { status: "ACTIVE" } }),
    prisma.banner.count({ where: { status: "EXPIRED" } }),
    prisma.event.aggregate({ _sum: { views: true } }),
    prisma.event.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { category: true },
    }),
    prisma.category.findMany({
      include: { _count: { select: { events: true } } },
      orderBy: { events: { _count: "desc" } },
      take: 6,
    }),
  ]);

  return {
    publishedEvents,
    draftEvents,
    activeBanners,
    expiredBanners,
    totalViews: viewsAgg._sum.views ?? 0,
    recentEvents,
    topCategories,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();
  const maxCategoryCount = Math.max(
    1,
    ...stats.topCategories.map((c) => c._count.events)
  );

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink md:text-3xl">
        Dashboard
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        Uma visão geral do que está a acontecer na plataforma.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          label="Eventos publicados"
          value={stats.publishedEvents}
          icon={<CalendarCheck size={20} />}
          tone="accent"
        />
        <StatCard
          label="Eventos pendentes"
          value={stats.draftEvents}
          icon={<CalendarClock size={20} />}
        />
        <StatCard
          label="Banners ativos"
          value={stats.activeBanners}
          icon={<ImageIcon size={20} />}
          tone="success"
        />
        <StatCard
          label="Banners expirados"
          value={stats.expiredBanners}
          icon={<ImageOff size={20} />}
        />
        <StatCard
          label="Total de visualizações"
          value={stats.totalViews.toLocaleString("pt-PT")}
          icon={<Eye size={20} />}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink/5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-ink">
              Eventos recentes
            </h2>
            <Link
              href="/admin/eventos"
              className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
            >
              Ver todos <ArrowUpRight size={14} />
            </Link>
          </div>

          {stats.recentEvents.length === 0 ? (
            <p className="py-8 text-center text-sm text-ink-soft">
              Ainda não criaste nenhum evento.
            </p>
          ) : (
            <div className="divide-y divide-ink/5">
              {stats.recentEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/admin/eventos/${event.id}`}
                  className="flex items-center justify-between gap-3 py-3 transition-colors hover:bg-ink/5 -mx-2 px-2 rounded-lg"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">
                      {event.title}
                    </p>
                    <p className="text-xs text-ink-soft">
                      {event.category.icon} {event.category.name} ·{" "}
                      {formatEventDateShort(event.date)}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                      event.status === "PUBLISHED"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {event.status === "PUBLISHED" ? "Publicado" : "Rascunho"}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink/5">
          <h2 className="mb-4 font-display text-base font-bold text-ink">
            Eventos por categoria
          </h2>
          <div className="flex flex-col gap-3">
            {stats.topCategories.map((cat) => (
              <div key={cat.id}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-semibold text-ink">
                    {cat.icon} {cat.name}
                  </span>
                  <span className="text-ink-soft">{cat._count.events}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-ink/5">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{
                      width: `${(cat._count.events / maxCategoryCount) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
