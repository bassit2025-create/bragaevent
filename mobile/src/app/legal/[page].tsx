import { useLocalSearchParams, Stack } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { BrandColors } from '@/constants/theme';
import { useLocale } from '@/i18n/LocaleProvider';
import { legalContent } from '@/i18n/legal';

export default function LegalPageScreen() {
  const { page } = useLocalSearchParams<{ page: 'privacidade' | 'termos' }>();
  const { locale, isRtl } = useLocale();

  const content = legalContent[locale][page === 'termos' ? 'termos' : 'privacidade'];

  return (
    <>
      <Stack.Screen options={{ title: content.title }} />
      <ScrollView contentContainerStyle={styles.content} style={{ backgroundColor: BrandColors.cream }}>
        <Text style={[styles.title, isRtl && styles.textRight]}>{content.title}</Text>
        <Text style={[styles.intro, isRtl && styles.textRight]}>{content.intro}</Text>

        {content.sections.map((section) => (
          <View key={section.heading} style={styles.section}>
            <Text style={[styles.sectionHeading, isRtl && styles.textRight]}>{section.heading}</Text>
            <Text style={[styles.sectionBody, isRtl && styles.textRight]}>{section.body}</Text>
          </View>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: BrandColors.ink,
  },
  intro: {
    fontSize: 14,
    color: BrandColors.inkSoft,
    lineHeight: 21,
    marginTop: 14,
  },
  section: {
    marginTop: 20,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: BrandColors.ink,
    marginBottom: 6,
  },
  sectionBody: {
    fontSize: 13.5,
    color: BrandColors.inkSoft,
    lineHeight: 20,
  },
  textRight: {
    textAlign: 'right',
  },
});
