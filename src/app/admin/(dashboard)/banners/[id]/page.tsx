import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { updateBanner } from "@/lib/actions/banners";
import { BannerForm } from "@/components/admin/BannerForm";

export const metadata: Metadata = { title: "Editar banner" };

export default async function EditBannerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const banner = await prisma.banner.findUnique({ where: { id } });

  if (!banner) notFound();

  const boundAction = updateBanner.bind(null, id);

  return (
    <div>
      <Link
        href="/admin/banners"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink"
      >
        <ArrowLeft size={16} /> Banners
      </Link>
      <h1 className="font-display text-2xl font-bold text-ink md:text-3xl">
        {banner.name}
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        {banner.impressions} visualizações · {banner.clicks} cliques
      </p>

      <div className="mt-6 max-w-2xl">
        <BannerForm
          banner={banner}
          action={boundAction}
          submitLabel="Guardar alterações"
        />
      </div>
    </div>
  );
}
