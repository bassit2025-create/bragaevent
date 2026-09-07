import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { FeaturedBanners } from "@/components/home/FeaturedBanners";
import { UpcomingEvents } from "@/components/home/UpcomingEvents";
import { CategoryGrid } from "@/components/home/CategoryGrid";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <FeaturedBanners />
      <UpcomingEvents />
      <CategoryGrid />
    </>
  );
}
