import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Card } from '@/components/ui';
import { useApp, useTheme } from '@/context/AppContext';
import type { Language } from '@/types';

const OPTIONS: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
];

export default function LanguageSelect() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const { language, setLanguage } = useApp();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <View style={{ flex: 1, padding: theme.spacing.lg, gap: theme.spacing.lg }}>
        <View style={{ gap: theme.spacing.sm, marginTop: theme.spacing.lg }}>
          <AppText size="title" weight="bold">
            {t('onboarding.chooseLanguage')}
          </AppText>
          <AppText size="body" color={theme.colors.textMuted}>
            {t('onboarding.languageSubtitle')}
          </AppText>
        </View>

        <View style={{ gap: theme.spacing.md }}>
          {OPTIONS.map((opt) => {
            const selected = language === opt.code;
            return (
              <Card
                key={opt.code}
                onPress={() => {
                  setLanguage(opt.code);
                  router.push('/onboarding/simple-mode');
                }}
                accessibilityLabel={opt.label}
                style={{
                  borderColor: selected ? theme.colors.accent : theme.colors.border,
                  borderWidth: selected ? 2 : 1,
                }}
              >
                <AppText size="heading" weight="bold">
                  {opt.label}
                </AppText>
              </Card>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}
