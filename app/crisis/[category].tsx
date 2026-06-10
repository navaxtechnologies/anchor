import React from 'react';
import { View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText, Button, ScreenContainer } from '@/components/ui';
import { Disclaimer } from '@/components/Disclaimer';
import { useTheme } from '@/context/AppContext';
import { getCrisisCategory } from '@/data/crisis';
import { dial } from '@/lib/actions';
import { track } from '@/services/analytics';
import type { CrisisAction } from '@/types';

export default function CrisisDetail() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const { category } = useLocalSearchParams<{ category: string }>();
  const data = category ? getCrisisCategory(category) : undefined;

  if (!data) {
    return (
      <ScreenContainer>
        <AppText size="body">{t('resources.none')}</AppText>
      </ScreenContainer>
    );
  }

  const runAction = (a: CrisisAction) => {
    track('crisis_action', { action: a.type, value: a.value });
    if (a.type === 'call' || a.type === 'text') {
      dial(a.value);
    } else if (a.type === 'route') {
      router.push(`/(tabs)/resources?category=${a.value}`);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: t(`crisis.categories.${data.key}.title`) }} />
      <ScreenContainer>
        {data.urgency === 'emergency' && (
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
        )}

        <AppText size="body" color={theme.colors.textMuted}>
          {t(`crisis.categories.${data.key}.blurb`)}
        </AppText>

        <AppText size="heading" weight="bold">
          {t('crisis.localRoutesTitle')}
        </AppText>

        <View style={{ gap: theme.spacing.sm }}>
          {data.actions.map((a, i) => (
            <Button
              key={`${a.type}-${a.value}-${i}`}
              title={t(a.labelKey)}
              variant={a.primary ? 'crisis' : a.type === 'route' ? 'secondary' : 'primary'}
              onPress={() => runAction(a)}
            />
          ))}
        </View>

        <Disclaimer text={t('crisis.disclaimer')} />
      </ScreenContainer>
    </>
  );
}
