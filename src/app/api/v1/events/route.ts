import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getPublishedEvents } from "@/lib/data/events";
import { serializeEvent } from "@/lib/api/serialize";
import { CORS_HEADERS, corsPreflight } from "@/lib/api/cors";

export function OPTIONS() {
  return corsPreflight();
}

// Public, read-only endpoint consumed by the mobile app (and available
// to any other future client). Mirrors the same filtering the web
// /eventos page uses, so both clients stay behaviorally consistent.
//
// Query params (all optional):
//   q          — free-text search (title/description/location)
//   categoria  — category slug
//   quando     — hoje | amanha | fim-de-semana | esta-semana | este-mes
//   gratis     — "1" to only show free events
//   local      — exact location filter
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const events = await getPublishedEvents({
    q: searchParams.get("q") ?? undefined,
    category: searchParams.get("categoria") ?? undefined,
    when: searchParams.get("quando") ?? undefined,
    free: searchParams.get("gratis") === "1",
    location: searchParams.get("local") ?? undefined,
  });

  return NextResponse.json(
    { events: events.map(serializeEvent) },
    {
      headers: {
        // Public event data; short edge cache since admins can
        // publish/unpublish at any time, with stale-while-revalidate so
        // repeat requests stay fast between refreshes.
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        ...CORS_HEADERS,
      },
    }
  );
}
