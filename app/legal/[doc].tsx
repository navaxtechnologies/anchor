// In-app legal document viewer. Drafts are clearly labeled for attorney
// review pre-launch; plain rendering, large readable text.

import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText, ScreenContainer } from '@/components/ui';
import { Disclaimer } from '@/components/Disclaimer';
import { useTheme } from '@/context/AppContext';
import { legalDocs, type LegalDocKey } from '@/data/legal';

const KEYS: LegalDocKey[] = ['terms', 'privacy', 'guidelines', 'aiDisclaimer'];

export default function LegalDoc() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { doc } = useLocalSearchParams<{ doc: string }>();
  const key = (KEYS as string[]).includes(doc ?? '') ? (doc as LegalDocKey) : 'terms';
  const document = legalDocs[key];

  return (
    <>
      <Stack.Screen options={{ title: t(document.titleKey) }} />
      <ScreenContainer>
        <Disclaimer text={t('legal.draftNote')} />
        <AppText size="small" color={theme.colors.text} style={{ lineHeight: theme.type.small * 1.7 }}>
          {document.body}
        </AppText>
      </ScreenContainer>
    </>
  );
}
