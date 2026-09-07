import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { BrandColors } from '@/constants/theme';
import { LocaleProvider, useLocale } from '@/i18n/LocaleProvider';
import { usePushNotifications } from '@/hooks/use-push-notifications';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <LocaleProvider>
        <AppShell />
      </LocaleProvider>
    </SafeAreaProvider>
  );
}

function AppShell() {
  const { ready } = useLocale();
  usePushNotifications();

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync();
    }
  }, [ready]);

  if (!ready) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="event/[slug]"
        options={{
          headerShown: true,
          headerTitle: '',
          headerTransparent: true,
          headerTintColor: '#fff',
          headerBackButtonDisplayMode: 'minimal',
        }}
      />
      <Stack.Screen
        name="legal/[page]"
        options={{
          headerShown: true,
          headerTintColor: BrandColors.ink,
        }}
      />
    </Stack>
  );
}
