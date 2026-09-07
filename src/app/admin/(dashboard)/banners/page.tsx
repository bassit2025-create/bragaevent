import type { Metadata } from "next";
import Image from "next/image";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getActiveBanners } from "@/lib/data/banners";
import { formatEventDateLong } from "@/lib/utils";
import { BannerStatusBadge } from "@/components/admin/BannerStatusBadge";
import { BannerRowActions } from "@/components/admin/BannerRowActions";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Banners" };

export default async function AdminBannersPage() {
  // Settle scheduled/expired statuses before listing.
  await getActiveBanners();

  const banners = await prisma.banner.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink md:text-3xl">
            Banners
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Gere as campanhas publicitárias em destaque no site.
          </p>
        </div>
        <Button href="/admin/banners/novo" icon={<Plus size={18} />}>
          Novo banner
        </Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink/5">
        {banners.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="Ainda não há banners"
              description="Cria uma campanha para um projeto ou negócio local."
              action={<Button href="/admin/banners/novo">Criar banner</Button>}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-ink/8 bg-cream-soft/60 text-xs font-bold uppercase tracking-wide text-ink-soft">
                <tr>
                  <th className="px-4 py-3">Banner</th>
                  <th className="px-4 py-3">Projeto</th>
                  <th className="px-4 py-3">Início</th>
                  <th className="px-4 py-3">Fim</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Vistas</th>
                  <th className="px-4 py-3">Cliques</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {banners.map((banner) => (
                  <tr key={banner.id} className="transition-colors hover:bg-cream-soft/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-16 shrink-0 overflow-hidden rounded-lg bg-cream-soft">
                          <Image
                            src={banner.image}
                            alt={banner.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                        <span className="max-w-[220px] truncate font-semibold text-ink">
                          {banner.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink-soft">{banner.projectName}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-ink-soft">
                      {formatEventDateLong(banner.startDate)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-ink-soft">
                      {formatEventDateLong(banner.endDate)}
                    </td>
                    <td className="px-4 py-3">
                      <BannerStatusBadge status={banner.status} />
                    </td>
                    <td className="px-4 py-3 text-ink-soft">{banner.impressions}</td>
                    <td className="px-4 py-3 text-ink-soft">{banner.clicks}</td>
                    <td className="px-4 py-3">
                      <BannerRowActions
                        bannerId={banner.id}
                        isDisabled={banner.status === "DISABLED"}
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
