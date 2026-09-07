import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { BrandColors } from '@/constants/theme';
import { useT } from '@/i18n/LocaleProvider';

export function LoadingView() {
  const t = useT();
  return (
    <View style={styles.center}>
      <ActivityIndicator color={BrandColors.accent} size="large" />
      <Text style={styles.text}>{t('common.loading')}</Text>
    </View>
  );
}

export function ErrorView({ onRetry }: { onRetry: () => void }) {
  const t = useT();
  return (
    <View style={styles.center}>
      <Text style={styles.emoji}>⚠️</Text>
      <Text style={styles.text}>{t('common.loadError')}</Text>
      <Pressable style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryText}>{t('common.retry')}</Text>
      </Pressable>
    </View>
  );
}

export function EmptyView({
  title,
  description,
  icon = '🌱',
}: {
  title: string;
  description?: string;
  icon?: string;
}) {
  return (
    <View style={styles.center}>
      <Text style={styles.emoji}>{icon}</Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      {description && <Text style={styles.text}>{description}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 10,
  },
  emoji: {
    fontSize: 36,
  },
  text: {
    fontSize: 14,
    color: BrandColors.inkSoft,
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: BrandColors.ink,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 8,
    backgroundColor: BrandColors.accent,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  retryText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
