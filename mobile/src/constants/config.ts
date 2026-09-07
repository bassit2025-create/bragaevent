// Base URL of the Braga Event backend (the existing Next.js app).
// Override with EXPO_PUBLIC_API_URL in a .env file for local development
// against a dev server (e.g. http://192.168.1.x:3000) — the production
// build always falls back to the live site.
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'https://bragaevent.com';

export const API_V1 = `${API_BASE_URL}/api/v1`;
