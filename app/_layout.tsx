import 'react-native-gesture-handler';
import React from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { AppProvider, useApp } from '@/context/AppContext';
import { initI18n } from '@/i18n';

// Initialize i18n at module load so useTranslation is ready on first render.
initI18n();

function RootStack() {
  const { ready, theme } = useApp();

  // Hold rendering until persisted state (language, simple mode) is loaded.
  if (!ready) {
    return <View style={{ flex: 1, backgroundColor: theme.colors.bg }} />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTintColor: theme.scheme === 'dark' ? theme.colors.textInverse : '#FFFFFF',
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: theme.colors.bg },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/welcome" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/language" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/intent" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/accessibility" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/priorities" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/create" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="crisis/index" options={{ presentation: 'modal' }} />
      <Stack.Screen name="crisis/[category]" />
      <Stack.Screen name="resource/[id]" />
      <Stack.Screen name="circles" />
      <Stack.Screen name="subscribe" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="legal/[doc]" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <StatusBar style="light" />
          <RootStack />
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
