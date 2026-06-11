// Onboarding 2/5 — "What brings you here today?" Multi-select; shapes the
// dashboard, Next Best Step, and suggested circles.

import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Button, Card } from '@/components/ui';
import { TrustStrip } from '@/components/TrustStrip';
import { useApp, useTheme } from '@/context/AppContext';
import { haptic } from '@/lib/haptics';
import type { IntentKey } from '@/types';

const INTENTS: { key: IntentKey; emoji: string }[] = [
  { key: 'money', emoji: '💸' },
  { key: 'health', emoji: '🩺' },
  { key: 'housing', emoji: '🏠' },
  { key: 'family', emoji: '🧡' },
  { key: 'career', emoji: '💼' },
  { key: 'community', emoji: '🫂' },
  { key: 'organizing', emoji: '🗂️' },
];

export default function IntentStep() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const { setIntents } = useApp();
  const [selected, setSelected] = useState<IntentKey[]>([]);

  const toggle = (key: IntentKey) => {
    haptic.selection();
    setSelected((s) => (s.includes(key) ? s.filter((k) => k !== key) : [...s, key]));
  };

  const next = () => {
    setIntents(selected);
    router.push('/onboarding/accessibility');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <View style={{ flex: 1, padding: theme.spacing.lg, gap: theme.spacing.md }}>
        <View style={{ gap: theme.spacing.sm, marginTop: theme.spacing.lg }}>
          <AppText size="title" weight="heavy">
            {t('onboarding.intentTitle')}
          </AppText>
          <AppText size="body" color={theme.colors.textMuted}>
            {t('onboarding.intentSubtitle')}
          </AppText>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ gap: theme.spacing.sm, paddingBottom: theme.spacing.sm }}
          showsVerticalScrollIndicator={false}
        >
          {INTENTS.map(({ key, emoji }, i) => {
            const on = selected.includes(key);
            return (
              <Card
                key={key}
                fadeIndex={i}
                onPress={() => toggle(key)}
                accessibilityLabel={t(`onboarding.intents.${key}`)}
                style={{
                  paddingVertical: theme.spacing.sm + 4,
                  borderColor: on ? theme.colors.primarySoft : theme.colors.border,
                  borderWidth: on ? 2 : 1,
                  backgroundColor: on ? theme.colors.accentSoft : theme.colors.surface,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md }}>
                  <AppText style={{ fontSize: 24, lineHeight: 32 }}>{emoji}</AppText>
                  <AppText size="body" weight="medium" style={{ flex: 1 }}>
                    {t(`onboarding.intents.${key}`)}
                  </AppText>
                  {on && (
                    <AppText size="body" weight="bold" color={theme.colors.primary}>
                      ✓
                    </AppText>
                  )}
                </View>
              </Card>
            );
          })}
        </ScrollView>

        <Button title={t('common.continue')} onPress={next} />
        <TrustStrip />
      </View>
    </SafeAreaView>
  );
}
