// These endpoints are public, read-only data (published events,
// categories, active banners) — the same information anyone can already
// see on the public website. Allowing all origins is safe here and is
// what lets the Expo mobile app (native fetch, plus the web preview
// during development) call this API directly.
export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function corsPreflight() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
