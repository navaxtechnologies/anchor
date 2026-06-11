import React, { useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import { LinearGradient } from 'expo-linear-gradient';
import { Gradients, Palette } from '@/theme';
import { AppText, Button, Card } from '@/components/ui';
import { Disclaimer } from '@/components/Disclaimer';
import { ThinkingDots } from '@/components/ThinkingDots';
import { useApp, useTheme } from '@/context/AppContext';
import { generateReply } from '@/services/claude';
import { haptic } from '@/lib/haptics';
import { track } from '@/services/analytics';
import type { AdvisorMessage } from '@/types';

// Keyword → resource-category follow-up for the last AI reply.
function followUpFor(content: string): { labelKey: string; category: string } | null {
  const t = content.toLowerCase();
  if (/food|comida|pantry|despensa|snap/.test(t)) return { labelKey: 'advisor.followUpFood', category: 'food' };
  if (/hous|rent|shelter|vivienda|renta|refugio/.test(t)) return { labelKey: 'advisor.followUpHousing', category: 'housing' };
  if (/job|work|résumé|resume|empleo|trabajo/.test(t)) return { labelKey: 'advisor.followUpJobs', category: 'employment' };
  if (/legal|attorney|abogado|court|corte/.test(t)) return { labelKey: 'advisor.followUpLegal', category: 'legal' };
  if (/counsel|mental|consejer|salud mental/.test(t)) return { labelKey: 'advisor.followUpMental', category: 'mental_health' };
  return null;
}

function Bubble({ message, language }: { message: AdvisorMessage; language: string }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const mine = message.role === 'user';

  const speak = () => {
    Speech.stop();
    Speech.speak(message.content, { language: language === 'es' ? 'es-MX' : 'en-US', rate: 0.95 });
  };

  if (mine) {
    return (
      <View
        style={{
          alignSelf: 'flex-end',
          backgroundColor: theme.colors.primary,
          borderRadius: theme.radius.lg,
          borderBottomRightRadius: 4,
          padding: theme.spacing.md,
          marginVertical: theme.spacing.xs,
          maxWidth: '85%',
        }}
      >
        <AppText size="body" color={theme.scheme === 'dark' ? theme.colors.textInverse : '#FFFFFF'}>
          {message.content}
        </AppText>
      </View>
    );
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        alignSelf: 'flex-start',
        alignItems: 'flex-end',
        gap: 6,
        maxWidth: '90%',
        marginVertical: theme.spacing.xs,
      }}
    >
      <AppText style={{ fontSize: 16, lineHeight: 22 }}>⚓</AppText>
      <View
        style={{
          flexShrink: 1,
          backgroundColor: message.flaggedCrisis ? theme.colors.crisisSoft : theme.colors.violetSoft,
          borderWidth: message.flaggedCrisis ? 1 : 0,
          borderColor: theme.colors.crisis,
          borderRadius: theme.radius.lg,
          borderBottomLeftRadius: 4,
          padding: theme.spacing.md,
          gap: 6,
        }}
      >
        <AppText size="body">{message.content}</AppText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('advisor.listen')}
          onPress={speak}
          style={({ pressed }) => ({ alignSelf: 'flex-start', opacity: pressed ? 0.6 : 1 })}
        >
          <AppText size="tiny" weight="medium" color={theme.colors.sky}>
            🔊 {t('advisor.listen')}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

function SuggestionChip({ label, onPress }: { label: string; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => {
        haptic.selection();
        onPress();
      }}
      style={({ pressed }) => ({
        backgroundColor: pressed ? theme.colors.primarySoft : theme.colors.accentSoft,
        borderColor: theme.colors.primarySoft,
        borderWidth: 1,
        borderRadius: theme.radius.pill,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm + 2,
        marginRight: theme.spacing.sm,
      })}
    >
      <AppText size="small" weight="medium" color={theme.colors.primary}>
        {label}
      </AppText>
    </Pressable>
  );
}

let idCounter = 0;
const nextId = () => `m-${++idCounter}`;

