// Core animation hooks, built on React Native's Animated API (no extra deps,
// works on native + web). Semantics follow the ANCHOR motion system.

import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated } from 'react-native';
import { Motion } from '@/theme/motion';

/** True when the user asked the OS to reduce motion. Loops/decorative motion stop. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((v) => active && setReduced(v))
      .catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => {
      active = false;
      sub.remove();
    };
  }, []);
  return reduced;
}

/** Fade in + settle up on mount — cards, screens, content appearing. */
export function useFadeIn(delay: number = 0) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: Motion.duration.standard,
        delay,
        easing: Motion.easing.enter,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        delay,
        ...Motion.spring.gentle,
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { opacity, transform: [{ translateY }] };
}

/** Staggered list entry — cards cascade in one after another. */
export function useStaggeredEntry(index: number, baseDelay: number = 60) {
  return useFadeIn(index * baseDelay);
}

/** Soft pulse — the crisis button. Alive, never alarming. */
export function useSoftPulse(enabled: boolean = true) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!enabled) {
      scale.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.04,
          duration: 900,
          easing: Motion.easing.standard,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1.0,
          duration: 900,
          easing: Motion.easing.standard,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [enabled, scale]);

  return { transform: [{ scale }] };
}

/** Press feedback — every tappable element uses this. Satisfying, alive. */
export function usePressScale(toScale: number = 0.96) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: toScale,
      ...Motion.spring.snappy,
      useNativeDriver: true,
    }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      ...Motion.spring.snappy,
      useNativeDriver: true,
    }).start();
  };

  return { onPressIn, onPressOut, pressStyle: { transform: [{ scale }] } };
}

/** Celebration pop — check-in done, goal complete. Big and brief. */
export function useCelebrationPop() {
  const scale = useRef(new Animated.Value(1)).current;

  const trigger = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.15, ...Motion.spring.bouncy, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, ...Motion.spring.default, useNativeDriver: true }),
    ]).start();
  };

  return { trigger, popStyle: { transform: [{ scale }] } };
}
