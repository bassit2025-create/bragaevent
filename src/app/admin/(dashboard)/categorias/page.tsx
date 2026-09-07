import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CategoryCard } from "@/components/admin/CategoryCard";
import { NewCategoryForm } from "@/components/admin/NewCategoryForm";

export const metadata: Metadata = { title: "Categorias" };

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { events: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink md:text-3xl">
        Categorias
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        Organiza os eventos de Braga por tipo de experiência.
      </p>

      <div className="mt-6">
        <NewCategoryForm />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((cat) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            eventCount={cat._count.events}
          />
        ))}
      </div>
    </div>
  );
}
