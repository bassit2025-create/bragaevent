import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalPage } from "@/components/legal/LegalPage";
import { formatLongDate } from "@/lib/utils";

type Params = Promise<{ locale: string }>;

// Bump this date whenever the privacy policy content actually changes.
const LAST_UPDATED = new Date("2026-09-07");

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: { canonical: `/${locale}/privacidade` },
    robots: { index: true, follow: true },
  };
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Params;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("privacy");
  const tLegal = await getTranslations("legal");

  const sections = t.raw("sections") as { heading: string; body: string }[];

  return (
    <LegalPage
      title={t("title")}
      intro={t("intro")}
      sections={sections}
      lastUpdatedLabel={tLegal("lastUpdated")}
      lastUpdatedDate={formatLongDate(LAST_UPDATED, locale)}
    />
  );
}
