import React from 'react';
import { View } from 'react-native';
import { AppText } from './ui';
import { useTheme } from '@/context/AppContext';

/** Static disclaimer banner. Rendered independently of any AI output so it
 *  cannot be "argued away" by the model. See ARCHITECTURE §5. */
export function Disclaimer({ text }: { text: string }) {
  const theme = useTheme();
  return (
    <View
      style={{
        backgroundColor: theme.colors.surfaceAlt,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.warning,
      }}
      accessibilityRole="alert"
    >
      <AppText size="small" color={theme.colors.textMuted}>
        {text}
      </AppText>
    </View>
  );
}
