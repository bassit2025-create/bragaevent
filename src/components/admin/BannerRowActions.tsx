"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Eye, EyeOff } from "lucide-react";
import { deleteBanner, toggleBannerPublished } from "@/lib/actions/banners";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";

export function BannerRowActions({
  bannerId,
  isDisabled,
}: {
  bannerId: string;
  isDisabled: boolean;
}) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-1">
      <Link
        href={`/admin/banners/${bannerId}`}
        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-ink-soft hover:bg-ink/5"
      >
        <Pencil size={14} /> Editar
      </Link>

      <button
        onClick={async () => {
          await toggleBannerPublished(bannerId);
          router.refresh();
        }}
        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-ink-soft hover:bg-ink/5"
      >
        {isDisabled ? <Eye size={14} /> : <EyeOff size={14} />}
        {isDisabled ? "Publicar" : "Despublicar"}
      </button>

      <ConfirmDeleteButton
        confirmMessage="Tem a certeza que quer eliminar este banner?"
        action={async () => {
          await deleteBanner(bannerId);
          router.refresh();
        }}
      />
    </div>
  );
}
