import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { registerPushToken } from '@/api/client';
import { useLocale } from '@/i18n/LocaleProvider';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Registers this device for push notifications about new/featured
 * events, IF notification permission has already been granted (i.e.
 * the user opted in via Settings). This hook never itself prompts for
 * permission — see requestNotificationPermission() for the explicit
 * opt-in flow triggered from the Settings screen.
 */
export function usePushNotifications() {
  const { locale, ready } = useLocale();

  useEffect(() => {
    if (!ready) return;

    let cancelled = false;
    (async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted' || cancelled) return;
      const token = await getExpoPushToken();
      if (token && !cancelled) {
        await registerPushToken(token, Platform.OS === 'ios' ? 'IOS' : 'ANDROID', locale);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [ready, locale]);
}

async function getExpoPushToken(): Promise<string | null> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  if (!projectId) return null;

  try {
    const { data } = await Notifications.getExpoPushTokenAsync({ projectId });
    return data;
  } catch {
    return null;
  }
}

/**
 * Explicit opt-in flow, called from a user action (a switch in
 * Settings). Requests permission if not already decided, and registers
 * the token immediately on success.
 */
export async function requestNotificationPermission(
  locale: string
): Promise<'granted' | 'denied'> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  let status = existing;
  if (existing !== 'granted') {
    const result = await Notifications.requestPermissionsAsync();
    status = result.status;
  }

  if (status !== 'granted') return 'denied';

  const token = await getExpoPushToken();
  if (token) {
    await registerPushToken(token, Platform.OS === 'ios' ? 'IOS' : 'ANDROID', locale);
  }
  return 'granted';
}
