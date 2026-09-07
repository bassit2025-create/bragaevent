"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@prisma/client";

const whenOptions = [
  { value: "hoje", label: "Hoje" },
  { value: "amanha", label: "Amanhã" },
  { value: "fim-de-semana", label: "Este fim de semana" },
  { value: "esta-semana", label: "Esta semana" },
  { value: "este-mes", label: "Este mês" },
];

export function FilterBar({
  categories,
  locations,
}: {
  categories: Category[];
  locations: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentQ = searchParams.get("q") ?? "";
  const currentWhen = searchParams.get("quando") ?? "";
  const currentCategory = searchParams.get("categoria") ?? "";
  const currentFree = searchParams.get("gratis") === "1";
  const currentLocation = searchParams.get("local") ?? "";

  const [q, setQ] = useState(currentQ);

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function toggleParam(key: string, activeValue: string, currentValue: string) {
    updateParam(key, currentValue === activeValue ? null : activeValue);
  }

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    updateParam("q", q.trim() || null);
  }

  function clearAll() {
    setQ("");
    router.push(pathname);
  }

  const hasActiveFilters =
    currentQ || currentWhen || currentCategory || currentFree || currentLocation;

  return (
    <div className="sticky top-16 z-30 -mx-4 border-b border-ink/8 bg-cream px-4 py-3 md:-mx-8 md:px-8">
      <form onSubmit={handleSearchSubmit} className="mb-3 flex gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-white px-3 ring-1 ring-ink/10">
          <Search size={18} className="shrink-0 text-ink-soft" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Procurar eventos, locais..."
            className="w-full bg-transparent py-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="shrink-0 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-cream"
        >
          Procurar
        </button>
      </form>

      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
        {whenOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => toggleParam("quando", opt.value, currentWhen)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
              currentWhen === opt.value
                ? "bg-accent text-white"
                : "bg-ink/5 text-ink hover:bg-ink/10"
            )}
          >
            {opt.label}
          </button>
        ))}

        <span className="mx-1 h-5 w-px shrink-0 bg-ink/10" />

        <button
          onClick={() => updateParam("gratis", currentFree ? null : "1")}
          className={cn(
            "shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
            currentFree ? "bg-emerald-600 text-white" : "bg-ink/5 text-ink hover:bg-ink/10"
          )}
        >
          Grátis
        </button>

        <span className="mx-1 h-5 w-px shrink-0 bg-ink/10" />

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => toggleParam("categoria", cat.slug, currentCategory)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
              currentCategory === cat.slug
                ? "bg-azul text-white"
                : "bg-ink/5 text-ink hover:bg-ink/10"
            )}
          >
            {cat.icon} {cat.name}
          </button>
        ))}

        {locations.length > 0 && (
          <>
            <span className="mx-1 h-5 w-px shrink-0 bg-ink/10" />
            <select
              value={currentLocation}
              onChange={(e) => updateParam("local", e.target.value || null)}
              className={cn(
                "shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
                currentLocation ? "bg-azul text-white" : "bg-ink/5 text-ink hover:bg-ink/10"
              )}
            >
              <option value="">Todos os locais</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </>
        )}

        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="ml-1 inline-flex shrink-0 items-center gap-1 rounded-full px-4 py-1.5 text-sm font-semibold text-ink-soft hover:text-ink"
          >
            <X size={14} /> Limpar
          </button>
        )}
      </div>
    </div>
  );
}
