"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { Globe, Check } from "lucide-react";
import { locales, localeNames, localeFlags, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({
  variant = "header",
}: {
  variant?: "header" | "mobile";
}) {
  const t = useTranslations("languageSwitcher");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function switchTo(nextLocale: Locale) {
    setOpen(false);
    const query = searchParams.toString();
    const href = query ? `${pathname}?${query}` : pathname;
    router.replace(href, { locale: nextLocale });
  }

  if (variant === "mobile") {
    return (
      <div>
        <p className="mb-2 px-4 text-xs font-bold uppercase tracking-wide text-ink-soft/60">
          {t("label")}
        </p>
        <div className="flex flex-col gap-1">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => switchTo(loc)}
              className={cn(
                "flex items-center justify-between rounded-2xl px-4 py-3 text-base font-semibold transition-colors",
                loc === locale
                  ? "bg-accent/10 text-accent"
                  : "text-ink hover:bg-ink/5"
              )}
            >
              <span className="flex items-center gap-2">
                <span>{localeFlags[loc]}</span>
                {localeNames[loc]}
              </span>
              {loc === locale && <Check size={18} />}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={t("label")}
        className="flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
      >
        <Globe size={18} />
        <span className="hidden sm:inline">{localeFlags[locale]}</span>
      </button>

      {open && (
        <div className="absolute end-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-xl bg-white py-1.5 shadow-xl ring-1 ring-ink/10">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => switchTo(loc)}
              className={cn(
                "flex w-full items-center justify-between px-4 py-2.5 text-start text-sm font-semibold transition-colors",
                loc === locale ? "text-accent" : "text-ink hover:bg-ink/5"
              )}
            >
              <span className="flex items-center gap-2">
                <span>{localeFlags[loc]}</span>
                {localeNames[loc]}
              </span>
              {loc === locale && <Check size={16} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
