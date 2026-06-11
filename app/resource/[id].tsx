import React from 'react';
import { View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText, Button, Card, Divider, Pill, ScreenContainer } from '@/components/ui';
import { useApp, useTheme } from '@/context/AppContext';
import { getResource } from '@/data/resources';
import { dial, openDirections, openUrl } from '@/lib/actions';

function Field({ label, value }: { label: string; value: string }) {
  const theme = useTheme();
  return (
    <View style={{ gap: 2 }}>
      <AppText size="tiny" weight="bold" color={theme.colors.textMuted}>
        {label.toUpperCase()}
      </AppText>
      <AppText size="body">{value}</AppText>
    </View>
  );
}

export default function ResourceDetail() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const resource = id ? getResource(id) : undefined;
  const { isSaved, toggleSaveResource, markResourceContacted, logWin } = useApp();

  if (!resource) {
    return (
      <ScreenContainer>
        <AppText size="body">{t('resources.none')}</AppText>
      </ScreenContainer>
    );
  }

  const saved = isSaved(resource.id);
  const contacted = (action: () => void) => {
    markResourceContacted(resource.id);
    logWin('wins.resourceContacted');
    action();
  };

  return (
    <>
      <Stack.Screen options={{ title: t(`resources.categories.${resource.category}`) }} />
      <ScreenContainer>
        <AppText size="title" weight="bold">
          {resource.name}
        </AppText>
        <Pill label={t(`resources.categories.${resource.category}`)} tone="accent" />
        <AppText size="body" color={theme.colors.textMuted}>
          {resource.description}
        </AppText>

        {/* Primary actions */}
        <View style={{ gap: theme.spacing.sm }}>
          <Button
            title={`${t('common.call')}  ${resource.phone}`}
            onPress={() => contacted(() => dial(resource.phone))}
          />
          <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
            <Button
              title={t('common.directions')}
              variant="secondary"
              fullWidth={false}
              onPress={() => contacted(() => openDirections(resource))}
              style={{ flex: 1 }}
            />
            <Button
              title={saved ? t('resources.saved') : t('resources.save')}
              variant="ghost"
              fullWidth={false}
              onPress={() => toggleSaveResource(resource.id)}
              style={{ flex: 1 }}
            />
          </View>
          {resource.website && (
            <Button title={t('common.website')} variant="ghost" onPress={() => openUrl(resource.website!)} />
          )}
          {resource.applicationUrl && (
            <Button title={t('common.apply')} variant="ghost" onPress={() => openUrl(resource.applicationUrl!)} />
          )}
        </View>

        <Card>
          <View style={{ gap: theme.spacing.md }}>
            <Field label={t('resources.hours')} value={resource.hours} />
            <Divider />
            <Field label={t('common.directions')} value={resource.address} />
            <Divider />
            <Field label={t('resources.eligibility')} value={resource.eligibility} />
            <Divider />
            <Field label={t('resources.languages')} value={resource.languages.join(', ')} />
            <Divider />
            <Field label={t('resources.wait')} value={resource.estimatedWait} />
          </View>
        </Card>
      </ScreenContainer>
    </>
  );
}
