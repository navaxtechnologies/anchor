// Ambient floating particles — tiny motes of teal, gold, and violet drifting
// upward. Alive, atmospheric, never noisy. The "wait — is this moving?" element.
// Pure RN Animated (native + web), fully disabled under reduce-motion.

import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, View } from 'react-native';
import { Palette } from '@/theme';
import { useReducedMotion } from '@/hooks/useAnimation';

const { width, height } = Dimensions.get('window');

const PARTICLE_COLORS = [
  Palette.teal[300],
  Palette.teal[400],
  Palette.gold[300],
  Palette.violet[300],
  Palette.teal[200],
  Palette.gold[200],
];

interface Particle {
  x: number;
  y: Animated.Value;
  opacity: Animated.Value;
  size: number;
  color: string;
  delay: number;
  speed: number;
  peak: number;
}

export function ParticleField({ intensity = 'low' }: { intensity?: 'low' | 'medium' }) {
  const reduced = useReducedMotion();
  const count = intensity === 'low' ? 12 : 20;

  const particles = useRef<Particle[]>(
    Array.from({ length: count }, (_, i) => ({
      x: Math.random() * width,
      y: new Animated.Value(height * 0.7 + Math.random() * height * 0.3),
      opacity: new Animated.Value(0),
      size: 2 + Math.random() * 3,
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      delay: i * 400 + Math.random() * 2000,
      speed: 8000 + Math.random() * 6000,
      peak: 0.5 + Math.random() * 0.4,
    }))
  ).current;

  useEffect(() => {
    if (reduced) return;
    let active = true;
    const loops: Animated.CompositeAnimation[] = [];

    particles.forEach((p) => {
      const run = () => {
        if (!active) return;
        p.y.setValue(height * 0.7 + Math.random() * height * 0.3);
        p.opacity.setValue(0);
        const anim = Animated.sequence([
          Animated.delay(p.delay),
          Animated.parallel([
            Animated.timing(p.y, { toValue: -60, duration: p.speed, useNativeDriver: true }),
            Animated.sequence([
              Animated.timing(p.opacity, { toValue: p.peak, duration: 800, useNativeDriver: true }),
              Animated.delay(Math.max(0, p.speed - 1600)),
              Animated.timing(p.opacity, { toValue: 0, duration: 800, useNativeDriver: true }),
            ]),
          ]),
        ]);
        loops.push(anim);
        anim.start(({ finished }) => {
          if (finished) {
            p.delay = 0; // after the first cycle, loop continuously
            run();
          }
        });
      };
      run();
    });

    return () => {
      active = false;
      loops.forEach((l) => l.stop());
    };
  }, [particles, reduced]);

  if (reduced) return null;

  return (
    <View
      pointerEvents="none"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}
    >
      {particles.map((p, i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            left: p.x,
            width: p.size,
            height: p.size,
            borderRadius: p.size / 2,
            backgroundColor: p.color,
            transform: [{ translateY: p.y }],
            opacity: p.opacity,
          }}
        />
      ))}
    </View>
  );
}
