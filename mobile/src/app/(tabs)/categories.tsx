import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorView, LoadingView } from '@/components/ui/StateView';
import { BrandColors } from '@/constants/theme';
import { getCategoryColor } from '@/constants/categoryColors';
import { fetchCategories, fetchEvents } from '@/api/client';
import { useFetch } from '@/hooks/use-fetch';
import { useT, useLocale } from '@/i18n/LocaleProvider';

export default function CategoriesScreen() {
  const router = useRouter();
  const t = useT();
  const { isRtl } = useLocale();

  const { data, loading, error, retry } = useFetch(async (signal) => {
    const [categories, events] = await Promise.all([fetchCategories(signal), fetchEvents({}, signal)]);
    const counts = new Map<string, number>();
    for (const e of events) {
      counts.set(e.category.slug, (counts.get(e.category.slug) ?? 0) + 1);
    }
    return { categories, counts };
  }, []);

  if (loading) return <LoadingView />;
  if (error || !data) return <ErrorView onRetry={retry} />;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Text style={[styles.title, isRtl && styles.textRight]}>{t('categories.title')}</Text>
      <Text style={[styles.subtitle, isRtl && styles.textRight]}>{t('categories.subtitle')}</Text>

      <FlatList
        data={data.categories}
        keyExtractor={(c) => c.id}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const count = data.counts.get(item.slug) ?? 0;
          return (
            <Pressable
              style={[styles.tile, { backgroundColor: getCategoryColor(item.slug) }]}
              onPress={() => router.push({ pathname: '/events', params: { categoria: item.slug } })}>
              <Text style={styles.emoji}>{item.icon}</Text>
              <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.count}>
                  {t(count === 1 ? 'categories.eventCount_one' : 'categories.eventCount_other', {
                    count,
                  })}
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BrandColors.cream,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: BrandColors.ink,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: BrandColors.inkSoft,
    paddingHorizontal: 20,
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  column: {
    gap: 12,
  },
  tile: {
    flex: 1,
    borderRadius: 20,
    padding: 18,
    minHeight: 120,
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  emoji: {
    fontSize: 32,
  },
  name: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  count: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    marginTop: 2,
  },
  textRight: {
    textAlign: 'right',
  },
});
