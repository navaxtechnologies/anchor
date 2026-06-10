// Confetti burst for milestone moments (first check-in, goal complete).
// Joy is mandatory — big and brief. Skipped entirely under reduce-motion.

import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, View } from 'react-native';
import { Palette } from '@/theme';
import { useReducedMotion } from '@/hooks/useAnimation';

const { width, height } = Dimensions.get('window');
const NUM_CONFETTI = 50;

const CONFETTI_COLORS = [
  Palette.teal[400],
  Palette.gold[400],
  Palette.lavender[400],
  Palette.sky[400],
  Palette.coral[300],
  '#FFFFFF',
  Palette.teal[300],
  Palette.gold[300],
];

interface ConfettiPiece {
  x: number;
  y: Animated.Value;
  rotation: Animated.Value;
  opacity: Animated.Value;
  color: string;
  size: number;
  round: boolean;
}

export function ConfettiCelebration({ visible }: { visible: boolean }) {
  const reduced = useReducedMotion();
  const pieces = useRef<ConfettiPiece[]>(
    Array.from({ length: NUM_CONFETTI }, () => ({
      x: width * 0.15 + Math.random() * width * 0.7,
      y: new Animated.Value(-20),
      rotation: new Animated.Value(0),
      opacity: new Animated.Value(0),
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: 6 + Math.random() * 8,
      round: Math.random() > 0.5,
    }))
  ).current;

  useEffect(() => {
    if (!visible || reduced) return;
    const animations = pieces.map((piece, i) => {
      piece.y.setValue(-20);
      piece.opacity.setValue(1);
      piece.rotation.setValue(0);
      return Animated.sequence([
        Animated.delay(i * 15),
        Animated.parallel([
          Animated.timing(piece.y, {
            toValue: height + 50,
            duration: 1800 + Math.random() * 800,
            useNativeDriver: true,
          }),
          Animated.timing(piece.rotation, {
            toValue: Math.random() > 0.5 ? 1 : -1,
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.delay(1200),
            Animated.timing(piece.opacity, { toValue: 0, duration: 400, useNativeDriver: true }),
          ]),
        ]),
      ]);
    });
    Animated.parallel(animations).start();
  }, [visible, reduced, pieces]);

  if (!visible || reduced) return null;

  return (
    <View
      pointerEvents="none"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }}
    >
      {pieces.map((piece, i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            left: piece.x,
            width: piece.size,
            height: piece.round ? piece.size : piece.size * 1.5,
            backgroundColor: piece.color,
            borderRadius: piece.round ? piece.size / 2 : 2,
            opacity: piece.opacity,
            transform: [
              { translateY: piece.y },
              {
                rotate: piece.rotation.interpolate({
                  inputRange: [-1, 1],
                  outputRange: ['-360deg', '360deg'],
                }),
              },
            ],
          }}
        />
      ))}
    </View>
  );
}
