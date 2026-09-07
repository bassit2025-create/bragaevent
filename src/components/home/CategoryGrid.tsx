import Link from "next/link";
import { getAllCategories } from "@/lib/data/categories";
import { getCategoryStyle } from "@/lib/categoryStyles";

export async function CategoryGrid() {
  const categories = await getAllCategories();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <h2 className="mb-6 font-display text-2xl font-bold text-ink md:text-3xl">
        Explora por categoria
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {categories.map((cat) => {
          const style = getCategoryStyle(cat.slug);
          return (
            <Link
              key={cat.id}
              href={`/eventos?categoria=${cat.slug}`}
              className={`group relative flex flex-col items-start justify-between overflow-hidden rounded-2xl ${style.bg} p-5 transition-transform duration-300 hover:-translate-y-1`}
            >
              <span className="text-3xl transition-transform duration-300 group-hover:scale-110">
                {cat.icon}
              </span>
              <span className={`mt-3 font-display text-base font-bold ${style.text}`}>
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
