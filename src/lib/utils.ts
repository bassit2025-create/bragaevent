import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Maps app locales to BCP-47 tags used by the Intl API. Arabic uses the
 * `-u-nu-latn` extension so dates keep familiar Western (Latin) digits
 * instead of switching to Eastern Arabic-Indic numerals, which reads more
 * naturally for a Portuguese city's event dates/times. */
const INTL_LOCALE_MAP: Record<string, string> = {
  pt: "pt-PT",
  en: "en-GB",
  ar: "ar-u-nu-latn",
};

function toIntlLocale(locale: string) {
  return INTL_LOCALE_MAP[locale] ?? "pt-PT";
}

/** e.g. "12 SET" / "12 SEP" */
export function formatEventDateShort(date: Date, locale = "pt") {
  const d = new Date(date);
  const formatted = new Intl.DateTimeFormat(toIntlLocale(locale), {
    day: "numeric",
    month: "short",
  }).format(d);
  return locale === "ar" ? formatted : formatted.toUpperCase();
}

/** e.g. "sexta, 12 de setembro" / "Friday, 12 September" */
export function formatEventDateLong(date: Date, locale = "pt") {
  const d = new Date(date);
  return new Intl.DateTimeFormat(toIntlLocale(locale), {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(d);
}

const FREE_LABEL: Record<string, string> = {
  pt: "Grátis",
  en: "Free",
  ar: "مجاني",
};

export function formatPrice(
  price: number,
  isFree: boolean,
  locale = "pt"
) {
  if (isFree) return FREE_LABEL[locale] ?? FREE_LABEL.pt;
  return new Intl.NumberFormat(toIntlLocale(locale), {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

/** e.g. "7 de setembro de 2026" / "7 September 2026" — used for the
 * "last updated" date on legal pages. */
export function formatLongDate(date: Date, locale = "pt") {
  return new Intl.DateTimeFormat(toIntlLocale(locale), {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * Returns the [start, end) date range for a given quick filter, anchored
 * on "now". Used both by the UI and by the events query layer so the
 * definition of "this weekend" etc. stays in one place.
 */
export function getDateRangeForFilter(
  filter: string,
  now: Date = new Date()
): { from: Date; to: Date } | null {
  const today = startOfDay(now);

  switch (filter) {
    case "hoje":
      return { from: today, to: addDays(today, 1) };
    case "amanha":
      return { from: addDays(today, 1), to: addDays(today, 2) };
    case "fim-de-semana": {
      // Find the upcoming Saturday (or today if it's already Sat/Sun)
      const day = today.getDay(); // 0 = Sunday, 6 = Saturday
      let daysUntilSaturday = (6 - day + 7) % 7;
      if (day === 0) daysUntilSaturday = -1; // today is Sunday, weekend already started
      const saturday = addDays(today, Math.max(daysUntilSaturday, 0));
      return { from: saturday, to: addDays(saturday, 2) };
    }
    case "esta-semana":
      return { from: today, to: addDays(today, 7) };
    case "este-mes": {
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      return { from: today, to: end };
    }
    default:
      return null;
  }
}

export function truncate(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
