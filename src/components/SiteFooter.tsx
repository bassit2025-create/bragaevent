import { useTranslations } from "next-intl";
import { MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { InstagramIcon } from "@/components/ui/InstagramIcon";

export function SiteFooter() {
  const t = useTranslations("footer");

  return (
    <footer className="mt-auto border-t border-ink/8 bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <span className="font-display text-xl font-bold">
              BRAGA <span className="text-accent">EVENT</span>
            </span>
            <p className="mt-3 max-w-xs text-sm text-cream/70">
              {t("description")}
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-sm text-cream/70">
              <MapPin size={16} />
              {t("location")}
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wide text-cream/50">
              {t("exploreHeading")}
            </h4>
            <nav className="mt-4 flex flex-col gap-2 text-sm">
              <Link href="/eventos" className="text-cream/80 hover:text-accent">
                {t("allEvents")}
              </Link>
              <Link
                href="/eventos?quando=hoje"
                className="text-cream/80 hover:text-accent"
              >
                {t("todayInBraga")}
              </Link>
              <Link
                href="/eventos?quando=fim-de-semana"
                className="text-cream/80 hover:text-accent"
              >
                {t("thisWeekend")}
              </Link>
              <Link href="/categorias" className="text-cream/80 hover:text-accent">
                {t("categories")}
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wide text-cream/50">
              {t("legalHeading")}
            </h4>
            <nav className="mt-4 flex flex-col gap-2 text-sm">
              <Link href="/privacidade" className="text-cream/80 hover:text-accent">
                {t("privacyPolicy")}
              </Link>
              <Link href="/termos" className="text-cream/80 hover:text-accent">
                {t("termsConditions")}
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wide text-cream/50">
              {t("followHeading")}
            </h4>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Braga Event"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-accent"
              >
                <InstagramIcon size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-cream/50 md:flex-row">
          <span>© {new Date().getFullYear()} Braga Event. {t("rights")}</span>
          <span>{t("madeWith")}</span>
        </div>
      </div>
    </footer>
  );
}
