import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText, Button, Card, Pill, ScreenContainer } from '@/components/ui';
import { Skeleton } from '@/components/Skeleton';
import { useApp, useTheme } from '@/context/AppContext';
import { addDocument, listDocuments, removeDocument } from '@/services/vault';
import { track } from '@/services/analytics';
import type { DocumentCategory, DocumentMeta } from '@/types';

// In production, the "Add" button opens expo-document-picker and the bytes are
// encrypted client-side before upload (services/vault.ts). Here we add sample metadata
// so the cap logic, categories, and UI are real and testable.
const SAMPLE_CATEGORIES: DocumentCategory[] = ['identity', 'housing', 'medical', 'legal', 'benefits'];

export default function Vault() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const { limits, logWin } = useApp();

  const [docs, setDocs] = useState<DocumentMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void listDocuments().then((d) => {
      setDocs(d);
      setLoading(false);
    });
  }, []);

  const atLimit = docs.length >= limits.maxDocuments;

  const onAdd = async () => {
    if (atLimit) return;
    const category = SAMPLE_CATEGORIES[docs.length % SAMPLE_CATEGORIES.length];
    const doc = await addDocument({
      title: `${t(`vault.categories.${category}`)} (${docs.length + 1})`,
      category,
      mimeType: 'application/pdf',
      sizeBytes: 120_000,
    });
    track('document_added', { category });
    logWin('wins.document');
    setDocs((d) => [doc, ...d]);
  };

  const onRemove = async (id: string) => {
    await removeDocument(id);
    setDocs((d) => d.filter((x) => x.id !== id));
  };

  return (
    <ScreenContainer>
      <AppText size="title" weight="bold">
        {t('vault.title')}
      </AppText>
      <AppText size="small" color={theme.colors.textMuted}>
        {t('vault.subtitle')}
      </AppText>

      <Card style={{ backgroundColor: theme.colors.accentSoft, borderColor: theme.colors.accentSoft }}>
        <AppText size="small" color={theme.colors.primary}>
          🔒 {t('vault.encryptedNote')}
        </AppText>
      </Card>

      <AppText size="tiny" color={theme.colors.textMuted}>
        {t('vault.limitNote', { used: docs.length, limit: limits.maxDocuments })}
      </AppText>

      {atLimit ? (
        <Card style={{ borderColor: theme.colors.warning }}>
          <AppText size="body" weight="medium">
            {t('vault.limitReached')}
          </AppText>
          <Button
            title={t('advisor.upgradeForMore')}
            onPress={() => router.push('/subscribe')}
            style={{ marginTop: theme.spacing.sm }}
          />
        </Card>
      ) : (
        <Button title={t('vault.add')} onPress={onAdd} />
      )}

      {loading ? (
        <View style={{ gap: theme.spacing.sm }}>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </View>
      ) : docs.length === 0 ? (
        <Card>
          <AppText size="body" color={theme.colors.textMuted}>
            {t('vault.empty')}
          </AppText>
        </Card>
      ) : (
        <View style={{ gap: theme.spacing.sm }}>
          {docs.map((d) => (
            <Card key={d.id}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1, gap: 4 }}>
                  <AppText size="body" weight="bold">
                    {d.title}
                  </AppText>
                  <Pill label={t(`vault.categories.${d.category}`)} tone="accent" />
                </View>
                <Button
                  title={t('common.close')}
                  variant="ghost"
                  fullWidth={false}
                  onPress={() => onRemove(d.id)}
                />
              </View>
            </Card>
          ))}
        </View>
      )}
    </ScreenContainer>
  );
}
