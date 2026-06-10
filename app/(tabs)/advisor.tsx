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
import { AppText, Button, Card } from '@/components/ui';
import { Disclaimer } from '@/components/Disclaimer';
import { ThinkingDots } from '@/components/ThinkingDots';
import { useApp, useTheme } from '@/context/AppContext';
import { generateReply } from '@/services/claude';
import { haptic } from '@/lib/haptics';
import { track } from '@/services/analytics';
import type { AdvisorMessage } from '@/types';

function Bubble({ message }: { message: AdvisorMessage }) {
  const theme = useTheme();
  const mine = message.role === 'user';

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
          backgroundColor: message.flaggedCrisis ? theme.colors.crisisSoft : theme.colors.skySoft,
          borderWidth: message.flaggedCrisis ? 1 : 0,
          borderColor: theme.colors.crisis,
          borderRadius: theme.radius.lg,
          borderBottomLeftRadius: 4,
          padding: theme.spacing.md,
        }}
      >
        <AppText size="body">{message.content}</AppText>
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
          renderItem={({ item }) => <Bubble message={item} />}
          contentContainerStyle={{ paddingHorizontal: theme.spacing.md, paddingBottom: theme.spacing.md }}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          ListFooterComponent={thinking ? <ThinkingDots /> : null}
        />

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
              {Number.isFinite(aiRemaining) && (
                <AppText size="tiny" color={theme.colors.textMuted}>
                  {t('advisor.remainingOther', { count: aiRemaining })}
                </AppText>
              )}
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
