import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MobileNav } from "@/components/MobileNav";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function SiteHeader() {
  const t = useTranslations("nav");

  const navLinks = [
    { href: "/", label: t("inicio") },
    { href: "/eventos", label: t("eventos") },
    { href: "/eventos?quando=hoje", label: t("hoje") },
    { href: "/eventos?quando=fim-de-semana", label: t("fimDeSemana") },
    { href: "/categorias", label: t("categorias") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-ink/8 bg-cream">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-xl font-bold tracking-tight text-ink md:text-2xl">
            BRAGA <span className="text-accent">EVENT</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <div className="hidden lg:block">
            <LanguageSwitcher />
          </div>
          <MobileNav links={navLinks} />
        </div>
      </div>
    </header>
  );
}
