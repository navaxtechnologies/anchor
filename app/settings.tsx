import React from 'react';
import { Switch, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText, Button, Card, Divider, ScreenContainer } from '@/components/ui';
import { Disclaimer } from '@/components/Disclaimer';
import { useApp, useTheme } from '@/context/AppContext';
import type { Language } from '@/types';

function Toggle({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  const theme = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.md }}>
      <View style={{ flex: 1 }}>
        <AppText size="body" weight="medium">
          {label}
        </AppText>
        {hint && (
          <AppText size="small" color={theme.colors.textMuted}>
            {hint}
          </AppText>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ true: theme.colors.accent, false: theme.colors.border }}
      />
    </View>
  );
}

export default function Settings() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const {
    language,
    setLanguage,
    simpleMode,
    setSimpleMode,
    rememberContext,
    setRememberContext,
    analyticsEnabled,
    setAnalyticsEnabledPref,
    deleteAllData,
  } = useApp();

  const otherLang: Language = language === 'en' ? 'es' : 'en';

  return (
    <>
      <Stack.Screen options={{ title: t('settings.title') }} />
      <ScreenContainer>
        <Card>
          <View style={{ gap: theme.spacing.md }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <AppText size="body" weight="medium">
                {t('settings.language')}
              </AppText>
              <Button
                title={language === 'en' ? 'Español' : 'English'}
                variant="secondary"
                fullWidth={false}
                onPress={() => setLanguage(otherLang)}
              />
            </View>
            <Divider />
            <Toggle
              label={t('settings.simpleMode')}
              hint={t('settings.simpleModeHint')}
              value={simpleMode}
              onChange={setSimpleMode}
            />
            <Divider />
            <Toggle
              label={t('settings.rememberContext')}
              hint={t('settings.rememberContextHint')}
              value={rememberContext}
              onChange={setRememberContext}
            />
            <Divider />
            <Toggle
              label={t('settings.analytics')}
              hint={t('settings.analyticsHint')}
              value={analyticsEnabled}
              onChange={setAnalyticsEnabledPref}
            />
          </View>
        </Card>

        <AppText size="heading" weight="bold">
          {t('settings.privacyTitle')}
        </AppText>
        <Disclaimer text={t('settings.privacyBody')} />

        <Button
          title={t('settings.deleteData')}
          variant="crisis"
          onPress={async () => {
            await deleteAllData();
            router.replace('/onboarding/welcome');
          }}
        />
      </ScreenContainer>
    </>
  );
}
