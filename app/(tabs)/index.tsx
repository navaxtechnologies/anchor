import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText, Button, Card, ScreenContainer } from '@/components/ui';
import { ResourceCard } from '@/components/ResourceCard';
import { MoodSelector } from '@/components/MoodSelector';
import { ConfettiCelebration } from '@/components/ConfettiCelebration';
import { Toast } from '@/components/Toast';
import { useApp, useTheme } from '@/context/AppContext';
import { getResource } from '@/data/resources';
import { haptic } from '@/lib/haptics';
import type { CheckIn } from '@/types';

function greetingKey(): string {
  const h = new Date().getHours();
  if (h < 5) return 'home.greetingNight';
  if (h < 12) return 'home.greetingMorning';
  if (h < 18) return 'home.greetingAfternoon';
  if (h < 23) return 'home.greetingEvening';
  return 'home.greetingNight';
}

function greetingEmoji(): string {
  const h = new Date().getHours();
  if (h < 5 || h >= 23) return '🌙';
  if (h < 12) return '☀️';
  if (h < 18) return '🌤️';
  return '🌙';
}

function CheckInCard({ onCelebrate }: { onCelebrate: () => void }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const { todaysCheckIn, submitCheckIn } = useApp();

  const submit = (mood: CheckIn['mood']) => {
    const isFirstToday = !todaysCheckIn;
    submitCheckIn(mood);
    if (isFirstToday) {
      haptic.success();
      onCelebrate();
    }
  };

  return (
    <Card fadeIndex={0} elevated>
      <View style={{ gap: theme.spacing.sm }}>
        <AppText size="heading" weight="bold">
          {t('home.todayTitle')}
        </AppText>
        {todaysCheckIn ? (
          <AppText size="body" color={theme.colors.success}>
            ✓ {t('home.checkInDone')} · {t(`home.moods.${todaysCheckIn.mood}`)}
          </AppText>
        ) : (
          <>
            <AppText size="small" color={theme.colors.textMuted}>
              {t('home.checkInPrompt')}
            </AppText>
            <MoodSelector selected={null} onSelect={submit} />
          </>
        )}
      </View>
    </Card>
  );
}

function QuickTile({
  glyph,
  label,
  fadeIndex,
  onPress,
}: {
  glyph: string;
  label: string;
  fadeIndex: number;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <View style={{ flex: 1 }}>
      <Card onPress={onPress} accessibilityLabel={label} fadeIndex={fadeIndex}>
        <View style={{ alignItems: 'center', gap: theme.spacing.sm, paddingVertical: theme.spacing.xs }}>
          <AppText style={{ fontSize: theme.simpleMode ? 38 : 32, lineHeight: theme.simpleMode ? 46 : 40 }}>
            {glyph}
          </AppText>
          <AppText size="small" weight="medium" center numberOfLines={1}>
            {label}
          </AppText>
        </View>
      </Card>
    </View>
  );
}

export default function Home() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const { savedResourceIds } = useApp();
  const [celebrate, setCelebrate] = useState(false);

  const saved = savedResourceIds.map(getResource).filter((r): r is NonNullable<typeof r> => !!r);

  const onCelebrate = () => {
    setCelebrate(false);
    requestAnimationFrame(() => setCelebrate(true));
  };

  return (
    <>
      <ScreenContainer>
        <AppText size="title" weight="heavy">
          {greetingEmoji()} {t(greetingKey())}
        </AppText>

        <CheckInCard onCelebrate={onCelebrate} />

        {/* Quick actions — 2x2, warm emoji tiles. */}
        <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
          <QuickTile
            glyph="🧭"
            label={t('home.quickHelp')}
            fadeIndex={1}
            onPress={() => router.push('/(tabs)/resources')}
          />
          <QuickTile
            glyph="💬"
            label={t('home.askAdvisor')}
            fadeIndex={2}
            onPress={() => router.push('/(tabs)/advisor')}
          />
        </View>
        <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
          <QuickTile
            glyph="🫂"
            label={t('more.circles')}
            fadeIndex={3}
            onPress={() => router.push('/circles')}
          />
          <QuickTile
            glyph="🔒"
            label={t('vault.title')}
            fadeIndex={4}
            onPress={() => router.push('/(tabs)/vault')}
          />
        </View>

        <AppText size="heading" weight="bold">
          {t('home.savedResources')}
        </AppText>
        {saved.length === 0 ? (
          <Card
            fadeIndex={5}
            style={{
              borderStyle: 'dashed',
              borderColor: theme.colors.primarySoft,
              backgroundColor: theme.colors.surfaceAlt,
            }}
          >
            <AppText size="body" color={theme.colors.textMuted}>
              🌱 {t('home.noSaved')}
            </AppText>
          </Card>
        ) : (
          <View style={{ gap: theme.spacing.md }}>
            {saved.map((r) => (
              <ResourceCard key={r.id} resource={r} />
            ))}
          </View>
        )}
      </ScreenContainer>

      <ConfettiCelebration visible={celebrate} />
      <Toast message={t('home.checkInToast')} tone="success" visible={celebrate} />
    </>
  );
}
