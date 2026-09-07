import type { Banner, Category, Event } from "@prisma/client";

// Shared JSON shapes for the public mobile API (src/app/api/v1/**).
// Keeping these in one place means the mobile app and any future
// consumer can rely on a stable, documented contract instead of the
// raw Prisma model shape (which includes internal fields like
// `views`/`impressions` update timestamps that aren't meant to be
// public contracts).

export type EventJson = {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  date: string; // ISO date
  startTime: string;
  endTime: string | null;
  location: string;
  address: string;
  price: number;
  isFree: boolean;
  organizer: string;
  website: string | null;
  instagram: string | null;
  isFeatured: boolean;
  category: CategoryJson;
};

export type CategoryJson = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
};

export type BannerJson = {
  id: string;
  name: string;
  projectName: string;
  image: string;
  destinationUrl: string;
  description: string | null;
};

export function serializeEvent(
  event: Event & { category: Category }
): EventJson {
  return {
    id: event.id,
    title: event.title,
    slug: event.slug,
    description: event.description,
    image: event.image,
    date: event.date.toISOString(),
    startTime: event.startTime,
    endTime: event.endTime,
    location: event.location,
    address: event.address,
    price: event.price,
    isFree: event.isFree,
    organizer: event.organizer,
    website: event.website,
    instagram: event.instagram,
    isFeatured: event.isFeatured,
    category: serializeCategory(event.category),
  };
}

export function serializeCategory(category: Category): CategoryJson {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    icon: category.icon,
    color: category.color,
  };
}

export function serializeBanner(banner: Banner): BannerJson {
  return {
    id: banner.id,
    name: banner.name,
    projectName: banner.projectName,
    image: banner.image,
    destinationUrl: banner.destinationUrl,
    description: banner.description,
  };
}
