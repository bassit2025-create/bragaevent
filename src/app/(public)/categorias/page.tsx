import type { Metadata } from "next";
import Link from "next/link";
import { getAllCategories } from "@/lib/data/categories";
import { getCategoryStyle } from "@/lib/categoryStyles";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Categorias de eventos em Braga",
  description:
    "Explora eventos em Braga por categoria: música, festas, cultura, gastronomia, desporto, mercados, workshops e família.",
  alternates: { canonical: "/categorias" },
};

export default async function CategoriesPage() {
  const categories = await getAllCategories();
  const counts = await prisma.event.groupBy({
    by: ["categoryId"],
    where: { status: "PUBLISHED" },
    _count: { _all: true },
  });
  const countMap = new Map(counts.map((c) => [c.categoryId, c._count._all]));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <h1 className="font-display text-3xl font-bold text-ink md:text-4xl">
        Categorias
      </h1>
      <p className="mt-2 max-w-lg text-ink-soft">
        Escolhe o que te apetece fazer em Braga hoje.
      </p>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((cat) => {
          const style = getCategoryStyle(cat.slug);
          const count = countMap.get(cat.id) ?? 0;
          return (
            <Link
              key={cat.id}
              href={`/eventos?categoria=${cat.slug}`}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl ${style.bg} p-6 transition-transform duration-300 hover:-translate-y-1.5`}
            >
              <span className="text-4xl transition-transform duration-300 group-hover:scale-110">
                {cat.icon}
              </span>
              <div className="mt-4">
                <h2 className={`font-display text-lg font-bold ${style.text}`}>
                  {cat.name}
                </h2>
                <p className={`text-sm ${style.text} opacity-80`}>
                  {count} {count === 1 ? "evento" : "eventos"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
