import React, { useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Button, Card } from '@/components/ui';
import { ResourceCard } from '@/components/ResourceCard';
import { MoodSelector } from '@/components/MoodSelector';
import { ConfettiCelebration } from '@/components/ConfettiCelebration';
import { Toast } from '@/components/Toast';
import { useApp, useTheme } from '@/context/AppContext';
import { getResource } from '@/data/resources';
import { listDocuments } from '@/services/vault';
import { lifeScore, nextBestStep, todaysQuestionIndex } from '@/lib/engagement';
import { haptic } from '@/lib/haptics';
import type { CheckIn } from '@/types';

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function greetingKey(): string {
  const h = new Date().getHours();
  if (h < 5 || h >= 23) return 'home.greetingNight';
  if (h < 12) return 'home.greetingMorning';
  if (h < 18) return 'home.greetingAfternoon';
  return 'home.greetingEvening';
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
  const { todaysCheckIn, submitCheckIn, logWin } = useApp();

  const submit = (mood: CheckIn['mood']) => {
    const isFirstToday = !todaysCheckIn;
    submitCheckIn(mood);
    logWin('wins.checkIn');
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

function NextStepCard({ documentCount }: { documentCount: number }) {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const { intents, priorities, todaysCheckIn, savedResourceIds, contactedResourceIds } = useApp();

  const step = useMemo(
    () =>
      nextBestStep({
        intents,
        priorities,
        hasCheckedInToday: !!todaysCheckIn,
        savedCount: savedResourceIds.length,
        contactedCount: contactedResourceIds.length,
        documentCount,
      }),
    [intents, priorities, todaysCheckIn, savedResourceIds, contactedResourceIds, documentCount]
  );

  return (
    <Card
      fadeIndex={1}
      onPress={() => router.push(step.route as never)}
      accessibilityLabel={t(step.labelKey)}
      style={{ backgroundColor: theme.colors.accentSoft, borderColor: theme.colors.accentSoft }}
    >
      <View style={{ gap: theme.spacing.xs }}>
        <AppText size="small" weight="bold" color={theme.colors.primary}>
          ⭐ {t('home.nextStepTitle').toUpperCase()}
        </AppText>
        <AppText size="body" weight="medium">
          {t(step.labelKey)}
        </AppText>
      </View>
    </Card>
  );
}

function ReflectionCard({ onSaved }: { onSaved: () => void }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const { todaysReflection, answerReflection, logWin } = useApp();
  const [text, setText] = useState('');
  const qIndex = todaysQuestionIndex(todayStr());

  if (todaysReflection) {
    return (
      <Card fadeIndex={2}>
        <AppText size="small" weight="bold" color={theme.colors.textMuted}>
          {t('home.reflectionTitle').toUpperCase()}
        </AppText>
        <AppText size="body" color={theme.colors.success} style={{ marginTop: theme.spacing.xs }}>
          ✓ {t('home.reflectionThanks')}
        </AppText>
      </Card>
    );
  }

  const save = () => {
    if (!text.trim()) return;
    answerReflection(qIndex, text.trim());
    logWin('wins.reflection');
    haptic.success();
    onSaved();
  };

  return (
    <Card fadeIndex={2}>
      <View style={{ gap: theme.spacing.sm }}>
        <AppText size="small" weight="bold" color={theme.colors.textMuted}>
          {t('home.reflectionTitle').toUpperCase()}
        </AppText>
        <AppText size="body" weight="medium">
          {t(`home.reflections.q${qIndex}`)}
        </AppText>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder={t('home.reflectionPlaceholder')}
          placeholderTextColor={theme.colors.textMuted}
          multiline
          style={{
            backgroundColor: theme.colors.bg,
            borderColor: theme.colors.border,
            borderWidth: 1,
            borderRadius: theme.radius.md,
            padding: theme.spacing.md,
            minHeight: 60,
            fontSize: theme.type.body,
            color: theme.colors.text,
          }}
        />
        {!!text.trim() && <Button title={t('common.save')} onPress={save} />}
      </View>
    </Card>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const theme = useTheme();
  return (
    <View style={{ gap: 4 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <AppText size="tiny" weight="medium" color={theme.colors.textMuted}>
          {label}
        </AppText>
      </View>
      <View
        accessibilityRole="progressbar"
        accessibilityLabel={label}
        style={{
          height: 10,
          borderRadius: 5,
          backgroundColor: theme.colors.surfaceAlt,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            width: `${Math.round(value * 100)}%`,
            height: '100%',
            borderRadius: 5,
            backgroundColor: theme.colors.primarySoft,
          }}
        />
      </View>
    </View>
  );
}

function ProgressSection({ documentCount }: { documentCount: number }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const { checkIns, reflections, joinedCircleIds, savedResourceIds, contactedResourceIds, wins } =
    useApp();

  const weekAgo = new Date(Date.now() - 7 * 86_400_000).toISOString().slice(0, 10);
  const score = lifeScore({
    checkInsThisWeek: checkIns.filter((c) => c.date >= weekAgo).length,
    reflectionsThisWeek: reflections.filter((r) => r.date >= weekAgo).length,
    documentCount,
    joinedCircles: joinedCircleIds.length,
    savedResources: savedResourceIds.length,
    contactedResources: contactedResourceIds.length,
  });

  const recentWins = wins.slice(0, 4);

  return (
    <Card fadeIndex={3}>
      <View style={{ gap: theme.spacing.md }}>
        <AppText size="heading" weight="bold">
          {t('home.progressTitle')}
        </AppText>

        <View style={{ gap: theme.spacing.sm }}>
          <AppText size="small" weight="bold" color={theme.colors.textMuted}>
            {t('home.lifeScoreTitle').toUpperCase()}
          </AppText>
          <ScoreBar label={t('home.scoreDims.financial')} value={score.financial} />
          <ScoreBar label={t('home.scoreDims.organization')} value={score.organization} />
          <ScoreBar label={t('home.scoreDims.community')} value={score.community} />
          <ScoreBar label={t('home.scoreDims.wellbeing')} value={score.wellbeing} />
          <AppText size="tiny" color={theme.colors.textMuted}>
            {t('home.lifeScoreNote')}
          </AppText>
        </View>

        <View style={{ gap: theme.spacing.sm }}>
          <AppText size="small" weight="bold" color={theme.colors.textMuted}>
            {t('home.winsTitle').toUpperCase()}
          </AppText>
          {recentWins.length === 0 ? (
            <AppText size="small" color={theme.colors.textMuted}>
              {t('home.winsEmpty')}
            </AppText>
          ) : (
            recentWins.map((w) => (
              <AppText key={w.id} size="small">
                ✨ {t(w.labelKey)}
              </AppText>
            ))
          )}
        </View>
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
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [documentCount, setDocumentCount] = useState(0);

  useEffect(() => {
    void listDocuments().then((d) => setDocumentCount(d.length));
  }, []);

  const saved = savedResourceIds.map(getResource).filter((r): r is NonNullable<typeof r> => !!r);

  const fireCelebration = (msg: string) => {
    setCelebrate(false);
    setToastMsg(null);
    requestAnimationFrame(() => {
      setCelebrate(true);
      setToastMsg(msg);
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    void listDocuments().then((d) => {
      setDocumentCount(d.length);
      setRefreshing(false);
    });
  };

  return (
    <>
      <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: theme.colors.bg }}>
        <ScrollView
          contentContainerStyle={{ padding: theme.spacing.md, gap: theme.spacing.md }}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primarySoft}
            />
          }
        >
          <AppText size="title" weight="heavy">
            {greetingEmoji()} {t(greetingKey())}
          </AppText>

          <CheckInCard onCelebrate={() => fireCelebration(t('home.checkInToast'))} />
          <NextStepCard documentCount={documentCount} />
          <ReflectionCard onSaved={() => fireCelebration(t('home.reflectionThanks'))} />

          {/* Quick actions — large, warm, unmissable. */}
          <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
            <QuickTile glyph="🧭" label={t('home.quickHelp')} fadeIndex={4} onPress={() => router.push('/(tabs)/resources')} />
            <QuickTile glyph="💬" label={t('home.askAdvisor')} fadeIndex={5} onPress={() => router.push('/(tabs)/advisor')} />
          </View>
          <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
            <QuickTile glyph="🫂" label={t('more.circles')} fadeIndex={6} onPress={() => router.push('/circles')} />
            <QuickTile glyph="🔒" label={t('vault.title')} fadeIndex={7} onPress={() => router.push('/(tabs)/vault')} />
          </View>

          <ProgressSection documentCount={documentCount} />

          <AppText size="heading" weight="bold">
            {t('home.savedResources')}
          </AppText>
          {saved.length === 0 ? (
            <Card
              fadeIndex={8}
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
        </ScrollView>
      </SafeAreaView>

      <ConfettiCelebration visible={celebrate} />
      {toastMsg && <Toast message={toastMsg} tone="success" visible={celebrate} />}
    </>
  );
}
