import React from 'react';
import { View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText, Button, Card, ScreenContainer } from '@/components/ui';
import { Disclaimer } from '@/components/Disclaimer';
import { useTheme } from '@/context/AppContext';
import { crisisCategories } from '@/data/crisis';
import { dial } from '@/lib/actions';
import { track } from '@/services/analytics';

// Warm, human emoji per situation — care, not alarm.
const CRISIS_EMOJI: Record<string, string> = {
  mental_health: '💙',
  domestic_violence: '🛟',
  medical: '🚑',
  housing: '🏠',
  food: '🍲',
  legal: '⚖️',
  substance: '🤝',
};

export default function CrisisHome() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();

  // The warmth of care, not alarm. Dark mode keeps its own calm surface.
  const bg = theme.scheme === 'dark' ? theme.colors.bg : '#FFF6F4';

  return (
    <>
      <Stack.Screen options={{ title: t('crisis.title') }} />
      <ScreenContainer backgroundColor={bg}>
        {/* Warm, human headline first. */}
        <AppText size="title" weight="heavy" color={theme.colors.crisis}>
          {t('crisis.notAlone')}
        </AppText>
        <AppText size="body" color={theme.colors.textMuted}>
          {t('crisis.subtitle')}
        </AppText>

        {/* Emergency banner + one-tap lifelines — prominence is non-negotiable. */}
        <View
          style={{
            backgroundColor: theme.colors.crisisSoft,
            borderRadius: theme.radius.md,
            padding: theme.spacing.md,
            borderLeftWidth: 4,
            borderLeftColor: theme.colors.emergency,
          }}
          accessibilityRole="alert"
        >
          <AppText size="body" weight="bold" color={theme.colors.emergency}>
            {t('crisis.emergencyBanner')}
          </AppText>
        </View>

        <View style={{ gap: theme.spacing.sm }}>
          <Button
            title={t('crisis.call911')}
            variant="emergency"
            onPress={() => {
              track('crisis_action', { action: 'call', value: '911' });
              dial('911');
            }}
          />
          <Button
            title={t('crisis.call988')}
            variant="crisis"
            onPress={() => {
              track('crisis_action', { action: 'call', value: '988' });
              dial('988');
            }}
          />
        </View>

        <AppText size="heading" weight="bold">
          {t('crisis.chooseSituation')}
        </AppText>

        <View style={{ gap: theme.spacing.sm }}>
          {crisisCategories.map((c, i) => (
            <Card
              key={c.id}
              fadeIndex={i}
              onPress={() => router.push(`/crisis/${c.key}`)}
              accessibilityLabel={t(`crisis.categories.${c.key}.title`)}
              style={{ borderLeftWidth: 4, borderLeftColor: theme.colors.crisis }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md }}>
                <AppText style={{ fontSize: theme.simpleMode ? 34 : 28, lineHeight: theme.simpleMode ? 42 : 36 }}>
                  {CRISIS_EMOJI[c.key] ?? '💙'}
                </AppText>
                <View style={{ flex: 1, gap: 2 }}>
                  <AppText size="heading" weight="bold">
                    {t(`crisis.categories.${c.key}.title`)}
                  </AppText>
                  <AppText size="small" color={theme.colors.textMuted}>
                    {t(`crisis.categories.${c.key}.blurb`)}
                  </AppText>
                </View>
              </View>
            </Card>
          ))}
        </View>

        <Card style={{ backgroundColor: theme.colors.accentSoft, borderColor: theme.colors.accentSoft }}>
          <AppText size="body" color={theme.colors.primary}>
            {t('crisis.reassurance')}
          </AppText>
        </Card>

        <AppText size="small" color={theme.colors.textMuted}>
          {t('crisis.advisorNote')}
        </AppText>

        <Disclaimer text={t('crisis.disclaimer')} />
      </ScreenContainer>
    </>
  );
}
