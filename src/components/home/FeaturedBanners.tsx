import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getActiveBanners } from "@/lib/data/banners";
import { BannerLink } from "@/components/home/BannerLink";
import { prisma } from "@/lib/prisma";

export async function FeaturedBanners() {
  const banners = await getActiveBanners();

  if (banners.length === 0) return null;

  const t = await getTranslations("banners");

  // Best-effort impression tracking: one impression per banner per render
  // of the homepage. Fire-and-forget so it never blocks the response.
  void prisma.banner.updateMany({
    where: { id: { in: banners.map((b) => b.id) } },
    data: { impressions: { increment: 1 } },
  });

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="font-display text-xl font-bold text-ink md:text-2xl">
          {t("heading")}
        </h2>
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft/60">
          {t("subheading")}
        </span>
      </div>

      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible">
        {banners.map((banner) => (
          <BannerLink key={banner.id} banner={banner}>
            <div className="relative aspect-[16/10] w-[260px] shrink-0 overflow-hidden rounded-2xl ring-1 ring-ink/5 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg md:w-full">
              <Image
                src={banner.image}
                alt={banner.name}
                fill
                sizes="(max-width: 768px) 260px, 25vw"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                <p className="text-xs font-semibold text-white/70">
                  {banner.projectName}
                </p>
                <p className="text-sm font-bold text-white line-clamp-1">
                  {banner.name}
                </p>
              </div>
            </div>
          </BannerLink>
        ))}
      </div>
    </section>
  );
}
