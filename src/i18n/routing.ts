import { defineRouting } from "next-intl/routing";

// Supported locales for the public Braga Event site.
// The private /admin dashboard is intentionally NOT localized — it
// always renders in Portuguese, since it's only used by the site owner.
export const locales = ["pt", "en", "ar"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "pt";

export const localeNames: Record<Locale, string> = {
  pt: "Português",
  en: "English",
  ar: "العربية",
};

export const localeFlags: Record<Locale, string> = {
  pt: "🇵🇹",
  en: "🇬🇧",
  ar: "🇸🇦",
};

/** Locales that read right-to-left. */
export const rtlLocales: readonly Locale[] = ["ar"];

export function isRtlLocale(locale: string): boolean {
  return (rtlLocales as readonly string[]).includes(locale);
}

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
});
