// Onboarding 3/5 — accessibility options. Replaces the old single Simple Mode
// step: Simple Mode (large text + fewer steps), high contrast, dyslexia-friendly.
// Everything previews live because toggles write straight to the theme.

import React from 'react';
import { Switch, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Button, Card } from '@/components/ui';
import { TrustStrip } from '@/components/TrustStrip';
import { useApp, useTheme } from '@/context/AppContext';

function Row({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  const theme = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: theme.spacing.md,
      }}
    >
      <View style={{ flex: 1 }}>
        <AppText size="body" weight="medium">
          {label}
        </AppText>
        <AppText size="small" color={theme.colors.textMuted}>
          {hint}
        </AppText>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ true: theme.colors.primarySoft, false: theme.colors.border }}
      />
    </View>
  );
}

export default function AccessibilityStep() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const {
    simpleMode,
    setSimpleMode,
    highContrast,
    setHighContrast,
    dyslexiaMode,
    setDyslexiaMode,
  } = useApp();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <View style={{ flex: 1, padding: theme.spacing.lg, gap: theme.spacing.lg }}>
        <View style={{ gap: theme.spacing.sm, marginTop: theme.spacing.lg }}>
          <AppText size="title" weight="heavy">
            {t('onboarding.accessibilityTitle')}
          </AppText>
          <AppText size="body" color={theme.colors.textMuted}>
            {t('onboarding.accessibilitySubtitle')}
          </AppText>
        </View>

        <Card>
          <View style={{ gap: theme.spacing.lg }}>
            <Row
              label={t('settings.simpleMode')}
              hint={t('settings.simpleModeHint')}
              value={simpleMode}
              onChange={setSimpleMode}
            />
            <Row
              label={t('settings.highContrast')}
              hint={t('settings.highContrastHint')}
              value={highContrast}
              onChange={setHighContrast}
            />
            <Row
              label={t('settings.dyslexia')}
              hint={t('settings.dyslexiaHint')}
              value={dyslexiaMode}
              onChange={setDyslexiaMode}
            />
          </View>
        </Card>

        <View style={{ flex: 1 }} />
        <Button title={t('common.continue')} onPress={() => router.push('/onboarding/priorities')} />
        <TrustStrip />
      </View>
    </SafeAreaView>
  );
}
