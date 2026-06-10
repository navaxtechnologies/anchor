import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText, Card, ScreenContainer } from '@/components/ui';
import { useApp, useTheme } from '@/context/AppContext';

export default function More() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const { tier } = useApp();

  const Row = ({ label, glyph, onPress }: { label: string; glyph: string; onPress: () => void }) => (
    <Card onPress={onPress} accessibilityLabel={label}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md }}>
        <AppText style={{ fontSize: 26 }}>{glyph}</AppText>
        <AppText size="heading" weight="medium">
          {label}
        </AppText>
      </View>
    </Card>
  );

  return (
    <ScreenContainer>
      <Row label={t('more.circles')} glyph="🫂" onPress={() => router.push('/circles')} />
      <Row label={`${t('more.subscribe')} · ${tier.toUpperCase()}`} glyph="✨" onPress={() => router.push('/subscribe')} />
      <Row label={t('more.settings')} glyph="⚙️" onPress={() => router.push('/settings')} />
    </ScreenContainer>
  );
}
