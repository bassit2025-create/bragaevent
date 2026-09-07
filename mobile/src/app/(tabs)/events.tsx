import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EventCard } from '@/components/EventCard';
import { ErrorView, LoadingView, EmptyView } from '@/components/ui/StateView';
import { BrandColors } from '@/constants/theme';
import { fetchCategories, fetchEvents } from '@/api/client';
import { useFetch } from '@/hooks/use-fetch';
import { useT, useLocale } from '@/i18n/LocaleProvider';
import type { EventFilters } from '@/api/types';

const WHEN_OPTIONS: { value: NonNullable<EventFilters['quando']>; labelKey: string }[] = [
  { value: 'hoje', labelKey: 'events.filterToday' },
  { value: 'amanha', labelKey: 'events.filterTomorrow' },
  { value: 'fim-de-semana', labelKey: 'events.filterWeekend' },
  { value: 'esta-semana', labelKey: 'events.filterWeek' },
  { value: 'este-mes', labelKey: 'events.filterMonth' },
];

export default function EventsScreen() {
  const params = useLocalSearchParams<{ q?: string; categoria?: string }>();

  // Remount the inner screen whenever the incoming nav params change
  // (e.g. tapping a category tile pushes new params onto this same
  // route). This resets local filter state from the new params without
  // syncing state inside an effect.
  return <EventsScreenInner key={`${params.q ?? ''}-${params.categoria ?? ''}`} params={params} />;
}

function EventsScreenInner({ params }: { params: { q?: string; categoria?: string } }) {
  const t = useT();
  const { isRtl } = useLocale();

  const [search, setSearch] = useState(params.q ?? '');
  const [when, setWhen] = useState<EventFilters['quando'] | undefined>();
  const [category, setCategory] = useState(params.categoria);
  const [free, setFree] = useState(false);

  const filters: EventFilters = { q: search || undefined, categoria: category, quando: when, gratis: free };

  const { data: categories } = useFetch((signal) => fetchCategories(signal), []);
  const { data: events, loading, error, refreshing, refresh, retry } = useFetch(
    (signal) => fetchEvents(filters, signal),
    [search, category, when, free]
  );

  function toggleWhen(value: NonNullable<EventFilters['quando']>) {
    setWhen((prev) => (prev === value ? undefined : value));
  }

  const hasActiveFilters = Boolean(search || category || when || free);

  function clearFilters() {
    setSearch('');
    setCategory(undefined);
    setWhen(undefined);
    setFree(false);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Text style={[styles.title, isRtl && styles.textRight]}>{t('events.title')}</Text>

      <View style={[styles.searchBox, isRtl && styles.rowReverse]}>
        <Ionicons name="search" size={18} color={BrandColors.inkSoft} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder={t('events.searchPlaceholder')}
          placeholderTextColor={BrandColors.inkSoft}
          style={[styles.searchInput, isRtl && styles.textRight]}
        />
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
        contentContainerStyle={styles.filterContent}
        data={[
          ...WHEN_OPTIONS.map((opt) => ({ type: 'when' as const, ...opt })),
          { type: 'free' as const, value: 'gratis', labelKey: 'events.filterFree' },
          ...(categories ?? []).map((c) => ({
            type: 'category' as const,
            value: c.slug,
            label: `${c.icon} ${c.name}`,
          })),
        ]}
        keyExtractor={(item, i) => `${item.type}-${item.value}-${i}`}
        renderItem={({ item }) => {
          if (item.type === 'when') {
            const active = when === item.value;
            return (
              <Pressable
                style={[styles.filterChip, active && styles.filterChipActive]}
                onPress={() => toggleWhen(item.value as NonNullable<EventFilters['quando']>)}>
                <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                  {t(item.labelKey)}
                </Text>
              </Pressable>
            );
          }
          if (item.type === 'free') {
            return (
              <Pressable
                style={[styles.filterChip, free && styles.filterChipFreeActive]}
                onPress={() => setFree((v) => !v)}>
                <Text style={[styles.filterChipText, free && styles.filterChipTextActive]}>
                  {t('events.filterFree')}
                </Text>
              </Pressable>
            );
          }
          const active = category === item.value;
          return (
            <Pressable
              style={[styles.filterChip, active && styles.filterChipCategoryActive]}
              onPress={() => setCategory(active ? undefined : item.value)}>
              <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                {item.label}
              </Text>
            </Pressable>
          );
        }}
        ListFooterComponent={
          hasActiveFilters ? (
            <Pressable style={styles.clearChip} onPress={clearFilters}>
              <Ionicons name="close" size={14} color={BrandColors.inkSoft} />
              <Text style={styles.clearChipText}>{t('events.clearFilters')}</Text>
            </Pressable>
          ) : null
        }
      />

      {loading ? (
        <LoadingView />
      ) : error ? (
        <ErrorView onRetry={retry} />
      ) : !events || events.length === 0 ? (
        <EmptyView title={t('events.emptyTitle')} description={t('events.emptyDescription')} icon="🔍" />
      ) : (
        <FlatList
          data={events}
          keyExtractor={(e) => e.id}
          numColumns={2}
          columnWrapperStyle={styles.column}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
          ListHeaderComponent={
            <Text style={[styles.resultsCount, isRtl && styles.textRight]}>
              {t(events.length === 1 ? 'events.resultsCount_one' : 'events.resultsCount_other', {
                count: events.length,
              })}
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.gridItem}>
              <EventCard event={item} />
            </View>
          )}
        />
      )}
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
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginHorizontal: 20,
    marginTop: 14,
    borderWidth: 1,
    borderColor: 'rgba(23,19,16,0.08)',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: BrandColors.ink,
  },
  filterRow: {
    marginTop: 12,
    flexGrow: 0,
  },
  filterContent: {
    gap: 8,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  filterChip: {
    backgroundColor: 'rgba(23,19,16,0.06)',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  filterChipActive: {
    backgroundColor: BrandColors.accent,
  },
  filterChipFreeActive: {
    backgroundColor: '#059669',
  },
  filterChipCategoryActive: {
    backgroundColor: BrandColors.azul,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: BrandColors.ink,
  },
  filterChipTextActive: {
    color: '#fff',
  },
  clearChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
  },
  clearChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: BrandColors.inkSoft,
  },
  resultsCount: {
    fontSize: 13,
    fontWeight: '600',
    color: BrandColors.inkSoft,
    marginBottom: 12,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  column: {
    gap: 12,
  },
  gridItem: {
    flex: 1,
    marginBottom: 12,
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  textRight: {
    textAlign: 'right',
  },
});
