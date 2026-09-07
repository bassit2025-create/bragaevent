import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { BrandColors } from '@/constants/theme';

type Tone = 'accent' | 'ink' | 'success' | 'neutral' | 'azul';

const toneStyles: Record<Tone, { bg: string; text: string }> = {
  accent: { bg: BrandColors.accent, text: '#fff' },
  ink: { bg: BrandColors.ink, text: BrandColors.cream },
  success: { bg: '#059669', text: '#fff' },
  neutral: { bg: 'rgba(23,19,16,0.08)', text: BrandColors.ink },
  azul: { bg: BrandColors.azul, text: '#fff' },
};

export function Badge({
  label,
  tone = 'neutral',
  style,
}: {
  label: string;
  tone?: Tone;
  style?: ViewStyle;
}) {
  const t = toneStyles[tone];
  return (
    <View style={[styles.base, { backgroundColor: t.bg }, style]}>
      <Text style={[styles.text, { color: t.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
});
