import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  defaultLocale,
  locales,
  rtlLocales,
  translations,
  type Locale,
} from '@/i18n/translations';

const STORAGE_KEY = 'braga-event.locale';

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => Promise<void>;
  isRtl: boolean;
  ready: boolean;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function detectDeviceLocale(): Locale {
  const deviceLocales = Localization.getLocales();
  for (const l of deviceLocales) {
    const code = l.languageCode?.toLowerCase();
    if (code && (locales as string[]).includes(code)) {
      return code as Locale;
    }
  }
  return defaultLocale;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (!mounted) return;
      const initial =
        stored && (locales as string[]).includes(stored)
          ? (stored as Locale)
          : detectDeviceLocale();
      setLocaleState(initial);
      setReady(true);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const isRtl = (rtlLocales as string[]).includes(locale);

  // We deliberately do NOT call I18nManager.forceRTL here: that flips the
  // OS-level layout direction and requires a full app reload to apply
  // consistently, which is a jarring UX for a simple language switch.
  // Instead, every screen reads `isRtl` from this context and flips its
  // own flexDirection/textAlign/icon mirroring directly — same approach
  // used by the web app's logical CSS properties.

  const setLocale = useCallback(async (next: Locale) => {
    setLocaleState(next);
    await AsyncStorage.setItem(STORAGE_KEY, next);
  }, []);

  const value = useMemo(
    () => ({ locale, setLocale, isRtl, ready }),
    [locale, setLocale, isRtl, ready]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within a LocaleProvider');
  return ctx;
}

/**
 * Translation hook. Usage: const t = useT(); t('home.titlePrefix')
 * Supports {placeholder} interpolation and _one/_other pluralization
 * (pass a numeric `count` to auto-select the right suffix).
 */
export function useT() {
  const { locale } = useLocale();

  return useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const count = vars?.count;
      let resolvedKey = key;
      if (typeof count === 'number') {
        resolvedKey = `${key}_${count === 1 ? 'one' : 'other'}`;
      }

      const parts = resolvedKey.split('.');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let value: any = translations[locale];
      for (const part of parts) {
        value = value?.[part];
      }

      if (typeof value !== 'string') return key;

      if (!vars) return value;
      return Object.entries(vars).reduce(
        (acc, [k, v]) => acc.replaceAll(`{${k}}`, String(v)),
        value as string
      );
    },
    [locale]
  );
}
