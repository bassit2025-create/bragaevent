import { useLocale } from '@/i18n/LocaleProvider';

/**
 * Returns small helpers for building RTL-aware inline styles without
 * relying on the OS-level I18nManager flip. Use `row` for a flex-row
 * layout that should mirror in Arabic, and `textAlign` for text that
 * should follow reading direction.
 */
export function useRtlStyle() {
  const { isRtl } = useLocale();

  return {
    isRtl,
    row: { flexDirection: isRtl ? ('row-reverse' as const) : ('row' as const) },
    textAlign: { textAlign: isRtl ? ('right' as const) : ('left' as const) },
    /** Mirrors an icon that implies direction (e.g. a "back" chevron). */
    mirror: { transform: [{ scaleX: isRtl ? -1 : 1 }] },
  };
}
