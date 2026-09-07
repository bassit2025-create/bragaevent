import { NextResponse } from "next/server";
import { getActiveBanners } from "@/lib/data/banners";
import { serializeBanner } from "@/lib/api/serialize";
import { prisma } from "@/lib/prisma";
import { CORS_HEADERS, corsPreflight } from "@/lib/api/cors";

export function OPTIONS() {
  return corsPreflight();
}

export async function GET() {
  const banners = await getActiveBanners();

  // Best-effort impression tracking, mirroring the web homepage's
  // behavior. Fire-and-forget so it never blocks the response.
  if (banners.length > 0) {
    void prisma.banner.updateMany({
      where: { id: { in: banners.map((b) => b.id) } },
      data: { impressions: { increment: 1 } },
    });
  }

  return NextResponse.json(
    { banners: banners.map(serializeBanner) },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        ...CORS_HEADERS,
      },
    }
  );
}
