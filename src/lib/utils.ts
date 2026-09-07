import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

const MONTHS_PT = [
  "JAN",
  "FEV",
  "MAR",
  "ABR",
  "MAI",
  "JUN",
  "JUL",
  "AGO",
  "SET",
  "OUT",
  "NOV",
  "DEZ",
];

const WEEKDAYS_PT = [
  "domingo",
  "segunda",
  "terça",
  "quarta",
  "quinta",
  "sexta",
  "sábado",
];

const MONTHS_FULL_PT = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

/** e.g. "12 SET" */
export function formatEventDateShort(date: Date) {
  const d = new Date(date);
  return `${d.getDate()} ${MONTHS_PT[d.getMonth()]}`;
}

/** e.g. "sexta, 12 de setembro" */
export function formatEventDateLong(date: Date) {
  const d = new Date(date);
  return `${WEEKDAYS_PT[d.getDay()]}, ${d.getDate()} de ${
    MONTHS_FULL_PT[d.getMonth()]
  }`;
}

export function formatPrice(price: number, isFree: boolean) {
  if (isFree) return "Grátis";
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(price);
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
