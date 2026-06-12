// Deep Navigation ambient background — the ocean floor environment.
// Three layers: base void, a slow radial biolume pulse, and a faint HUD grid,
// with a bottom fade so the nav bar feels grounded. RN Animated + SVG (web-safe).

import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, RadialGradient, Stop, Rect, Line } from 'react-native-svg';
import { Biolume } from '@/theme';
import { useReducedMotion } from '@/hooks/useAnimation';

const { width, height } = Dimensions.get('window');
const GRID = 40;

export function VoidBackground() {
  const reduced = useReducedMotion();
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduced) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 4000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 4000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse, reduced]);

  const cols = Math.ceil(width / GRID) + 1;
  const rows = Math.ceil(height / GRID) + 1;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Base void */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: Biolume.void.deep }]} />

      {/* Pulsing radial biolume from the deep center */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.62] }),
            transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05] }) }],
          },
        ]}
      >
        <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
          <Defs>
            <RadialGradient id="voidPulse" cx="50%" cy="42%" r="60%">
              <Stop offset="0%" stopColor={Biolume.teal.bright} stopOpacity="0.18" />
              <Stop offset="45%" stopColor={Biolume.teal.dim} stopOpacity="0.07" />
              <Stop offset="100%" stopColor={Biolume.void.deepest} stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Rect width={width} height={height} fill="url(#voidPulse)" />
        </Svg>
      </Animated.View>

      {/* Faint HUD grid — the signature instrument quality */}
      <Svg width={width} height={height} style={[StyleSheet.absoluteFill, { opacity: 0.08 }]}>
        {Array.from({ length: cols }).map((_, i) => (
          <Line key={`v${i}`} x1={i * GRID} y1={0} x2={i * GRID} y2={height} stroke={Biolume.teal.core} strokeWidth={0.5} />
        ))}
        {Array.from({ length: rows }).map((_, i) => (
          <Line key={`h${i}`} x1={0} y1={i * GRID} x2={width} y2={i * GRID} stroke={Biolume.teal.core} strokeWidth={0.5} />
        ))}
      </Svg>

      {/* Bottom fade to pure void */}
      <LinearGradient
        colors={['rgba(2,11,9,0)', Biolume.void.deepest]}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 140 }}
      />
    </View>
  );
}
