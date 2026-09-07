# Braga Event — Mobile App

Native iOS/Android companion app for [Braga Event](../README.md), built with
Expo (React Native + TypeScript + Expo Router). It consumes the same
PostgreSQL backend as the website through a public read-only JSON API
(`/api/v1/*` on the Next.js app) — no separate backend, no duplicated data.

## Why a real native app instead of a WebView wrapper

Both Apple and Google reject apps that are just a website wrapped in a
WebView with no native functionality (Apple's Guideline 4.2 — "Minimum
Functionality"). This app has real native navigation, screens, calendar
integration, and push notifications, all built with React Native
components — not an embedded browser.

## Features

- Native tab navigation: Home, Events, Categories, Settings
- Event list with filters (date, category, free), search, pull-to-refresh
- Event detail: native share, add-to-device-calendar, open in Maps
- Portuguese / English / Arabic, with full RTL layout for Arabic
- Push notifications (opt-in) for new/featured events
- Privacy Policy / Terms & Conditions screens

## Getting started

```bash
npm install
npx expo start
```

Then press `a` for Android emulator, `i` for iOS simulator (macOS only),
or scan the QR code with Expo Go on a physical device.

### Pointing at a different backend

By default the app talks to the production site
(`src/constants/config.ts`). For local development against a Next.js dev
server on your machine, create a `.env` file in this folder:

```bash
EXPO_PUBLIC_API_URL="http://192.168.1.x:3000"
```

(Use your machine's LAN IP, not `localhost` — a physical device or
emulator can't reach your computer's `localhost`.)

## Project structure

```
src/
  app/
    (tabs)/            Tab screens: index (home), events, categories, settings
    event/[slug].tsx   Event detail (pushed above the tabs)
    legal/[page].tsx   Privacy Policy / Terms & Conditions
    _layout.tsx        Root stack + locale provider + push notification setup
  api/
    client.ts          Fetch wrappers for /api/v1/*
    types.ts           Response shapes (mirrors the backend's serializers)
  i18n/
    translations.ts    pt/en/ar strings, organized by screen
    legal.ts           Privacy/Terms content per locale
    LocaleProvider.tsx  Locale state, persistence, RTL flag (no OS-level
                        RTL flip — screens read `isRtl` and mirror
                        layout/text manually, same approach as the web app)
  components/
    EventCard.tsx, ui/  Shared UI
  hooks/
    use-fetch.ts               Loading/error/refresh wrapper around fetch
    use-push-notifications.ts  Expo push token registration
    use-rtl-style.ts           Small RTL style helpers
  lib/
    format.ts           Locale-aware date/price formatting
    addToCalendar.ts     Adds an event to the device calendar
```

## Building for the App Store / Play Store

This project is not yet configured for store submission. To get there:

1. Create a free [Expo account](https://expo.dev/signup) and run
   `npx eas login`, then `npx eas init` to link this project (sets the
   `projectId` used by push notifications).
2. Install [EAS CLI](https://docs.expo.dev/eas/) and configure build
   profiles with `npx eas build:configure`.
3. Build: `npx eas build --platform ios` / `--platform android`.
4. Submit: `npx eas submit --platform ios` / `--platform android`.

You'll need:

- An [Apple Developer account](https://developer.apple.com/programs/) —
  $99/year — to submit to the App Store.
- A [Google Play Developer account](https://play.google.com/console/signup)
  — $25 one-time — to submit to the Play Store.

Before submitting, replace the placeholder icons/splash screen in
`assets/images/` with final branded assets, and review both stores'
screenshots/metadata requirements.
