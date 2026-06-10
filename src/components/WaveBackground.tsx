// Gentle ambient waves for the welcome screen + dashboard hero.
// Moves like breathing — alive, not distracting. Stops under reduce-motion.

import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, View } from 'react-native';
import { Palette } from '@/theme';
import { useReducedMotion } from '@/hooks/useAnimation';

const { width } = Dimensions.get('window');

function useBreath(duration: number, enabled: boolean) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!enabled) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(v, { toValue: 0, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [v, duration, enabled]);
  return v;
}

export function WaveBackground() {
  const reduced = useReducedMotion();
  const wave1 = useBreath(4000, !reduced);
  const wave2 = useBreath(5500, !reduced);

  return (
    <View
      pointerEvents="none"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 320, overflow: 'hidden' }}
    >
      {/* Wave 1 — teal */}
      <Animated.View
        style={{
          position: 'absolute',
          top: -60,
          left: -40,
          width: width + 80,
          height: 280,
          backgroundColor: Palette.teal[400],
          borderRadius: 999,
          opacity: wave1.interpolate({ inputRange: [0, 1], outputRange: [0.07, 0.1] }),
          transform: [
            { translateX: wave1.interpolate({ inputRange: [0, 1], outputRange: [0, -20] }) },
            { scaleY: 0.3 },
          ],
        }}
      />
      {/* Wave 2 — sky */}
      <Animated.View
        style={{
          position: 'absolute',
          top: -30,
          left: -60,
          width: width + 120,
          height: 240,
          backgroundColor: Palette.sky[300],
          borderRadius: 999,
          opacity: wave2.interpolate({ inputRange: [0, 1], outputRange: [0.05, 0.08] }),
          transform: [
            { translateX: wave2.interpolate({ inputRange: [0, 1], outputRange: [0, 15] }) },
            { scaleY: 0.25 },
          ],
        }}
      />
      {/* Wave 3 — gold glint, static */}
      <View
        style={{
          position: 'absolute',
          top: 40,
          right: -80,
          width: 220,
          height: 220,
          backgroundColor: Palette.gold[300],
          borderRadius: 999,
          opacity: 0.09,
        }}
      />
    </View>
  );
}
