import React from 'react';
import { Animated, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from './ui';
import { useTheme } from '@/context/AppContext';
import { useReducedMotion, useSoftPulse } from '@/hooks/useAnimation';
import { haptic } from '@/lib/haptics';
import { track } from '@/services/analytics';

/** Always-visible crisis affordance. Sits in the header on every screen and routes
 *  to Crisis Navigation, which needs no account. Soft pulse: alive, never alarming.
 *  Prominence is a safety non-negotiable — design softens it, never hides it. */
export function CrisisButton({ compact }: { compact?: boolean }) {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const pulse = useSoftPulse(!reduced);

  return (
    <Animated.View style={pulse}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('common.getHelpNow')}
        onPress={() => {
          haptic.complete();
          track('crisis_opened', { from: 'header' });
          router.push('/crisis');
        }}
        style={({ pressed }) => ({
          backgroundColor: theme.colors.crisis,
          borderRadius: theme.radius.pill,
          paddingHorizontal: theme.spacing.md,
          paddingVertical: compact ? 6 : 10,
          marginRight: theme.spacing.sm,
          opacity: pressed ? 0.85 : 1,
          minHeight: 40,
          justifyContent: 'center',
          shadowColor: theme.colors.crisis,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 4,
        })}
      >
        <AppText size="small" weight="bold" color="#FFFFFF">
          {t('common.getHelpNow')}
        </AppText>
      </Pressable>
    </Animated.View>
  );
}
