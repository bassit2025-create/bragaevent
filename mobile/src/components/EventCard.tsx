import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import { BrandColors } from '@/constants/theme';
import { getCategoryColor } from '@/constants/categoryColors';
import { useLocale } from '@/i18n/LocaleProvider';
import { formatDateShort, formatPrice } from '@/lib/format';
import type { EventDto } from '@/api/types';

export function EventCard({ event }: { event: EventDto }) {
  const router = useRouter();
  const { locale, isRtl } = useLocale();
  const categoryColor = getCategoryColor(event.category.slug);

  return (
    <Pressable
      onPress={() => router.push(`/event/${event.slug}`)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: event.image }} style={styles.image} contentFit="cover" alt={event.title} />

        <View style={[styles.topRow, isRtl && styles.topRowRtl]}>
          <Badge
            label={`${event.category.icon} ${event.category.name}`}
            style={{ backgroundColor: categoryColor }}
          />
        </View>

        <View style={[styles.priceBadge, isRtl && styles.priceBadgeRtl]}>
          <Badge label={formatPrice(event.price, event.isFree, locale)} tone={event.isFree ? 'success' : 'ink'} />
        </View>

        <View style={[styles.dateChip, isRtl && styles.dateChipRtl]}>
          <Text style={styles.dateChipText}>{formatDateShort(event.date, locale)}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={[styles.title, isRtl && styles.textRight]} numberOfLines={2}>
          {event.title}
        </Text>
        <View style={[styles.metaRow, isRtl && styles.rowReverse]}>
          <Text style={styles.metaText} numberOfLines={1}>
            {event.startTime} · {event.location}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    backgroundColor: '#fff',
    overflow: 'hidden',
    flex: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  pressed: {
    opacity: 0.85,
  },
  imageWrapper: {
    aspectRatio: 4 / 3,
    backgroundColor: BrandColors.creamSoft,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  topRow: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  topRowRtl: {
    left: undefined,
    right: 10,
  },
  priceBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  priceBadgeRtl: {
    right: undefined,
    left: 10,
  },
  dateChip: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  dateChipRtl: {
    left: undefined,
    right: 10,
  },
  dateChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: BrandColors.ink,
  },
  body: {
    padding: 12,
    gap: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: BrandColors.ink,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  metaText: {
    fontSize: 12.5,
    color: BrandColors.inkSoft,
    fontWeight: '500',
  },
  textRight: {
    textAlign: 'right',
  },
});
