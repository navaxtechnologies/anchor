// The momentum arc — a number that counts up and an arc that draws itself in
// the signature teal→violet gradient. State-driven (not native-driver) so it
// renders identically on native and web. Skips animation under reduce-motion.

import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { AppText } from './ui';
import { useTheme } from '@/context/AppContext';
import { Palette } from '@/theme';
import { useReducedMotion } from '@/hooks/useAnimation';

const SIZE = 170;
const STROKE_W = 14;
const RADIUS = (SIZE - STROKE_W) / 2;
const CIRCUMF = 2 * Math.PI * RADIUS;

export function LiveScore({
  score,
  label,
  sublabel,
}: {
  /** 0–100 */
  score: number;
  label: string;
  sublabel?: string;
}) {
  const theme = useTheme();
  const reduced = useReducedMotion();
  const target = Math.max(0, Math.min(100, Math.round(score)));
  const [display, setDisplay] = useState(reduced ? target : 0);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduced) {
      setDisplay(target);
      return;
    }
    const sub = anim.addListener(({ value }) => setDisplay(Math.round(value)));
    Animated.timing(anim, {
      toValue: target,
      duration: 1400,
      easing: Easing.bezier(0, 0, 0.2, 1),
      useNativeDriver: false, // drives state, not transforms
    }).start();
    return () => anim.removeListener(sub);
  }, [target, anim, reduced]);

  const dashOffset = CIRCUMF * (1 - display / 100);

  return (
    <View style={{ alignItems: 'center', gap: theme.spacing.sm }}>
      <View style={{ width: SIZE, height: SIZE }}>
        <Svg width={SIZE} height={SIZE} style={{ position: 'absolute' }}>
          <Defs>
            <SvgGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={Palette.teal[400]} />
              <Stop offset="100%" stopColor={Palette.violet[400]} />
            </SvgGradient>
          </Defs>
          {/* Track */}
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={theme.scheme === 'dark' ? 'rgba(14,168,145,0.18)' : Palette.neutral[100]}
            strokeWidth={STROKE_W}
            fill="none"
          />
          {/* Progress arc — draws itself */}
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="url(#arcGrad)"
            strokeWidth={STROKE_W}
            strokeDasharray={`${CIRCUMF}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            fill="none"
            rotation={-90}
            origin={`${SIZE / 2}, ${SIZE / 2}`}
          />
        </Svg>
        {/* Center number */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          accessibilityLabel={`${label}: ${target} / 100`}
        >
          <AppText weight="heavy" style={{ fontSize: 46, lineHeight: 52, letterSpacing: -2 }}>
            {display}
          </AppText>
          <AppText size="tiny" weight="bold" color={theme.colors.textMuted}>
            / 100
          </AppText>
        </View>
      </View>
      <AppText size="heading" weight="bold">
        {label}
      </AppText>
      {sublabel && (
        <AppText size="tiny" color={theme.colors.textMuted} center>
          {sublabel}
        </AppText>
      )}
    </View>
  );
}
