// Loading skeleton — a gentle breathing placeholder, never a spinner wall.

import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { useTheme } from '@/context/AppContext';
import { useReducedMotion } from '@/hooks/useAnimation';

export function Skeleton({ height = 72, radius }: { height?: number; radius?: number }) {
  const theme = useTheme();
  const reduced = useReducedMotion();
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    if (reduced) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.5, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity, reduced]);

  return (
    <Animated.View
      style={{
        height,
        borderRadius: radius ?? theme.radius.lg,
        backgroundColor: theme.colors.surfaceAlt,
        opacity,
      }}
    />
  );
}
