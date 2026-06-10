// Crisis Navigation data. Always-free, no-auth. Actions reference i18n keys so they
// stay bilingual. National numbers (911/988) are hard-coded; local routes are seed
// placeholders to confirm with local agencies pre-launch (ARCHITECTURE M6).

import type { CrisisCategory } from '@/types';

export const crisisCategories: CrisisCategory[] = [
  {
    id: 'mental_health',
    key: 'mental_health',
    urgency: 'urgent',
    actions: [
      { labelKey: 'crisis.call988', type: 'call', value: '988', primary: true },
      { labelKey: 'crisis.call911', type: 'call', value: '911', primary: true },
      { labelKey: 'resources.categories.mental_health', type: 'route', value: 'mental_health' },
    ],
  },
  {
    id: 'domestic_violence',
    key: 'domestic_violence',
    urgency: 'emergency',
    actions: [
      { labelKey: 'crisis.call911', type: 'call', value: '911', primary: true },
      // National DV Hotline
      { labelKey: 'crisis.categories.domestic_violence.title', type: 'call', value: '18007997233' },
      { labelKey: 'resources.categories.crisis', type: 'route', value: 'crisis' },
    ],
  },
  {
    id: 'medical',
    key: 'medical',
    urgency: 'emergency',
    actions: [
      { labelKey: 'crisis.call911', type: 'call', value: '911', primary: true },
      { labelKey: 'resources.categories.medical', type: 'route', value: 'medical' },
    ],
  },
  {
    id: 'housing',
    key: 'housing',
    urgency: 'urgent',
    actions: [
      // 211 routes to local shelter/housing
      { labelKey: 'crisis.localRoutesTitle', type: 'call', value: '211', primary: true },
      { labelKey: 'resources.categories.housing', type: 'route', value: 'housing' },
    ],
  },
  {
    id: 'food',
    key: 'food',
    urgency: 'support',
    actions: [
      { labelKey: 'crisis.localRoutesTitle', type: 'call', value: '211', primary: true },
      { labelKey: 'resources.categories.food', type: 'route', value: 'food' },
    ],
  },
  {
    id: 'legal',
    key: 'legal',
    urgency: 'urgent',
    actions: [
      { labelKey: 'crisis.call911', type: 'call', value: '911', primary: true },
      { labelKey: 'resources.categories.legal', type: 'route', value: 'legal' },
    ],
  },
  {
    id: 'substance',
    key: 'substance',
    urgency: 'urgent',
    actions: [
      { labelKey: 'crisis.call988', type: 'call', value: '988', primary: true },
      { labelKey: 'crisis.call911', type: 'call', value: '911', primary: true },
      // SAMHSA national helpline
      { labelKey: 'crisis.categories.substance.title', type: 'call', value: '18006624357' },
    ],
  },
];

export function getCrisisCategory(key: string): CrisisCategory | undefined {
  return crisisCategories.find((c) => c.key === key);
}
