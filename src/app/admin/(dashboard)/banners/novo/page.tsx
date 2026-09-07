import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createBanner } from "@/lib/actions/banners";
import { BannerForm } from "@/components/admin/BannerForm";

export const metadata: Metadata = { title: "Novo banner" };

export default function NewBannerPage() {
  return (
    <div>
      <Link
        href="/admin/banners"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink"
      >
        <ArrowLeft size={16} /> Banners
      </Link>
      <h1 className="font-display text-2xl font-bold text-ink md:text-3xl">
        Novo banner
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        Cria uma nova campanha publicitária para um projeto local.
      </p>

      <div className="mt-6 max-w-2xl">
        <BannerForm action={createBanner} submitLabel="Criar banner" />
      </div>
    </div>
  );
}
