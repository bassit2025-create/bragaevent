import type { Metadata } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans, Noto_Sans_Arabic } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, isRtlLocale, type Locale } from "@/i18n/routing";
import "../globals.css";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// Arabic needs its own font since Latin fonts don't cover Arabic glyphs.
const arabic = Noto_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const ogLocaleMap: Record<Locale, string> = {
  pt: "pt_PT",
  en: "en_US",
  ar: "ar_SA",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const title = `Braga Event — ${t("titlePrefix")} ${t("titleHighlight")}`;
  const description = t("subtitle");

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: "%s · Braga Event",
    },
    description,
    keywords: [
      "Braga",
      "eventos em Braga",
      "Braga events",
      "o que fazer em Braga",
      "concertos Braga",
      "agenda cultural Braga",
      "Braga Event",
    ],
    alternates: {
      canonical: `/${locale}`,
      languages: {
        pt: "/pt",
        en: "/en",
        ar: "/ar",
      },
    },
    openGraph: {
      type: "website",
      locale: ogLocaleMap[locale as Locale] ?? "pt_PT",
      siteName: "Braga Event",
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleRootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const dir = isRtlLocale(locale) ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${display.variable} ${body.variable} ${arabic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
