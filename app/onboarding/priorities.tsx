// Onboarding 4/5 — life priorities. Up to three; these become the user's goals
// and feed Next Best Step + Life Score.

import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Button, Card } from '@/components/ui';
import { TrustStrip } from '@/components/TrustStrip';
import { useApp, useTheme } from '@/context/AppContext';
import { haptic } from '@/lib/haptics';
import type { PriorityKey } from '@/types';

const MAX = 3;

const PRIORITIES: { key: PriorityKey; emoji: string }[] = [
  { key: 'reduce_debt', emoji: '📉' },
  { key: 'find_assistance', emoji: '🤝' },
  { key: 'mental_health', emoji: '💚' },
  { key: 'organize_documents', emoji: '🗂️' },
  { key: 'build_stability', emoji: '🧱' },
  { key: 'start_business', emoji: '🚀' },
];

export default function PrioritiesStep() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const { setPriorities } = useApp();
  const [selected, setSelected] = useState<PriorityKey[]>([]);

  const toggle = (key: PriorityKey) => {
    haptic.selection();
    setSelected((s) => {
      if (s.includes(key)) return s.filter((k) => k !== key);
      if (s.length >= MAX) return s; // gentle cap — no error screens
      return [...s, key];
    });
  };

  const next = () => {
    setPriorities(selected);
    router.push('/onboarding/create');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <View style={{ flex: 1, padding: theme.spacing.lg, gap: theme.spacing.md }}>
        <View style={{ gap: theme.spacing.sm, marginTop: theme.spacing.lg }}>
          <AppText size="title" weight="heavy">
            {t('onboarding.prioritiesTitle')}
          </AppText>
          <AppText size="body" color={theme.colors.textMuted}>
            {t('onboarding.prioritiesSubtitle')}
          </AppText>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ gap: theme.spacing.sm, paddingBottom: theme.spacing.sm }}
          showsVerticalScrollIndicator={false}
        >
          {PRIORITIES.map(({ key, emoji }, i) => {
            const on = selected.includes(key);
            const capped = !on && selected.length >= MAX;
            return (
              <Card
                key={key}
                fadeIndex={i}
                onPress={() => toggle(key)}
                accessibilityLabel={t(`onboarding.priorities.${key}`)}
                style={{
                  paddingVertical: theme.spacing.sm + 4,
                  opacity: capped ? 0.5 : 1,
                  borderColor: on ? theme.colors.primarySoft : theme.colors.border,
                  borderWidth: on ? 2 : 1,
                  backgroundColor: on ? theme.colors.accentSoft : theme.colors.surface,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md }}>
                  <AppText style={{ fontSize: 24, lineHeight: 32 }}>{emoji}</AppText>
                  <AppText size="body" weight="medium" style={{ flex: 1 }}>
                    {t(`onboarding.priorities.${key}`)}
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
