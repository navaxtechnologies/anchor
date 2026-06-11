import React from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  ScrollView,
  StyleProp,
  Text,
  TextProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/AppContext';
import { Gradients } from '@/theme';
import { usePressScale, useStaggeredEntry } from '@/hooks/useAnimation';
import { haptic } from '@/lib/haptics';

type TypeSize = 'display' | 'title' | 'heading' | 'body' | 'small' | 'tiny';

interface AppTextProps extends TextProps {
  size?: TypeSize;
  weight?: 'regular' | 'medium' | 'bold' | 'heavy';
  color?: string;
  center?: boolean;
}

export function AppText({
  size = 'body',
  weight = 'regular',
  color,
  center,
  style,
  ...rest
}: AppTextProps) {
  const theme = useTheme();
  const fontWeight: TextStyle['fontWeight'] =
    weight === 'heavy' ? '800' : weight === 'bold' ? '700' : weight === 'medium' ? '600' : '400';
  return (
    <Text
      style={[
        {
          fontSize: theme.type[size],
          lineHeight: theme.type[size] * theme.lineHeightMult,
          color: color ?? theme.colors.text,
          fontWeight,
          textAlign: center ? 'center' : 'left',
          letterSpacing:
            theme.letterSpacing || (size === 'display' || size === 'title' ? -0.3 : 0),
        },
        style,
      ]}
      {...rest}
    />
  );
}

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'crisis' | 'emergency' | 'ghost' | 'gold';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  fullWidth = true,
  accessibilityLabel,
  style,
}: ButtonProps) {
  const theme = useTheme();
  const { colors } = theme;
  const { onPressIn, onPressOut, pressStyle } = usePressScale(0.96);

  const bg: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary: colors.primary,
    secondary: colors.accentSoft,
    crisis: colors.crisis,
    emergency: colors.emergency,
    ghost: 'transparent',
    gold: colors.gold,
  };
  const fg: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary: theme.scheme === 'dark' ? colors.textInverse : '#FFFFFF',
    secondary: colors.primary,
    crisis: '#FFFFFF',
    emergency: '#FFFFFF',
    ghost: colors.primary,
    gold: '#1F1F1E',
  };

  // Soft shadow lifts the primary action off the page.
  const lift: ViewStyle =
    (variant === 'primary' || variant === 'crisis') && !disabled
      ? {
          shadowColor: variant === 'crisis' ? colors.crisis : colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.22,
          shadowRadius: 12,
          elevation: 5,
        }
      : {};

  return (
    <Animated.View style={[pressStyle, fullWidth ? { alignSelf: 'stretch' } : null]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? title}
        accessibilityState={{ disabled: !!disabled, busy: !!loading }}
        disabled={disabled || loading}
        onPress={() => {
          haptic.tap();
          onPress();
        }}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[
          {
            minHeight: theme.tapHeight,
            paddingHorizontal: theme.spacing.lg,
            paddingVertical: theme.spacing.sm,
            borderRadius: theme.radius.md,
            backgroundColor: bg[variant],
            borderWidth: variant === 'ghost' ? 1.5 : 0,
            borderColor: theme.colors.border,
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: fullWidth ? 'stretch' : 'flex-start',
            opacity: disabled ? 0.5 : 1,
            overflow: 'hidden',
            ...lift,
          },
          style,
        ]}
      >
        {/* The signature gradient — dawn water deepening into violet (AA-safe ends). */}
        {variant === 'primary' && !disabled && theme.scheme === 'light' && (
          <LinearGradient
            colors={Gradients.anchorDeep as unknown as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
        )}
        {loading ? (
          <ActivityIndicator color={fg[variant]} />
        ) : (
          <AppText size="body" weight="bold" color={fg[variant]} center>
            {title}
          </AppText>
        )}
      </Pressable>
    </Animated.View>
  );
}

export function Card({
  children,
  style,
  onPress,
  accessibilityLabel,
  fadeIndex,
  elevated,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  accessibilityLabel?: string;
  /** When set, the card fades + floats in, staggered by index (60ms apart). */
  fadeIndex?: number;
  /** Stronger teal-tinted lift for hero cards. */
  elevated?: boolean;
}) {
  const theme = useTheme();
  const entry = useStaggeredEntry(fadeIndex ?? 0);
  const { onPressIn, onPressOut, pressStyle } = usePressScale(0.98);

  const shadow: ViewStyle = elevated
    ? {
        shadowColor: theme.colors.primarySoft,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.14,
        shadowRadius: 20,
        elevation: 6,
      }
    : {
        shadowColor: '#111110',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
      };

  const cardStyle: StyleProp<ViewStyle> = [
    {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.md + 4,
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...shadow,
    },
    style,
  ];

  const body = (
    <Animated.View style={[cardStyle, fadeIndex != null ? entry : null]}>{children}</Animated.View>
  );

  if (onPress) {
    return (
      <Animated.View style={pressStyle}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
          onPress={() => {
            haptic.tap();
            onPress();
          }}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        >
          {body}
        </Pressable>
      </Animated.View>
    );
  }
  return body;
}

export function Pill({
  label,
  tone = 'neutral',
}: {
  label: string;
  tone?: 'neutral' | 'accent' | 'crisis' | 'gold' | 'lavender' | 'sky';
}) {
  const theme = useTheme();
  const map = {
    neutral: { bg: theme.colors.surfaceAlt, fg: theme.colors.textMuted },
    accent: { bg: theme.colors.accentSoft, fg: theme.colors.primary },
    crisis: { bg: theme.colors.crisisSoft, fg: theme.colors.crisis },
    gold: { bg: theme.colors.goldSoft, fg: theme.scheme === 'dark' ? theme.colors.gold : '#B45309' },
    lavender: { bg: theme.colors.lavenderSoft, fg: theme.scheme === 'dark' ? theme.colors.lavender : '#7C3AED' },
    sky: { bg: theme.colors.skySoft, fg: theme.scheme === 'dark' ? theme.colors.sky : '#0369A1' },
  }[tone];
  return (
    <View
      style={{
        backgroundColor: map.bg,
        borderRadius: theme.radius.pill,
        paddingHorizontal: theme.spacing.sm + 2,
        paddingVertical: 4,
        alignSelf: 'flex-start',
      }}
    >
      <AppText size="tiny" weight="medium" color={map.fg}>
        {label}
      </AppText>
    </View>
  );
}

export function Divider() {
  const theme = useTheme();
  return (
    <View style={{ height: 1, backgroundColor: theme.colors.border, marginVertical: theme.spacing.md }} />
  );
}

export function ScreenContainer({
  children,
  scroll = true,
  style,
  backgroundColor,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
}) {
  const theme = useTheme();
  const inner: StyleProp<ViewStyle> = [
    { padding: theme.spacing.md, gap: theme.spacing.md, flexGrow: 1 },
    style,
  ];
  return (
    <SafeAreaView
      edges={['bottom']}
      style={{ flex: 1, backgroundColor: backgroundColor ?? theme.colors.bg }}
    >
      {scroll ? (
        <ScrollView contentContainerStyle={inner} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        <View style={inner}>{children}</View>
      )}
    </SafeAreaView>
  );
}
