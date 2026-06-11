// Onboarding 5/5 — "Create My Anchor." Shows the personalized home base built
// from the user's intents and priorities, celebrates, and lands them home.

import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Button, Card, Pill } from '@/components/ui';
import { ConfettiCelebration } from '@/components/ConfettiCelebration';
import { TrustStrip } from '@/components/TrustStrip';
import { useApp, useTheme } from '@/context/AppContext';
import { nextBestStep } from '@/lib/engagement';
import { haptic } from '@/lib/haptics';

export default function CreateAnchorStep() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const { intents, priorities, completeOnboarding } = useApp();
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    haptic.celebrate();
    const timer = setTimeout(() => setCelebrate(true), 350);
    return () => clearTimeout(timer);
  }, []);

  const step = useMemo(
    () =>
      nextBestStep({
        intents,
        priorities,
        hasCheckedInToday: false,
        savedCount: 0,
        contactedCount: 0,
        documentCount: 0,
      }),
    [intents, priorities]
  );

  const finish = () => {
    completeOnboarding();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <View style={{ flex: 1, padding: theme.spacing.lg, justifyContent: 'space-between' }}>
        <View style={{ gap: theme.spacing.lg, marginTop: theme.spacing.xl }}>
          <AppText size="display" weight="heavy" color={theme.colors.primary}>
            ⚓ {t('onboarding.createTitle')}
          </AppText>
          <AppText size="body" color={theme.colors.textMuted}>
            {t('onboarding.createBody')}
          </AppText>

          {priorities.length > 0 && (
            <Card elevated fadeIndex={0}>
              <View style={{ gap: theme.spacing.sm }}>
                <AppText size="small" weight="bold" color={theme.colors.textMuted}>
                  {t('home.progressTitle').toUpperCase()}
                </AppText>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
                  {priorities.map((p) => (
                    <Pill key={p} label={t(`onboarding.priorities.${p}`)} tone="accent" />
                  ))}
                </View>
              </View>
            </Card>
          )}

          <Card fadeIndex={1} style={{ backgroundColor: theme.colors.accentSoft, borderColor: theme.colors.accentSoft }}>
            <View style={{ gap: theme.spacing.xs }}>
              <AppText size="small" weight="bold" color={theme.colors.primary}>
                {t('home.nextStepTitle').toUpperCase()}
              </AppText>
              <AppText size="body" color={theme.colors.text}>
                {t(step.labelKey)}
              </AppText>
            </View>
          </Card>
        </View>

        <View style={{ gap: theme.spacing.md }}>
          <Button title={t('onboarding.createCta')} onPress={finish} />
          <TrustStrip />
        </View>
      </View>
      <ConfettiCelebration visible={celebrate} />
    </SafeAreaView>
  );
}
