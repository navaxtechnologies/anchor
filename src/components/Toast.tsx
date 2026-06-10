// Warm acknowledgement toast — every positive action gets a specific, human
// response, never a generic "Success!". Slides in with a bouncy spring,
// auto-dismisses after 3.5s.

import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { AppText } from './ui';
import { useTheme } from '@/context/AppContext';
import { Motion } from '@/theme/motion';

type ToastTone = 'success' | 'info' | 'milestone';

export function Toast({
  message,
  tone = 'success',
  visible,
}: {
  message: string;
  tone?: ToastTone;
  visible: boolean;
}) {
  const theme = useTheme();
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const palette = {
    success: { bg: theme.colors.successSoft, fg: theme.colors.success, icon: '✓' },
    info: { bg: theme.colors.skySoft, fg: theme.colors.sky, icon: 'ℹ' },
    milestone: { bg: theme.colors.goldSoft, fg: theme.scheme === 'dark' ? theme.colors.gold : '#B45309', icon: '⭐' },
  }[tone];

  useEffect(() => {
    if (!visible) return;
    Animated.parallel([
      Animated.spring(translateY, { toValue: 0, ...Motion.spring.bouncy, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, { toValue: -100, duration: 300, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
    }, 3500);
    return () => clearTimeout(timer);
  }, [visible, translateY, opacity]);

  if (!visible) return null;

  return (
    <Animated.View
      accessibilityRole="alert"
      style={{
        position: 'absolute',
        top: 8,
        left: 16,
        right: 16,
        zIndex: 1000,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: palette.bg,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
        shadowColor: '#111110',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
        elevation: 12,
        transform: [{ translateY }],
        opacity,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: 'rgba(255,255,255,0.6)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AppText style={{ fontSize: 18, lineHeight: 24 }}>{palette.icon}</AppText>
      </View>
      <AppText size="small" weight="medium" color={palette.fg} style={{ flex: 1 }}>
        {message}
      </AppText>
    </Animated.View>
  );
}
