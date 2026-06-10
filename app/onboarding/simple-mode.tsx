import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Button } from '@/components/ui';
import { useApp, useTheme } from '@/context/AppContext';

export default function SimpleModeStep() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const { setSimpleMode, completeOnboarding } = useApp();

  const finish = (simple: boolean) => {
    setSimpleMode(simple);
    completeOnboarding();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <View style={{ flex: 1, padding: theme.spacing.lg, justifyContent: 'space-between' }}>
        <View style={{ gap: theme.spacing.md, marginTop: theme.spacing.lg }}>
          <AppText size="title" weight="bold">
            {t('onboarding.simpleModeTitle')}
          </AppText>
          <AppText size="body" color={theme.colors.textMuted}>
            {t('onboarding.simpleModeBody')}
          </AppText>
        </View>
        <View style={{ gap: theme.spacing.md }}>
          <Button title={t('onboarding.simpleModeOn')} onPress={() => finish(true)} />
          <Button title={t('onboarding.simpleModeOff')} variant="ghost" onPress={() => finish(false)} />
        </View>
      </View>
    </SafeAreaView>
  );
}
