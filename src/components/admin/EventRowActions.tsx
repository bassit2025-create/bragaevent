"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Eye, EyeOff, Star } from "lucide-react";
import {
  deleteEvent,
  toggleEventPublished,
  toggleEventFeatured,
} from "@/lib/actions/events";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";

export function EventRowActions({
  eventId,
  isPublished,
  isFeatured,
}: {
  eventId: string;
  isPublished: boolean;
  isFeatured: boolean;
}) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-1">
      <Link
        href={`/admin/eventos/${eventId}`}
        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-ink-soft hover:bg-ink/5"
      >
        <Pencil size={14} /> Editar
      </Link>

      <button
        onClick={async () => {
          await toggleEventFeatured(eventId);
          router.refresh();
        }}
        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold hover:bg-ink/5 ${
          isFeatured ? "text-amber-600" : "text-ink-soft"
        }`}
        title={isFeatured ? "Remover destaque" : "Destacar evento"}
      >
        <Star size={14} fill={isFeatured ? "currentColor" : "none"} />
      </button>

      <button
        onClick={async () => {
          await toggleEventPublished(eventId);
          router.refresh();
        }}
        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-ink-soft hover:bg-ink/5"
        title={isPublished ? "Despublicar" : "Publicar"}
      >
        {isPublished ? <EyeOff size={14} /> : <Eye size={14} />}
        {isPublished ? "Despublicar" : "Publicar"}
      </button>

      <ConfirmDeleteButton
        confirmMessage="Eliminar?"
        action={async () => {
          await deleteEvent(eventId);
          router.refresh();
        }}
      />
    </div>
  );
}
