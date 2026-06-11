// Trust is the product. A quiet, consistent reminder on key screens:
// no ads, no data selling, your information belongs to you.

import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText } from './ui';
import { useTheme } from '@/context/AppContext';

export function TrustStrip() {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing.sm,
        paddingVertical: theme.spacing.sm,
      }}
    >
      <AppText size="tiny" color={theme.colors.textMuted}>
        🔒
      </AppText>
      <AppText size="tiny" color={theme.colors.textMuted} center>
        {t('onboarding.trustLine')} · {t('onboarding.noAds')}
      </AppText>
    </View>
  );
}
