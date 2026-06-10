import React, { useState } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText, Button, Card, Pill, ScreenContainer } from '@/components/ui';
import { useApp, useTheme } from '@/context/AppContext';
import { circles } from '@/data/circles';

export default function Circles() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { joinedCircleIds, toggleCircle, limits } = useApp();
  const [notice, setNotice] = useState<string | null>(null);

  const onToggle = (id: string) => {
    const joined = joinedCircleIds.includes(id);
    if (!joined && joinedCircleIds.length >= limits.maxCircles) {
      setNotice(t('circles.limitReached'));
      return;
    }
    setNotice(null);
    toggleCircle(id);
  };

  return (
    <>
      <Stack.Screen options={{ title: t('circles.title') }} />
      <ScreenContainer>
        <AppText size="small" color={theme.colors.textMuted}>
          {t('circles.subtitle')}
        </AppText>

        {/* Community guidelines are visible up front — safety by design. */}
        <Card style={{ backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border }}>
          <AppText size="small" weight="bold">
            {t('circles.guidelines')}
          </AppText>
          <AppText size="small" color={theme.colors.textMuted} style={{ marginTop: theme.spacing.xs }}>
            {t('circles.guidelinesBody')}
          </AppText>
        </Card>

        {notice && (
          <Card style={{ borderColor: theme.colors.warning }}>
            <AppText size="small" weight="medium" color={theme.colors.warning}>
              {notice}
            </AppText>
          </Card>
        )}

        <View style={{ gap: theme.spacing.md }}>
          {circles.map((c, i) => {
            const joined = joinedCircleIds.includes(c.id);
            return (
              <Card key={c.id} fadeIndex={i}>
                <View style={{ gap: theme.spacing.sm }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md }}>
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: theme.colors.lavenderSoft,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <AppText style={{ fontSize: 24, lineHeight: 32 }}>{c.emoji ?? '🫂'}</AppText>
                    </View>
                    <AppText size="heading" weight="bold" style={{ flex: 1 }}>
                      {c.name}
                    </AppText>
                    {c.isModerated && <Pill label={t('circles.moderated')} tone="lavender" />}
                  </View>
                  <AppText size="small" color={theme.colors.textMuted}>
                    {c.description}
                  </AppText>
                  <AppText size="tiny" color={theme.colors.textMuted}>
                    {t('circles.members', { count: c.memberCount })}
                  </AppText>
                  <Button
                    title={joined ? t('circles.joined') : t('circles.join')}
                    variant={joined ? 'ghost' : 'primary'}
                    onPress={() => onToggle(c.id)}
                  />
                </View>
              </Card>
            );
          })}
        </View>
      </ScreenContainer>
    </>
  );
}
