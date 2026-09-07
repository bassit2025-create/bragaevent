import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock } from "lucide-react";
import { formatEventDateShort, formatPrice } from "@/lib/utils";
import { getCategoryStyle } from "@/lib/categoryStyles";
import { Badge } from "@/components/ui/Badge";
import type { Category, Event } from "@prisma/client";

type EventWithCategory = Event & { category: Category };

export function EventCard({
  event,
  priority = false,
}: {
  event: EventWithCategory;
  priority?: boolean;
}) {
  const catStyle = getCategoryStyle(event.category.slug);

  return (
    <Link
      href={`/eventos/${event.slug}`}
      className="group block h-full overflow-hidden rounded-2xl bg-white ring-1 ring-ink/5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/10"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream-soft">
        <Image
          src={event.image}
          alt={event.title}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${catStyle.bg} ${catStyle.text}`}
          >
            {event.category.icon} {event.category.name}
          </span>
        </div>
        <div className="absolute right-3 top-3">
          <Badge tone={event.isFree ? "success" : "ink"}>
            {formatPrice(event.price, event.isFree)}
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3 rounded-xl bg-white/95 px-3 py-1.5 text-center leading-none shadow-sm backdrop-blur">
          <div className="font-display text-sm font-bold text-ink">
            {formatEventDateShort(event.date)}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-4">
        <h3 className="font-display text-lg font-bold leading-snug text-ink line-clamp-2">
          {event.title}
        </h3>
        <div className="flex flex-wrap items-center gap-3 text-sm text-ink-soft">
          <span className="inline-flex items-center gap-1">
            <Clock size={14} strokeWidth={2.5} />
            {event.startTime}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={14} strokeWidth={2.5} />
            {event.location}
          </span>
        </div>
        <p className="text-sm text-ink-soft line-clamp-2">
          {event.description}
        </p>
      </div>
    </Link>
  );
}
