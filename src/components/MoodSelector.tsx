// The daily check-in — the most emotionally important component in the app.
// Selection must feel fun: bouncy, responsive, validating. Bilingual via i18n.

import React from 'react';
import { Animated, Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText } from './ui';
import { useTheme } from '@/context/AppContext';
import { Motion } from '@/theme/motion';
import { Palette } from '@/theme';
import { haptic } from '@/lib/haptics';
import type { CheckIn } from '@/types';

const MOODS: { value: CheckIn['mood']; emoji: string; color: string }[] = [
  { value: 1, emoji: '😔', color: Palette.neutral[300] },
  { value: 2, emoji: '😕', color: Palette.coral[300] },
  { value: 3, emoji: '😐', color: Palette.gold[300] },
  { value: 4, emoji: '🙂', color: Palette.teal[300] },
  { value: 5, emoji: '😊', color: Palette.teal[400] },
];

function MoodEmoji({
  emoji,
  label,
  color,
  selected,
  onPress,
}: {
  emoji: string;
  label: string;
  color: string;
  selected: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    haptic.selection();
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.25, ...Motion.spring.bouncy, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1.05, ...Motion.spring.default, useNativeDriver: true }),
    ]).start();
    onPress();
  };

  const size = theme.simpleMode ? 64 : 56;

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      style={{ alignItems: 'center', gap: 4 }}
    >
      <Animated.View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: selected ? color : theme.colors.surfaceAlt,
          borderWidth: selected ? 2 : 0,
          borderColor: theme.colors.primarySoft,
          transform: [{ scale }],
          ...(selected
            ? {
                shadowColor: color,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 12,
                elevation: 8,
              }
            : {}),
        }}
      >
        <AppText style={{ fontSize: theme.simpleMode ? 34 : 28, lineHeight: theme.simpleMode ? 42 : 36 }}>
          {emoji}
        </AppText>
      </Animated.View>
      {selected && (
        <AppText size="tiny" weight="medium" color={theme.colors.primary} center>
          {label}
        </AppText>
      )}
    </Pressable>
  );
}

export function MoodSelector({
  selected,
  onSelect,
}: {
  selected: CheckIn['mood'] | null;
  onSelect: (value: CheckIn['mood']) => void;
}) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View style={{ gap: theme.spacing.md }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4 }}>
        {MOODS.map((m) => (
          <MoodEmoji
            key={m.value}
            emoji={m.emoji}
            label={t(`home.moods.${m.value}`)}
            color={m.color}
            selected={selected === m.value}
            onPress={() => onSelect(m.value)}
          />
        ))}
      </View>
      {selected != null && (
        <AppText size="small" weight="medium" color={theme.colors.primary} center>
          {selected <= 2
            ? t('home.moodResponseLow')
            : selected === 3
              ? t('home.moodResponseMid')
              : t('home.moodResponseHigh')}
        </AppText>
      )}
    </View>
  );
}
