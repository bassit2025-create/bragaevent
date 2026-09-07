import { NextResponse } from "next/server";
import { z } from "zod";
import { registerPushToken, unregisterPushToken } from "@/lib/data/pushTokens";
import { CORS_HEADERS, corsPreflight } from "@/lib/api/cors";

export function OPTIONS() {
  return corsPreflight();
}

const RegisterSchema = z.object({
  token: z.string().min(1),
  platform: z.enum(["IOS", "ANDROID"]),
  locale: z.enum(["pt", "en", "ar"]).default("pt"),
});

const UnregisterSchema = z.object({
  token: z.string().min(1),
});

/**
 * Registers (or updates) a device's Expo push token so the admin can
 * later broadcast notifications about new/featured events. No
 * authentication required — this is the mobile equivalent of a
 * newsletter opt-in, not a user account.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = RegisterSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  await registerPushToken(
    parsed.data.token,
    parsed.data.platform,
    parsed.data.locale
  );

  return NextResponse.json({ ok: true }, { headers: CORS_HEADERS });
}

/** Called when the user disables notifications in the app's settings. */
export async function DELETE(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = UnregisterSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  await unregisterPushToken(parsed.data.token);
  return NextResponse.json({ ok: true }, { headers: CORS_HEADERS });
}
