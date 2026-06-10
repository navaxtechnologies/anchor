// Haptic feedback mapped to meaning. No-op on web; expo-haptics no-ops gracefully
// where unsupported, but we guard anyway so the web build never imports trouble.

import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

export const haptic = {
  /** Light tap — every button press. */
  tap: () => {
    if (isNative) void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },
  /** Medium — completing something significant. */
  complete: () => {
    if (isNative) void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  },
  /** Heavy — milestone moments, confetti triggers. */
  celebrate: () => {
    if (isNative) void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  },
  /** Success — check-in done, document saved. */
  success: () => {
    if (isNative) void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },
  /** Warning — approaching a limit. */
  warning: () => {
    if (isNative) void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  },
  /** Error — form validation failure. */
  error: () => {
    if (isNative) void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  },
  /** Selection — mood picker, language picker, category picker. */
  selection: () => {
    if (isNative) void Haptics.selectionAsync();
  },
};
