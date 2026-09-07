import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { EventCard } from '@/components/EventCard';
import { Badge } from '@/components/ui/Badge';
import { ErrorView, LoadingView } from '@/components/ui/StateView';
import { fetchEventBySlug } from '@/api/client';
import { API_BASE_URL } from '@/constants/config';
import { BrandColors } from '@/constants/theme';
import { getCategoryColor } from '@/constants/categoryColors';
import { useFetch } from '@/hooks/use-fetch';
import { addEventToDeviceCalendar } from '@/lib/addToCalendar';
import { formatDateLong, formatPrice } from '@/lib/format';
import { useLocale, useT } from '@/i18n/LocaleProvider';

export default function EventDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const t = useT();
  const { locale, isRtl } = useLocale();
  const [addingToCalendar, setAddingToCalendar] = useState(false);

  const { data, loading, error, retry } = useFetch(
    (signal) => fetchEventBySlug(slug, signal),
    [slug]
  );

  if (loading) return <LoadingView />;
  if (error || !data) return <ErrorView onRetry={retry} />;

  const { event, related } = data;
  const categoryColor = getCategoryColor(event.category.slug);

  async function handleShare() {
    const url = `${API_BASE_URL}/pt/eventos/${event.slug}`;
    try {
      await Share.share({ message: `${event.title}\n${url}`, url });
    } catch {
      await Clipboard.setStringAsync(url);
      Alert.alert(t('eventDetail.linkCopied'));
    }
  }

  async function handleAddToCalendar() {
    setAddingToCalendar(true);
    try {
      const ok = await addEventToDeviceCalendar({
        title: event.title,
        notes: event.description,
        location: `${event.location}, ${event.address}`,
        date: event.date,
        startTime: event.startTime,
        endTime: event.endTime,
      });
      Alert.alert(ok ? t('eventDetail.addedToCalendar') : t('eventDetail.calendarError'));
    } catch {
      Alert.alert(t('eventDetail.calendarError'));
    } finally {
      setAddingToCalendar(false);
    }
  }

  function handleOpenMaps() {
    const query = encodeURIComponent(event.address);
    Linking.openURL(`https://maps.google.com/maps?q=${query}`);
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: event.image }} style={styles.heroImage} contentFit="cover" alt={event.title} />
        <View style={styles.imageOverlay} />
        <View style={[styles.heroContent, isRtl && styles.rtlAlign]}>
          <View style={[styles.badgeRow, isRtl && styles.rowReverse]}>
            <Badge
              label={`${event.category.icon} ${event.category.name}`}
              style={{ backgroundColor: categoryColor }}
            />
            <Badge label={formatPrice(event.price, event.isFree, locale)} tone={event.isFree ? 'success' : 'ink'} />
          </View>
          <Text style={[styles.heroTitle, isRtl && styles.textRight]}>{event.title}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={[styles.actionsRow, isRtl && styles.rowReverse]}>
          <Pressable style={styles.primaryButton} onPress={handleAddToCalendar} disabled={addingToCalendar}>
            <Ionicons name="calendar" size={16} color="#fff" />
            <Text style={styles.primaryButtonText}>{t('eventDetail.addToCalendar')}</Text>
          </Pressable>
          <Pressable style={styles.outlineButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={16} color={BrandColors.ink} />
            <Text style={styles.outlineButtonText}>{t('eventDetail.share')}</Text>
          </Pressable>
        </View>

        <View style={styles.infoGrid}>
          <InfoTile icon="calendar-outline" label={t('eventDetail.date')} value={formatDateLong(event.date, locale)} />
          <InfoTile
            icon="time-outline"
            label={t('eventDetail.time')}
            value={event.endTime ? `${event.startTime} – ${event.endTime}` : event.startTime}
          />
          <InfoTile icon="location-outline" label={t('eventDetail.location')} value={event.location} />
          <InfoTile icon="pricetag-outline" label={t('eventDetail.price')} value={formatPrice(event.price, event.isFree, locale)} />
        </View>

        <Section title={t('eventDetail.about')} isRtl={isRtl}>
          <Text style={[styles.description, isRtl && styles.textRight]}>{event.description}</Text>
        </Section>

        <Section title={t('eventDetail.location')} isRtl={isRtl}>
          <Text style={[styles.address, isRtl && styles.textRight]}>{event.address}</Text>
          <Pressable style={styles.mapButton} onPress={handleOpenMaps}>
            <Ionicons name="map-outline" size={16} color={BrandColors.azul} />
            <Text style={styles.mapButtonText}>{t('eventDetail.openInMaps')}</Text>
          </Pressable>
        </Section>

        <Section title={t('eventDetail.organizer')} isRtl={isRtl}>
          <Text style={[styles.organizerName, isRtl && styles.textRight]}>{event.organizer}</Text>
          {event.website && (
            <Pressable onPress={() => Linking.openURL(event.website!)}>
              <Text style={styles.link}>{t('eventDetail.website')}</Text>
            </Pressable>
          )}
          {event.instagram && (
            <Pressable onPress={() => Linking.openURL(event.instagram!)}>
              <Text style={styles.link}>{t('eventDetail.instagram')}</Text>
            </Pressable>
          )}
        </Section>

        {related.length > 0 && (
          <Section title={t('eventDetail.relatedEvents')} isRtl={isRtl}>
            <View style={styles.relatedGrid}>
              {related.map((e) => (
                <View key={e.id} style={styles.relatedItem}>
                  <EventCard event={e} />
                </View>
              ))}
            </View>
          </Section>
        )}
      </View>
    </ScrollView>
  );
}

