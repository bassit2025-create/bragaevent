import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EventCard } from '@/components/EventCard';
import { ErrorView, LoadingView } from '@/components/ui/StateView';
import { BrandColors, CategoryColors } from '@/constants/theme';
import { fetchBanners, fetchUpcomingEvents } from '@/api/client';
import { useFetch } from '@/hooks/use-fetch';
import { useT, useLocale } from '@/i18n/LocaleProvider';

const CATEGORY_SHORTCUTS = [
  { emoji: '🎵', slug: 'musica', key: 'musica' },
  { emoji: '🎉', slug: 'festas', key: 'festas' },
  { emoji: '🎨', slug: 'cultura', key: 'cultura' },
  { emoji: '🍔', slug: 'gastronomia', key: 'gastronomia' },
  { emoji: '🏃', slug: 'desporto', key: 'desporto' },
  { emoji: '🛍️', slug: 'mercados', key: 'mercados' },
  { emoji: '🎓', slug: 'workshops', key: 'workshops' },
  { emoji: '👨‍👩‍👧', slug: 'familia', key: 'familia' },
];

export default function HomeScreen() {
  const router = useRouter();
  const t = useT();
  const { isRtl } = useLocale();
  const [search, setSearch] = useState('');

  const { data, loading, error, refreshing, refresh, retry } = useFetch(
    async (signal) => {
      const [events, banners] = await Promise.all([
        fetchUpcomingEvents(signal),
        fetchBanners(signal),
      ]);
      return { events, banners };
    },
    []
  );

  function handleSearchSubmit() {
    router.push({ pathname: '/events', params: search ? { q: search } : {} });
  }

  if (loading) return <LoadingView />;
  if (error || !data) return <ErrorView onRetry={retry} />;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
        contentContainerStyle={styles.scrollContent}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>✨ {t('home.badge')}</Text>
          </View>
          <Text style={[styles.title, isRtl && styles.textRight]}>
            {t('home.titlePrefix')}{' '}
            <Text style={styles.titleAccent}>{t('home.titleHighlight')}</Text>
          </Text>
          <Text style={[styles.subtitle, isRtl && styles.textRight]}>{t('home.subtitle')}</Text>

          <View style={[styles.searchBox, isRtl && styles.rowReverse]}>
            <Ionicons name="search" size={18} color={BrandColors.inkSoft} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              onSubmitEditing={handleSearchSubmit}
              placeholder={t('home.searchPlaceholder')}
              placeholderTextColor="rgba(255,255,255,0.5)"
              style={[styles.searchInput, isRtl && styles.textRight]}
              returnKeyType="search"
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipsRow}
            contentContainerStyle={styles.chipsContent}>
            {(isRtl ? [...CATEGORY_SHORTCUTS].reverse() : CATEGORY_SHORTCUTS).map((c) => (
              <Pressable
                key={c.slug}
                style={styles.chip}
                onPress={() => router.push({ pathname: '/events', params: { categoria: c.slug } })}>
                <Text style={styles.chipText}>
                  {c.emoji} {t(`categoryShortcuts.${c.key}`)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Featured banners */}
        {data.banners.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isRtl && styles.textRight]}>
              {t('home.featuredHeading')}
            </Text>
            <FlatList
              horizontal
              data={isRtl ? [...data.banners].reverse() : data.banners}
              keyExtractor={(b) => b.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.bannerList}
              renderItem={({ item }) => (
                <Pressable style={styles.bannerCard}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.bannerImage}
                    contentFit="cover"
                    alt={item.name}
                  />
                  <View style={styles.bannerOverlay}>
                    <Text style={styles.bannerProject}>{item.projectName}</Text>
                    <Text style={styles.bannerName} numberOfLines={1}>
                      {item.name}
                    </Text>
                  </View>
                </Pressable>
              )}
            />
          </View>
        )}

        {/* Upcoming events */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader, isRtl && styles.rowReverse]}>
            <View>
              <Text style={[styles.sectionTitle, isRtl && styles.textRight]}>
                {t('home.upcomingHeading')}
              </Text>
              <Text style={[styles.sectionSubtitle, isRtl && styles.textRight]}>
                {t('home.upcomingSubheading')}
              </Text>
            </View>
          </View>

          <View style={styles.grid}>
            {data.events.map((event) => (
              <View key={event.id} style={styles.gridItem}>
                <EventCard event={event} />
              </View>
            ))}
          </View>

          <Pressable style={styles.viewAllButton} onPress={() => router.push('/events')}>
            <Text style={styles.viewAllText}>{t('home.viewAll')}</Text>
          </Pressable>
        </View>

        {/* Category grid */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isRtl && styles.textRight]}>
            {t('home.categoriesHeading')}
          </Text>
          <View style={styles.categoryGrid}>
            {CATEGORY_SHORTCUTS.map((c) => (
              <Pressable
                key={c.slug}
                style={[styles.categoryTile, { backgroundColor: CategoryColors[c.slug] }]}
                onPress={() => router.push({ pathname: '/events', params: { categoria: c.slug } })}>
                <Text style={styles.categoryEmoji}>{c.emoji}</Text>
                <Text style={styles.categoryLabel}>{t(`categoryShortcuts.${c.key}`)}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BrandColors.cream,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  hero: {
    backgroundColor: BrandColors.ink,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  badgeText: {
    color: 'rgba(250,246,239,0.9)',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    color: BrandColors.cream,
    fontSize: 30,
    fontWeight: '700',
    marginTop: 14,
    lineHeight: 36,
  },
  titleAccent: {
    color: BrandColors.accent,
  },
  subtitle: {
    color: 'rgba(250,246,239,0.75)',
    fontSize: 14,
    marginTop: 10,
    lineHeight: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 18,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: BrandColors.ink,
  },
  chipsRow: {
    marginTop: 14,
  },
  chipsContent: {
    gap: 8,
    paddingVertical: 2,
  },
  chip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipText: {
    color: 'rgba(250,246,239,0.9)',
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionHeader: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: BrandColors.ink,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: BrandColors.inkSoft,
    marginTop: 2,
  },
  bannerList: {
    gap: 12,
    paddingTop: 14,
  },
  bannerCard: {
    width: 220,
    aspectRatio: 16 / 10,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: BrandColors.creamSoft,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  bannerProject: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 10,
    fontWeight: '600',
  },
  bannerName: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 14,
  },
  gridItem: {
    width: '47%',
  },
  viewAllButton: {
    marginTop: 18,
    alignSelf: 'center',
    backgroundColor: BrandColors.ink,
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  viewAllText: {
    color: BrandColors.cream,
    fontWeight: '700',
    fontSize: 14,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 14,
  },
  categoryTile: {
    width: '47%',
    borderRadius: 18,
    padding: 16,
    minHeight: 90,
    justifyContent: 'space-between',
  },
  categoryEmoji: {
    fontSize: 26,
  },
  categoryLabel: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  textRight: {
    textAlign: 'right',
  },
});
