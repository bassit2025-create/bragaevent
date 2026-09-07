import { CategoryColors, BrandColors } from '@/constants/theme';

export function getCategoryColor(slug: string) {
  return CategoryColors[slug] ?? BrandColors.accent;
}
