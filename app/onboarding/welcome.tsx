import React from 'react';
import { Animated, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Button } from '@/components/ui';
import { WaveBackground } from '@/components/WaveBackground';
import { ParticleField } from '@/components/ParticleField';
import { VoidBackground } from '@/components/deep/VoidBackground';
import { BiolumePulseRing } from '@/components/deep/BiolumePulseRing';
import { useTheme } from '@/context/AppContext';
import { useFadeIn } from '@/hooks/useAnimation';
import { track } from '@/services/analytics';

// One word of the tagline, fading in 80ms after the previous — dawn breaking.
function Word({ children, index }: { children: string; index: number }) {
  const theme = useTheme();
  const entry = useFadeIn(200 + index * 80);
  return (
    <Animated.View style={entry}>
      <AppText size="title" weight="bold" color={theme.colors.text}>
        {children}{' '}
      </AppText>
    </Animated.View>
  );
}

export default function Welcome() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const heroEntry = useFadeIn(0);
  const pointsEntry = useFadeIn(550);
  const ctaEntry = useFadeIn(750);

  const Point = ({ children }: { children: string }) => (
    <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
      <AppText size="body" color={theme.colors.primarySoft} weight="bold">
        •
      </AppText>
      <AppText size="body" color={theme.colors.textMuted} style={{ flex: 1 }}>
        {children}
      </AppText>
    </View>
  );

  const deep = theme.scheme === 'deep';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      {deep ? <VoidBackground /> : <WaveBackground />}
      <ParticleField intensity={deep ? 'low' : 'medium'} />
      <View style={{ flex: 1, padding: theme.spacing.lg, justifyContent: 'space-between' }}>
        <View style={{ gap: theme.spacing.lg, marginTop: theme.spacing.xxl }}>
          {/* Wordmark — hero weight, confident and unafraid.
              In Deep Navigation a sonar pulse ring breathes behind the mark. */}
          <Animated.View style={[heroEntry, { gap: theme.spacing.xs }]}>
            {deep && (
              <View style={{ position: 'absolute', left: -50, top: -70 }} pointerEvents="none">
                <BiolumePulseRing size={240} />
              </View>
            )}
            <AppText
              weight="heavy"
              color={theme.colors.primary}
              style={{ fontSize: 46, lineHeight: 54, letterSpacing: -1.2 }}
            >
              ANCHOR <AppText style={{ fontSize: 42, lineHeight: 54 }}>⚓</AppText>
            </AppText>
          </Animated.View>

          {/* Tagline, word by word. */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {t('onboarding.tagline')
              .split(' ')
              .map((w, i) => (
                <Word key={`${w}-${i}`} index={i}>
                  {w}
                </Word>
              ))}
          </View>

          <Animated.View style={[pointsEntry, { gap: theme.spacing.md, marginTop: theme.spacing.sm }]}>
            <Point>{t('onboarding.missionPoints.one')}</Point>
            <Point>{t('onboarding.missionPoints.two')}</Point>
            <Point>{t('onboarding.missionPoints.three')}</Point>
          </Animated.View>
        </View>

        <Animated.View style={[ctaEntry, { gap: theme.spacing.md }]}>
          <AppText size="small" center color={theme.colors.textMuted}>
            {t('onboarding.noAds')}
          </AppText>
          <Button title={t('onboarding.getStarted')} onPress={() => router.push('/onboarding/language')} />
          {/* Crisis access with no account, before onboarding completes.
              Kept prominent — a safety non-negotiable. */}
          <Button
            title={t('onboarding.iNeedHelpNow')}
            variant="crisis"
            onPress={() => {
              track('crisis_opened', { from: 'welcome' });
              router.push('/crisis');
            }}
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
