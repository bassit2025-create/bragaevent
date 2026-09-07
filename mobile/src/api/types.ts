// Mirrors src/lib/api/serialize.ts in the Next.js backend. Keep these
// two files in sync whenever the API response shape changes.

export type CategoryDto = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
};

export type EventDto = {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  date: string; // ISO date string
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
  category: CategoryDto;
};

export type BannerDto = {
  id: string;
  name: string;
  projectName: string;
  image: string;
  destinationUrl: string;
  description: string | null;
};

export type EventFilters = {
  q?: string;
  categoria?: string;
  quando?: 'hoje' | 'amanha' | 'fim-de-semana' | 'esta-semana' | 'este-mes';
  gratis?: boolean;
  local?: string;
};
