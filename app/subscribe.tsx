import React, { useState } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText, Button, Card, Pill, ScreenContainer } from '@/components/ui';
import { useApp, useTheme } from '@/context/AppContext';
import { PLAN_PRICING, restorePurchases, startCheckout } from '@/services/stripe';
import { track } from '@/services/analytics';
import type { Tier } from '@/types';

const ORDER: Tier[] = ['free', 'plus', 'pro', 'community'];

function priceLabel(tier: Tier, perMonth: string, perYear: string): string {
  const p = PLAN_PRICING[tier];
  if (p.monthly === 0) return '';
  const monthly = `$${p.monthly.toFixed(2)}${perMonth}`;
  return p.yearly ? `${monthly}  ·  $${p.yearly.toFixed(2)}${perYear}` : monthly;
}

export default function Subscribe() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { tier, setTier } = useApp();
  const [busy, setBusy] = useState<Tier | null>(null);

  React.useEffect(() => {
    track('paywall_viewed');
  }, []);

  const choose = async (target: Tier) => {
    if (target === tier) return;
    setBusy(target);
    if (target === 'free') {
      setTier('free');
    } else {
      const res = await startCheckout(target);
      if (res.ok) setTier(res.tier);
    }
    setBusy(null);
  };

  const onRestore = async () => {
    const restored = await restorePurchases();
    setTier(restored);
  };

  return (
    <>
      <Stack.Screen options={{ title: t('subscribe.title') }} />
      <ScreenContainer>
        <AppText size="body" color={theme.colors.textMuted}>
          {t('subscribe.subtitle')}
        </AppText>

        <Card style={{ backgroundColor: theme.colors.crisisSoft, borderColor: theme.colors.crisisSoft }}>
          <AppText size="small" weight="bold" color={theme.colors.crisis}>
            {t('subscribe.crisisAlwaysFree')}
          </AppText>
        </Card>

        <View style={{ gap: theme.spacing.md }}>
          {ORDER.map((tk) => {
            const current = tier === tk;
            const price = priceLabel(tk, t('subscribe.perMonth'), t('subscribe.perYear'));
            return (
              <Card
                key={tk}
                style={{
                  borderColor: current ? theme.colors.accent : theme.colors.border,
                  borderWidth: current ? 2 : 1,
                }}
              >
                <View style={{ gap: theme.spacing.sm }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <AppText size="heading" weight="bold">
                      {t(`subscribe.tiers.${tk}.name`)}
                    </AppText>
                    {current && <Pill label={t('subscribe.currentPlan')} tone="accent" />}
                  </View>
                  <AppText size="small" color={theme.colors.textMuted}>
                    {t(`subscribe.tiers.${tk}.tagline`)}
                  </AppText>
                  {price ? (
                    <AppText size="body" weight="bold" color={theme.colors.primary}>
                      {price}
                    </AppText>
                  ) : (
                    <AppText size="body" weight="bold" color={theme.colors.success}>
                      {t('common.free')}
                    </AppText>
                  )}
                  {!current && (
                    <Button
                      title={t('subscribe.choose')}
                      loading={busy === tk}
                      onPress={() => choose(tk)}
                    />
                  )}
                </View>
              </Card>
            );
          })}
        </View>

        <AppText size="small" color={theme.colors.textMuted} center>
          {t('subscribe.noPressure')}
        </AppText>

        <Button title={t('subscribe.restore')} variant="ghost" onPress={onRestore} />
      </ScreenContainer>
    </>
  );
}
