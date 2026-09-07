import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { locales, defaultLocale } from "@/i18n/routing";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

function withAlternates(path: string) {
  return {
    languages: Object.fromEntries(
      locales.map((locale) => [locale, `${siteUrl}/${locale}${path}`])
    ),
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [events, categories] = await Promise.all([
    prisma.event.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    }),
    prisma.category.findMany({ select: { slug: true } }),
  ]);

  const staticPaths = [
    { path: "", changeFrequency: "daily" as const, priority: 1 },
    { path: "/eventos", changeFrequency: "hourly" as const, priority: 0.9 },
    { path: "/categorias", changeFrequency: "weekly" as const, priority: 0.6 },
    { path: "/privacidade", changeFrequency: "yearly" as const, priority: 0.3 },
    { path: "/termos", changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const { path, changeFrequency, priority } of staticPaths) {
      entries.push({
        url: `${siteUrl}/${locale}${path}`,
        changeFrequency,
        // The default locale's homepage is the canonical highest-priority
        // entry; other locales/paths scale down from there.
        priority: locale === defaultLocale ? priority : priority * 0.9,
        alternates: withAlternates(path),
      });
    }

    for (const c of categories) {
      entries.push({
        url: `${siteUrl}/${locale}/eventos?categoria=${c.slug}`,
        changeFrequency: "daily",
        priority: 0.5,
      });
    }

    for (const e of events) {
      entries.push({
        url: `${siteUrl}/${locale}/eventos/${e.slug}`,
        lastModified: e.updatedAt,
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: withAlternates(`/eventos/${e.slug}`),
      });
    }
  }

  return entries;
}
