import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { API_BASE_URL } from '@/constants/config';
import { BrandColors } from '@/constants/theme';
import { requestNotificationPermission } from '@/hooks/use-push-notifications';
import { useLocale, useT } from '@/i18n/LocaleProvider';
import { localeFlags, localeNames, locales, type Locale } from '@/i18n/translations';

export default function SettingsScreen() {
  const t = useT();
  const { locale, setLocale, isRtl } = useLocale();
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    Notifications.getPermissionsAsync().then(({ status }) => {
      setNotificationsEnabled(status === 'granted');
    });
  }, []);

  async function handleToggleNotifications(value: boolean) {
    if (!value) {
      // We can't programmatically revoke OS permission; guide the user
      // to system settings if they want to fully disable it there too.
      setNotificationsEnabled(false);
      return;
    }
    const result = await requestNotificationPermission(locale);
    if (result === 'denied') {
      Linking.openSettings();
      return;
    }
    setNotificationsEnabled(true);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, isRtl && styles.textRight]}>{t('settings.title')}</Text>

        <Section title={t('settings.language')} isRtl={isRtl}>
          {locales.map((loc) => (
            <Pressable
              key={loc}
              style={[styles.row, isRtl && styles.rowReverse]}
              onPress={() => setLocale(loc as Locale)}>
              <Text style={styles.rowLabel}>
                {localeFlags[loc]}  {localeNames[loc]}
              </Text>
              {locale === loc && <Text style={styles.checkmark}>✓</Text>}
            </Pressable>
          ))}
        </Section>

        <Section title={t('settings.notifications')} isRtl={isRtl}>
          <View style={[styles.row, isRtl && styles.rowReverse]}>
            <View style={styles.notificationText}>
              <Text style={styles.rowLabel}>{t('settings.notifications')}</Text>
              <Text style={styles.rowSubtitle}>{t('settings.notificationsSubtitle')}</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ true: BrandColors.accent }}
            />
          </View>
        </Section>

        <Section title={t('settings.about')} isRtl={isRtl}>
          <Pressable
            style={[styles.row, isRtl && styles.rowReverse]}
            onPress={() => WebBrowser.openBrowserAsync(API_BASE_URL)}>
            <Text style={styles.rowLabel}>{t('settings.visitWebsite')}</Text>
          </Pressable>
          <Pressable
            style={[styles.row, isRtl && styles.rowReverse]}
            onPress={() => router.push('/legal/privacidade')}>
            <Text style={styles.rowLabel}>{t('settings.privacyPolicy')}</Text>
          </Pressable>
          <Pressable
            style={[styles.row, isRtl && styles.rowReverse]}
            onPress={() => router.push('/legal/termos')}>
            <Text style={styles.rowLabel}>{t('settings.termsConditions')}</Text>
          </Pressable>
          <View style={[styles.row, isRtl && styles.rowReverse]}>
            <Text style={styles.rowSubtitle}>{t('settings.version')}</Text>
            <Text style={styles.rowSubtitle}>1.0.0</Text>
          </View>
        </Section>
      </ScrollView>
    </SafeAreaView>
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
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BrandColors.cream,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: BrandColors.ink,
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: BrandColors.inkSoft,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 8,
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(23,19,16,0.06)',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: BrandColors.ink,
  },
  rowSubtitle: {
    fontSize: 12.5,
    color: BrandColors.inkSoft,
    marginTop: 2,
  },
  notificationText: {
    flex: 1,
  },
  checkmark: {
    color: BrandColors.accent,
    fontWeight: '700',
    fontSize: 16,
  },
  textRight: {
    textAlign: 'right',
  },
});
