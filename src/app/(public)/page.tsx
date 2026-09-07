import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { FeaturedBanners } from "@/components/home/FeaturedBanners";
import { UpcomingEvents } from "@/components/home/UpcomingEvents";
import { CategoryGrid } from "@/components/home/CategoryGrid";

export const metadata: Metadata = {
  title: "Braga Event — O que acontece em Braga?",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedBanners />
      <UpcomingEvents />
      <CategoryGrid />
    </>
  );
}
