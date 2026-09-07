import { prisma } from "@/lib/prisma";

/**
 * Returns banners that should currently be visible on the public site:
 * status ACTIVE (or SCHEDULED/self-healing below) and within their
 * start/end date window. Also opportunistically flips banners whose
 * schedule has changed (start date arrived / end date passed) so the
 * admin doesn't need a cron job for the common case.
 */
export async function getActiveBanners() {
  const now = new Date();

  // Self-heal statuses based on the schedule. This keeps banners correct
  // even without a background job: any request to the public site will
  // "settle" banners into their proper state.
  await prisma.banner.updateMany({
    where: { status: "SCHEDULED", startDate: { lte: now } },
    data: { status: "ACTIVE" },
  });
  await prisma.banner.updateMany({
    where: { status: "ACTIVE", endDate: { lt: now } },
    data: { status: "EXPIRED" },
  });

  return prisma.banner.findMany({
    where: {
      status: "ACTIVE",
      startDate: { lte: now },
      endDate: { gte: now },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function registerBannerImpression(id: string) {
  return prisma.banner.update({
    where: { id },
    data: { impressions: { increment: 1 } },
  });
}

export async function registerBannerClick(id: string) {
  return prisma.banner.update({
    where: { id },
    data: { clicks: { increment: 1 } },
  });
}
