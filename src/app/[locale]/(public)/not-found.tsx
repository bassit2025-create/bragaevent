import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <div className="text-5xl">🧭</div>
      <h1 className="mt-6 font-display text-3xl font-bold text-ink">
        {t("title")}
      </h1>
      <p className="mt-3 max-w-sm text-ink-soft">{t("description")}</p>
      <div className="mt-8">
        <Link
          href="/eventos"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark active:scale-[0.97]"
        >
          {t("cta")}
        </Link>
      </div>
      <Link href="/" className="mt-4 text-sm font-semibold text-ink-soft hover:text-ink">
        {t("backHome")}
      </Link>
    </div>
  );
}
