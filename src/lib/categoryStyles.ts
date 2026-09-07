// Maps category slugs to Tailwind-safe color tokens defined in globals.css.
// Falls back to the signature accent color for unknown categories.

const map: Record<string, { bg: string; text: string }> = {
  musica: { bg: "bg-[var(--color-cat-musica)]", text: "text-white" },
  festas: { bg: "bg-[var(--color-cat-festas)]", text: "text-white" },
  cultura: { bg: "bg-[var(--color-cat-cultura)]", text: "text-white" },
  gastronomia: { bg: "bg-[var(--color-cat-gastronomia)]", text: "text-white" },
  desporto: { bg: "bg-[var(--color-cat-desporto)]", text: "text-white" },
  mercados: { bg: "bg-[var(--color-cat-mercados)]", text: "text-white" },
  workshops: { bg: "bg-[var(--color-cat-workshops)]", text: "text-white" },
  familia: { bg: "bg-[var(--color-cat-familia)]", text: "text-white" },
};

export function getCategoryStyle(slug: string) {
  return map[slug] ?? { bg: "bg-accent", text: "text-white" };
}
