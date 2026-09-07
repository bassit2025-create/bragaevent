import { API_V1 } from '@/constants/config';
import type { BannerDto, CategoryDto, EventDto, EventFilters } from '@/api/types';

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function get<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${API_V1}${path}`, { signal });
  if (!res.ok) {
    throw new ApiError(`Request to ${path} failed with ${res.status}`, res.status);
  }
  return res.json() as Promise<T>;
}

export function fetchUpcomingEvents(signal?: AbortSignal) {
  return get<{ events: EventDto[] }>('/events', signal).then((r) => r.events.slice(0, 8));
}

export function fetchEvents(filters: EventFilters = {}, signal?: AbortSignal) {
  const params = new URLSearchParams();
  if (filters.q) params.set('q', filters.q);
  if (filters.categoria) params.set('categoria', filters.categoria);
  if (filters.quando) params.set('quando', filters.quando);
  if (filters.gratis) params.set('gratis', '1');
  if (filters.local) params.set('local', filters.local);

  const query = params.toString();
  return get<{ events: EventDto[] }>(`/events${query ? `?${query}` : ''}`, signal).then(
    (r) => r.events
  );
}

export function fetchEventBySlug(slug: string, signal?: AbortSignal) {
  return get<{ event: EventDto; related: EventDto[] }>(
    `/events/${encodeURIComponent(slug)}`,
    signal
  );
}

export function fetchCategories(signal?: AbortSignal) {
  return get<{ categories: CategoryDto[] }>('/categories', signal).then((r) => r.categories);
}

export function fetchBanners(signal?: AbortSignal) {
  return get<{ banners: BannerDto[] }>('/banners', signal).then((r) => r.banners);
}

export async function registerBannerClick(id: string) {
  try {
    await fetch(`${API_V1}/banners/${id}/click`, { method: 'POST' });
  } catch {
    // Click tracking must never interrupt navigation.
  }
}

export async function registerPushToken(
  token: string,
  platform: 'IOS' | 'ANDROID',
  locale: string
) {
  await fetch(`${API_V1}/push-tokens`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, platform, locale }),
  });
}

export { ApiError };
