/**
 * Braga Event brand tokens, mirroring the web app's
 * src/app/globals.css, so the mobile app feels like the same product.
 */

export const BrandColors = {
  cream: '#faf6ef',
  creamSoft: '#f3ede1',
  ink: '#171310',
  inkSoft: '#4a4238',
  accent: '#ff5a3c',
  accentDark: '#e13f22',
  accentSoft: '#ffe4da',
  azul: '#2952e3',
  azulSoft: '#dde6ff',
} as const;

export const CategoryColors: Record<string, string> = {
  musica: '#ff5a3c',
  festas: '#d6318c',
  cultura: '#2952e3',
  gastronomia: '#f2a900',
  desporto: '#12a879',
  mercados: '#a35b1f',
  workshops: '#7c4dff',
  familia: '#12a879',
};

export const Colors = {
  light: {
    text: BrandColors.ink,
    background: BrandColors.cream,
    backgroundElement: BrandColors.creamSoft,
    backgroundSelected: BrandColors.accentSoft,
    textSecondary: BrandColors.inkSoft,
    accent: BrandColors.accent,
    azul: BrandColors.azul,
  },
  dark: {
    text: BrandColors.cream,
    background: BrandColors.ink,
    backgroundElement: '#241f1a',
    backgroundSelected: '#33261f',
    textSecondary: '#c9bfae',
    accent: BrandColors.accent,
    azul: BrandColors.azul,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;
