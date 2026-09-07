import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  Calendar,
  Clock,
  MapPin,
  Tag,
  User,
  Globe,
  ArrowLeft,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getEventBySlug, getRelatedEvents, incrementEventViews } from "@/lib/data/events";
import { formatEventDateLong, formatPrice } from "@/lib/utils";
import { getCategoryStyle } from "@/lib/categoryStyles";
import { Badge } from "@/components/ui/Badge";
import { EventCard } from "@/components/EventCard";
import { ShareButton } from "@/components/events/ShareButton";
import { AddToCalendarButton } from "@/components/events/AddToCalendarButton";
import { InstagramIcon } from "@/components/ui/InstagramIcon";

type Params = Promise<{ locale: string; slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return {};

  return {
    title: event.title,
    description: event.description,
    alternates: { canonical: `/${locale}/eventos/${event.slug}` },
    openGraph: {
      title: event.title,
      description: event.description,
      images: [{ url: event.image }],
      type: "article",
    },
  };
}

export default async function EventDetailPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("eventDetail");

  const event = await getEventBySlug(slug);

  if (!event || event.status !== "PUBLISHED") {
    notFound();
  }

  // Best-effort view counter; don't block rendering on it.
  void incrementEventViews(event.id);

  const related = await getRelatedEvents(event.categoryId, event.id);
  const style = getCategoryStyle(event.category.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.date.toISOString(),
    location: {
      "@type": "Place",
      name: event.location,
      address: event.address,
    },
    image: [event.image],
    description: event.description,
    organizer: {
      "@type": "Organization",
      name: event.organizer,
      url: event.website ?? undefined,
    },
    offers: {
      "@type": "Offer",
      price: event.price,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative h-[42vh] min-h-[320px] w-full md:h-[52vh]">
        <Image
          src={event.image}
          alt={event.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />

        <Link
          href="/eventos"
          className="absolute start-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-ink shadow-sm backdrop-blur md:start-8 md:top-6"
        >
          <ArrowLeft size={16} className="rtl:rotate-180" /> {t("backToEvents")}
        </Link>

        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-6 md:px-8 md:pb-10">
          <div className="flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${style.bg} ${style.text}`}
            >
              {event.category.icon} {event.category.name}
            </span>
            <Badge tone={event.isFree ? "success" : "ink"}>
              {formatPrice(event.price, event.isFree, locale)}
            </Badge>
          </div>
          <h1 className="mt-3 max-w-3xl text-balance font-display text-3xl font-bold text-white md:text-5xl">
            {event.title}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="flex flex-wrap gap-3">
              <AddToCalendarButton
                title={event.title}
                description={event.description}
                location={`${event.location}, ${event.address}`}
                date={event.date.toISOString()}
                startTime={event.startTime}
                endTime={event.endTime}
              />
              <ShareButton title={event.title} text={event.description} />
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <InfoTile
                icon={<Calendar size={18} />}
                label={t("date")}
                value={formatEventDateLong(event.date, locale)}
              />
              <InfoTile
                icon={<Clock size={18} />}
                label={t("time")}
                value={
                  event.endTime
                    ? `${event.startTime} – ${event.endTime}`
                    : event.startTime
                }
              />
              <InfoTile
                icon={<MapPin size={18} />}
                label={t("location")}
                value={event.location}
              />
              <InfoTile
                icon={<Tag size={18} />}
                label={t("price")}
                value={formatPrice(event.price, event.isFree, locale)}
              />
            </div>

            <div className="mt-10">
              <h2 className="font-display text-xl font-bold text-ink">
                {t("about")}
              </h2>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-ink-soft">
                {event.description}
              </p>
            </div>

            <div className="mt-10">
              <h2 className="font-display text-xl font-bold text-ink">
                {t("locationHeading")}
              </h2>
              <p className="mt-2 flex items-center gap-1.5 text-ink-soft">
                <MapPin size={16} /> {event.address}
              </p>
              <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-ink/10">
                <iframe
                  title={t("mapTitle", { location: event.location })}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    event.address
                  )}&output=embed`}
                  width="100%"
                  height="320"
                  loading="lazy"
                  style={{ border: 0 }}
                />
              </div>
            </div>
          </div>

          <aside className="lg:pt-2">
            <div className="rounded-3xl bg-cream-soft p-6">
              <h3 className="font-display text-sm font-bold uppercase tracking-wide text-ink-soft">
                {t("organizer")}
              </h3>
              <p className="mt-2 flex items-center gap-2 font-display text-lg font-bold text-ink">
                <User size={18} /> {event.organizer}
              </p>

              {(event.website || event.instagram) && (
                <div className="mt-4 flex flex-col gap-2">
                  {event.website && (
                    <a
                      href={event.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-azul hover:underline"
                    >
                      <Globe size={16} /> {t("website")}
                    </a>
                  )}
                  {event.instagram && (
                    <a
                      href={event.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-azul hover:underline"
                    >
                      <InstagramIcon size={16} /> {t("instagram")}
                    </a>
                  )}
                </div>
              )}
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold text-ink">
              {t("relatedEvents")}
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-cream-soft p-4">
      <div className="flex items-center gap-1.5 text-ink-soft">
        {icon}
        <span className="text-xs font-bold uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="mt-1.5 font-display text-sm font-bold text-ink">
        {value}
      </p>
    </div>
  );
}
