import { NextResponse } from "next/server";
import { getAllCategories } from "@/lib/data/categories";
import { serializeCategory } from "@/lib/api/serialize";
import { CORS_HEADERS, corsPreflight } from "@/lib/api/cors";

export function OPTIONS() {
  return corsPreflight();
}

export async function GET() {
  const categories = await getAllCategories();

  return NextResponse.json(
    { categories: categories.map(serializeCategory) },
    {
      headers: {
        // Categories change rarely, so cache longer than events.
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        ...CORS_HEADERS,
      },
    }
  );
}
