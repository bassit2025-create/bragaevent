import { NextResponse } from "next/server";
import {
  getEventBySlug,
  getRelatedEvents,
  incrementEventViews,
} from "@/lib/data/events";
import { serializeEvent } from "@/lib/api/serialize";
import { CORS_HEADERS, corsPreflight } from "@/lib/api/cors";

export function OPTIONS() {
  return corsPreflight();
}

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/v1/events/[slug]">
) {
  const { slug } = await ctx.params;
  const event = await getEventBySlug(slug);

  if (!event || event.status !== "PUBLISHED") {
    return NextResponse.json(
      { error: "Event not found" },
      { status: 404, headers: CORS_HEADERS }
    );
  }

  // Best-effort view counter; don't block the response on it.
  void incrementEventViews(event.id);

  const related = await getRelatedEvents(event.categoryId, event.id);

  return NextResponse.json(
    {
      event: serializeEvent(event),
      related: related.map(serializeEvent),
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        ...CORS_HEADERS,
      },
    }
  );
}