function Section({
  title,
  isRtl,
  children,
}: {
  title: string;
  isRtl: boolean;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, isRtl && styles.textRight]}>{title}</Text>
      {children}
    </View>
  );
}

function InfoTile({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.infoTile}>
      <View style={styles.infoTileHeader}>
        <Ionicons name={icon} size={14} color={BrandColors.inkSoft} />
        <Text style={styles.infoTileLabel}>{label}</Text>
      </View>
      <Text style={styles.infoTileValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    backgroundColor: BrandColors.cream,
  },
  imageWrapper: {
    height: 340,
    backgroundColor: BrandColors.creamSoft,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 24,
  },
  rtlAlign: {
    alignItems: 'flex-end',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
    marginTop: 10,
    lineHeight: 32,
  },
  body: {
    padding: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: BrandColors.accent,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13.5,
  },
  outlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(23,19,16,0.15)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  outlineButtonText: {
    color: BrandColors.ink,
    fontWeight: '700',
    fontSize: 13.5,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 20,
  },
  infoTile: {
    width: '47%',
    backgroundColor: BrandColors.creamSoft,
    borderRadius: 14,
    padding: 12,
  },
  infoTileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  infoTileLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: BrandColors.inkSoft,
    textTransform: 'uppercase',
  },
  infoTileValue: {
    fontSize: 13.5,
    fontWeight: '700',
    color: BrandColors.ink,
    marginTop: 4,
  },
  section: {
    marginTop: 26,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: BrandColors.ink,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: BrandColors.inkSoft,
    lineHeight: 21,
  },
  address: {
    fontSize: 14,
    color: BrandColors.inkSoft,
    marginBottom: 10,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mapButtonText: {
    color: BrandColors.azul,
    fontWeight: '700',
    fontSize: 13.5,
  },
  organizerName: {
    fontSize: 15,
    fontWeight: '700',
    color: BrandColors.ink,
    marginBottom: 6,
  },
  link: {
    color: BrandColors.azul,
    fontWeight: '600',
    fontSize: 13.5,
    marginTop: 4,
  },
  relatedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  relatedItem: {
    width: '47%',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  textRight: {
    textAlign: 'right',
  },
});
