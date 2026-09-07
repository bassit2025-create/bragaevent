import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getUpcomingEvents } from "@/lib/data/events";
import { EventCard } from "@/components/EventCard";
import { EmptyState } from "@/components/ui/EmptyState";

export async function UpcomingEvents() {
  const events = await getUpcomingEvents(8);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink md:text-3xl">
            Acontece em Braga
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            Os próximos eventos que não podes perder.
          </p>
        </div>
        <Link
          href="/eventos"
          className="hidden items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ink/5 md:inline-flex"
        >
          Ver todos <ArrowRight size={16} />
        </Link>
      </div>

      {events.length === 0 ? (
        <EmptyState
          title="Ainda não há eventos publicados"
          description="Volta em breve — estamos sempre a adicionar novidades sobre Braga."
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {events.map((event, i) => (
            <EventCard key={event.id} event={event} priority={i < 4} />
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-center md:hidden">
        <Link
          href="/eventos"
          className="inline-flex items-center gap-1 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream"
        >
          Ver todos os eventos <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
