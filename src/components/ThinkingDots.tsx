// The advisor's "thinking" indicator — three teal dots bouncing in sequence.
// A calm guide pausing to think, not a spinner.

import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { useTheme } from '@/context/AppContext';
import { useReducedMotion } from '@/hooks/useAnimation';

function Dot({ delay, color, reduced }: { delay: number; color: string; reduced: boolean }) {
  const y = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduced) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(y, { toValue: -5, duration: 280, useNativeDriver: true }),
        Animated.timing(y, { toValue: 0, duration: 280, useNativeDriver: true }),
        Animated.delay(400 - delay > 0 ? 400 - delay : 0),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [y, delay, reduced]);

  return (
    <Animated.View
      style={{
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: color,
        transform: [{ translateY: y }],
      }}
    />
  );
}

export function ThinkingDots() {
  const theme = useTheme();
  const reduced = useReducedMotion();
  return (
    <View
      accessibilityLabel="…"
      style={{
        flexDirection: 'row',
        gap: 6,
        alignSelf: 'flex-start',
        backgroundColor: theme.colors.skySoft,
        borderRadius: theme.radius.lg,
        borderBottomLeftRadius: 4,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.md - 2,
        marginVertical: theme.spacing.xs,
      }}
    >
      <Dot delay={0} color={theme.colors.primarySoft} reduced={reduced} />
      <Dot delay={140} color={theme.colors.primarySoft} reduced={reduced} />
      <Dot delay={280} color={theme.colors.primarySoft} reduced={reduced} />
    </View>
  );
}
