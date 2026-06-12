// Deep Navigation — concentric biolume rings that breathe outward from a center.
// Used behind the Welcome mark to give the void a living, sonar-like pulse.
// Each ring is a static SVG circle inside an Animated.View we scale + fade —
// the most web-safe approach (no animated SVG attributes). Honors reduce-motion.

import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Biolume } from '@/theme';
import { useReducedMotion } from '@/hooks/useAnimation';

export function BiolumePulseRing({ size = 220 }: { size?: number }) {
  const reduced = useReducedMotion();
  const c = size / 2;
  const baseR = size * 0.16;
  const ringIndexes = [0, 1, 2];
  const anims = useRef(ringIndexes.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    if (reduced) return;
    const loops = anims.map((v, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 1100),
          Animated.timing(v, { toValue: 1, duration: 3300, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        ])
      )
    );
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [anims, reduced]);

  const Ring = ({ r, stroke, opacity = 0.6 }: { r: number; stroke: string; opacity?: number }) => (
    <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
      <Circle cx={c} cy={c} r={r} stroke={stroke} strokeWidth={1.4} fill="none" opacity={opacity} />
    </Svg>
  );

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }} pointerEvents="none">
      {/* Static core ring — present even with motion off */}
      <Ring r={baseR} stroke={Biolume.teal.bright} opacity={0.7} />
      {!reduced &&
        anims.map((v, i) => (
          <Animated.View
            key={i}
            style={[
              StyleSheet.absoluteFill,
              {
                opacity: v.interpolate({ inputRange: [0, 0.12, 1], outputRange: [0, 0.45, 0] }),
                transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [1, 2.6] }) }],
              },
            ]}
          >
            <Ring r={baseR} stroke={Biolume.teal.core} opacity={1} />
          </Animated.View>
        ))}
    </View>
  );
}
