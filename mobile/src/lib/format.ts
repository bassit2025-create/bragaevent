import type { Locale } from '@/i18n/translations';

const INTL_LOCALE_MAP: Record<Locale, string> = {
  pt: 'pt-PT',
  en: 'en-GB',
  ar: 'ar-u-nu-latn',
};

function toIntlLocale(locale: Locale) {
  return INTL_LOCALE_MAP[locale] ?? 'pt-PT';
}

/** e.g. "12 SET" / "12 SEP" */
export function formatDateShort(dateIso: string, locale: Locale) {
  const d = new Date(dateIso);
  const formatted = new Intl.DateTimeFormat(toIntlLocale(locale), {
    day: 'numeric',
    month: 'short',
  }).format(d);
  return locale === 'ar' ? formatted : formatted.toUpperCase();
}

/** e.g. "sexta, 12 de setembro" / "Friday, 12 September" */
export function formatDateLong(dateIso: string, locale: Locale) {
  const d = new Date(dateIso);
  return new Intl.DateTimeFormat(toIntlLocale(locale), {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(d);
}

const FREE_LABEL: Record<Locale, string> = {
  pt: 'Grátis',
  en: 'Free',
  ar: 'مجاني',
};

export function formatPrice(price: number, isFree: boolean, locale: Locale) {
  if (isFree) return FREE_LABEL[locale];
  return new Intl.NumberFormat(toIntlLocale(locale), {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
}
