import React from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText, Card, Pill } from './ui';
import { useApp, useTheme } from '@/context/AppContext';
import { dial, openDirections } from '@/lib/actions';
import { Button } from './ui';
import { categoryColor } from '@/lib/categories';
import { track } from '@/services/analytics';
import type { Resource } from '@/types';

export function ResourceCard({ resource }: { resource: Resource }) {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const { isSaved, toggleSaveResource } = useApp();
  const saved = isSaved(resource.id);

  const openDetail = () => {
    track('resource_viewed', { id: resource.id });
    router.push(`/resource/${resource.id}`);
  };

  return (
    <Card style={{ borderLeftWidth: 4, borderLeftColor: categoryColor[resource.category] }}>
      <View style={{ gap: theme.spacing.sm }}>
        {/* Header is the tap target for details — keeps action buttons un-nested. */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={resource.name}
          onPress={openDetail}
          style={({ pressed }) => ({ gap: theme.spacing.sm, opacity: pressed ? 0.7 : 1 })}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: theme.spacing.sm }}>
            <AppText size="heading" weight="bold" style={{ flex: 1 }}>
              {resource.name}
            </AppText>
            <Pill label={t(`resources.categories.${resource.category}`)} tone="accent" />
          </View>
          <AppText size="small" color={theme.colors.textMuted} numberOfLines={2}>
            {resource.description}
          </AppText>
        </Pressable>
        <View style={{ flexDirection: 'row', gap: theme.spacing.sm, flexWrap: 'wrap' }}>
          <Pill label={`${t('resources.wait')}: ${resource.estimatedWait}`} />
          <Pill label={resource.languages.join(' · ')} />
        </View>
        <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
          <Button
            title={t('common.call')}
            variant="primary"
            fullWidth={false}
            onPress={() => dial(resource.phone)}
            style={{ flex: 1 }}
          />
          <Button
            title={t('common.directions')}
            variant="secondary"
            fullWidth={false}
            onPress={() => openDirections(resource)}
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
      </View>
    </Card>
  );
}
