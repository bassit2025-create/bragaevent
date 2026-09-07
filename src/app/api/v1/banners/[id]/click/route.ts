import { NextResponse } from "next/server";
import { registerBannerClick } from "@/lib/data/banners";
import { CORS_HEADERS, corsPreflight } from "@/lib/api/cors";

export function OPTIONS() {
  return corsPreflight();
}

export async function POST(
  _request: Request,
  ctx: RouteContext<"/api/v1/banners/[id]/click">
) {
  const { id } = await ctx.params;
  try {
    await registerBannerClick(id);
  } catch {
    // Swallow errors — click tracking must never break the user's navigation.
  }
  return NextResponse.json({ ok: true }, { headers: CORS_HEADERS });
}
