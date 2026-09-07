import { prisma } from "@/lib/prisma";
import type { DevicePlatform } from "@prisma/client";

export async function registerPushToken(
  token: string,
  platform: DevicePlatform,
  locale: string
) {
  return prisma.pushToken.upsert({
    where: { token },
    update: { platform, locale },
    create: { token, platform, locale },
  });
}

export async function unregisterPushToken(token: string) {
  await prisma.pushToken.deleteMany({ where: { token } });
}

export async function getPushTokensForLocale(locale?: string) {
  return prisma.pushToken.findMany({
    where: locale ? { locale } : undefined,
  });
}
