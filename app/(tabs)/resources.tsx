import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText, ScreenContainer } from '@/components/ui';
import { ResourceCard } from '@/components/ResourceCard';
import { useTheme } from '@/context/AppContext';
import { resources } from '@/data/resources';
import { categoryEmoji } from '@/lib/categories';
import { isOpenNow } from '@/lib/openNow';
import type { ResourceCategory } from '@/types';

const CATEGORIES: ResourceCategory[] = [
  'food',
  'housing',
  'mental_health',
  'legal',
  'medical',
  'childcare',
  'employment',
  'immigration',
  'crisis',
];

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={{
        backgroundColor: active ? theme.colors.primary : theme.colors.surface,
        borderColor: active ? theme.colors.primary : theme.colors.border,
        borderWidth: 1,
        borderRadius: theme.radius.pill,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        marginRight: theme.spacing.sm,
        minHeight: 40,
        justifyContent: 'center',
      }}
    >
      <AppText size="small" weight="medium" color={active ? theme.colors.textInverse : theme.colors.text}>
        {label}
      </AppText>
    </Pressable>
  );
}

export default function Resources() {
  const theme = useTheme();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ category?: string }>();
  const initial = (CATEGORIES as string[]).includes(params.category ?? '')
    ? (params.category as ResourceCategory)
    : null;

  const [category, setCategory] = useState<ResourceCategory | null>(initial);
  const [query, setQuery] = useState('');
  const [openOnly, setOpenOnly] = useState(false);
  const [spanishOnly, setSpanishOnly] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return resources.filter((r) => {
      const catOk = !category || r.category === category;
      const qOk =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q);
      const openOk = !openOnly || isOpenNow(r.hours);
      const langOk =
        !spanishOnly || r.languages.some((l) => l.toLowerCase().includes('spanish') || l.toLowerCase().includes('español'));
      return catOk && qOk && openOk && langOk;
    });
  }, [category, query, openOnly, spanishOnly]);

  return (
    <ScreenContainer scroll>
      <AppText size="title" weight="bold">
        {t('resources.title')}
      </AppText>
      <AppText size="small" color={theme.colors.textMuted}>
        {t('resources.subtitle')}
      </AppText>

      <TextInput
        placeholder={t('resources.searchPlaceholder')}
        placeholderTextColor={theme.colors.textMuted}
        value={query}
        onChangeText={setQuery}
        style={{
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderWidth: 1,
          borderRadius: theme.radius.md,
          paddingHorizontal: theme.spacing.md,
          minHeight: theme.tapHeight,
          fontSize: theme.type.body,
          color: theme.colors.text,
        }}
      />

      {/* Practical filters — open now (approximate) and Spanish-speaking. */}
      <View style={{ flexDirection: 'row' }}>
        <Chip
          label={`🕐 ${t('resources.filterOpenNow')}`}
          active={openOnly}
          onPress={() => setOpenOnly(!openOnly)}
        />
        <Chip
          label={`🗣️ ${t('resources.filterSpanish')}`}
          active={spanishOnly}
          onPress={() => setSpanishOnly(!spanishOnly)}
        />
      </View>
      {openOnly && (
        <AppText size="tiny" color={theme.colors.textMuted}>
          {t('resources.openNowApprox')}
        </AppText>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Chip label={t('resources.allCategories')} active={!category} onPress={() => setCategory(null)} />
        {CATEGORIES.map((c) => (
          <Chip
            key={c}
            label={`${categoryEmoji[c]} ${t(`resources.categories.${c}`)}`}
            active={category === c}
            onPress={() => setCategory(category === c ? null : c)}
          />
        ))}
      </ScrollView>

      {filtered.length === 0 ? (
        <AppText size="body" color={theme.colors.textMuted}>
          {t('resources.none')}
        </AppText>
      ) : (
        <View style={{ gap: theme.spacing.md }}>
          {filtered.map((r) => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </View>
      )}
    </ScreenContainer>
  );
}
