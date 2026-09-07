import { SearchBar } from "@/components/home/SearchBar";
import Link from "next/link";

const categoryShortcuts = [
  { emoji: "🎵", label: "Música", slug: "musica" },
  { emoji: "🎉", label: "Festas", slug: "festas" },
  { emoji: "🎨", label: "Cultura", slug: "cultura" },
  { emoji: "🍔", label: "Gastronomia", slug: "gastronomia" },
  { emoji: "🏃", label: "Desporto", slug: "desporto" },
  { emoji: "🛍️", label: "Mercados", slug: "mercados" },
  { emoji: "🎓", label: "Workshops", slug: "workshops" },
  { emoji: "👨‍👩‍👧", label: "Família", slug: "familia" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink">
      {/* Decorative gradient blobs */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-40 h-80 w-80 rounded-full bg-azul/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-16 md:px-8 md:pb-20 md:pt-24">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-cream/90">
            ✨ Braga, Portugal
          </span>

          <h1 className="mt-5 text-balance font-display text-4xl font-bold leading-[1.05] text-cream md:text-6xl lg:text-7xl">
            O que acontece <span className="text-accent">em Braga?</span>
          </h1>

          <p className="mt-5 max-w-xl text-balance text-base text-cream/75 md:text-lg">
            Descobre concertos, festas, cultura, mercados, workshops e tudo o
            que está a acontecer na cidade.
          </p>

          <div className="mt-8">
            <SearchBar />
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {categoryShortcuts.map((c) => (
              <Link
                key={c.slug}
                href={`/eventos?categoria=${c.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/8 px-4 py-2 text-sm font-semibold text-cream/90 ring-1 ring-white/10 transition-all hover:-translate-y-0.5 hover:bg-white/15"
              >
                <span>{c.emoji}</span>
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