export default function Advisor() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const {
    language,
    aiRemaining,
    canAskAi,
    recordAiQuestion,
    rememberContext,
    setRememberContext,
  } = useApp();

  const [messages, setMessages] = useState<AdvisorMessage[]>([
    { id: nextId(), role: 'assistant', content: t('advisor.intro'), createdAt: new Date().toISOString() },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [showCrisis, setShowCrisis] = useState(false);
  const [rememberDismissed, setRememberDismissed] = useState(false);
  const listRef = useRef<FlatList<AdvisorMessage>>(null);

  const hasUserMessage = messages.some((m) => m.role === 'user');
  const showRememberPrompt = hasUserMessage && !rememberContext && !rememberDismissed;

  const send = async (textOverride?: string) => {
    const text = (textOverride ?? input).trim();
    if (!text || thinking) return;
    if (!canAskAi()) {
      track('advisor_limit_hit');
      return;
    }

    const userMsg: AdvisorMessage = {
      id: nextId(),
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    recordAiQuestion();
    setThinking(true);

    const { content, crisis } = await generateReply(text, {
      language,
      history: messages,
      rememberContext,
    });

    setMessages((m) => [
      ...m,
      { id: nextId(), role: 'assistant', content, createdAt: new Date().toISOString(), flaggedCrisis: crisis },
    ]);
    if (crisis) setShowCrisis(true);
    setThinking(false);
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  };

  const limitReached = !canAskAi();

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: theme.colors.surfaceAlt }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <View style={{ padding: theme.spacing.md, gap: theme.spacing.sm }}>
          {/* Deep-ocean header — light from within. Signals: most powerful feature. */}
          <LinearGradient
            colors={Gradients.ocean as unknown as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
              borderRadius: theme.radius.lg,
              padding: theme.spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
              gap: theme.spacing.md,
              borderWidth: 1,
              borderColor: 'rgba(14, 168, 145, 0.3)',
            }}
          >
            <AppText style={{ fontSize: 28, lineHeight: 36 }}>⚓</AppText>
            <View style={{ flex: 1 }}>
              <AppText size="heading" weight="heavy" color="#E8FAF5">
                {t('advisor.title')}
              </AppText>
              {Number.isFinite(aiRemaining) && !limitReached && (
                <AppText size="tiny" color={Palette.teal[200]}>
                  {t('advisor.remainingOther', { count: aiRemaining })}
                </AppText>
              )}
            </View>
          </LinearGradient>

          <Disclaimer text={t('advisor.disclaimer')} />
          {showCrisis && (
            <Card style={{ backgroundColor: theme.colors.crisisSoft, borderColor: theme.colors.crisis }}>
              <AppText size="body" weight="bold" color={theme.colors.crisis}>
                {t('advisor.crisisRedirect')}
              </AppText>
              <Button
                title={t('common.getHelpNow')}
                variant="crisis"
                onPress={() => router.push('/crisis')}
                style={{ marginTop: theme.spacing.sm }}
              />
            </Card>
          )}
        </View>

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={({ item }) => <Bubble message={item} language={language} />}
          contentContainerStyle={{ paddingHorizontal: theme.spacing.md, paddingBottom: theme.spacing.md }}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          ListFooterComponent={thinking ? <ThinkingDots /> : null}
        />

        {/* Follow-up recommendation — concrete next step from the last reply. */}
        {(() => {
          const last = messages[messages.length - 1];
          const follow =
            last?.role === 'assistant' && !last.flaggedCrisis && hasUserMessage
              ? followUpFor(last.content)
              : null;
          if (!follow || thinking) return null;
          return (
            <View style={{ paddingHorizontal: theme.spacing.md, paddingBottom: theme.spacing.sm, flexDirection: 'row' }}>
              <SuggestionChip
                label={`📍 ${t(follow.labelKey)}`}
                onPress={() => router.push(`/(tabs)/resources?category=${follow.category}` as never)}
              />
            </View>
          );
        })()}

        {/* Suggested first questions — inviting, tappable. */}
        {!hasUserMessage && !limitReached && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flexGrow: 0 }}
            contentContainerStyle={{
              paddingHorizontal: theme.spacing.md,
              paddingBottom: theme.spacing.sm,
              alignItems: 'center',
            }}
          >
            <SuggestionChip label={t('advisor.suggested1')} onPress={() => void send(t('advisor.suggested1'))} />
            <SuggestionChip label={t('advisor.suggested2')} onPress={() => void send(t('advisor.suggested2'))} />
            <SuggestionChip label={t('advisor.suggested3')} onPress={() => void send(t('advisor.suggested3'))} />
          </ScrollView>
        )}

        {/* Consent before remembering personal context. */}
        {showRememberPrompt && (
          <Card style={{ margin: theme.spacing.md }}>
            <AppText size="small">{t('advisor.rememberPrompt')}</AppText>
            <View style={{ flexDirection: 'row', gap: theme.spacing.sm, marginTop: theme.spacing.sm }}>
              <Button
                title={t('advisor.rememberYes')}
                fullWidth={false}
                onPress={() => setRememberContext(true)}
                style={{ flex: 1 }}
              />
              <Button
                title={t('advisor.rememberNo')}
                variant="ghost"
                fullWidth={false}
                onPress={() => setRememberDismissed(true)}
                style={{ flex: 1 }}
              />
            </View>
          </Card>
        )}

        <View
          style={{
            padding: theme.spacing.md,
            gap: theme.spacing.sm,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
            backgroundColor: theme.colors.surface,
          }}
        >
          {limitReached ? (
            <View style={{ gap: theme.spacing.sm }}>
              <AppText size="small" color={theme.colors.textMuted} center>
                {t('advisor.limitReached')}
              </AppText>
              <Button title={t('advisor.upgradeForMore')} onPress={() => router.push('/subscribe')} />
              <AppText size="tiny" color={theme.colors.textMuted} center>
                {t('subscribe.noPressure')}
              </AppText>
            </View>
          ) : (
            <>
              <View style={{ flexDirection: 'row', gap: theme.spacing.sm, alignItems: 'flex-end' }}>
                <TextInput
                  placeholder={t('advisor.placeholder')}
                  placeholderTextColor={theme.colors.textMuted}
                  value={input}
                  onChangeText={setInput}
                  multiline
                  style={{
                    flex: 1,
                    backgroundColor: theme.colors.bg,
                    borderColor: theme.colors.border,
                    borderWidth: 1,
                    borderRadius: theme.radius.md,
                    paddingHorizontal: theme.spacing.md,
                    paddingVertical: theme.spacing.sm,
                    minHeight: theme.tapHeight,
                    maxHeight: 120,
                    fontSize: theme.type.body,
                    color: theme.colors.text,
                  }}
                />
                <Button
                  title={t('advisor.send')}
                  fullWidth={false}
                  loading={thinking}
                  disabled={!input.trim()}
                  onPress={() => void send()}
                />
              </View>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
