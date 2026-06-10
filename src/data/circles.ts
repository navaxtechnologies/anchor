// Seed Community Circles. Moderation is scaffolded in Phase 1 (guidelines + report);
// the moderation backend lands in M5.

import type { Circle } from '@/types';

export const circles: Circle[] = [
  {
    id: 'circle-new-to-sa',
    emoji: '🌆',
    name: 'New to San Antonio',
    topic: 'Getting settled',
    description: 'Finding your footing in a new city — schools, clinics, getting around.',
    memberCount: 342,
    isModerated: true,
  },
  {
    id: 'circle-single-parents',
    emoji: '🧡',
    name: 'Single Parents',
    topic: 'Family',
    description: 'Support and tips for parents doing it on their own.',
    memberCount: 510,
    isModerated: true,
  },
  {
    id: 'circle-job-search',
    emoji: '💼',
    name: 'Job Search Support',
    topic: 'Work',
    description: 'Encouragement, leads, and résumé help from people who get it.',
    memberCount: 268,
    isModerated: true,
  },
  {
    id: 'circle-mental-health',
    emoji: '💚',
    name: 'Mental Health Peer Support',
    topic: 'Wellbeing',
    description: 'A kind space to talk. Not a substitute for care — crisis help is always one tap away.',
    memberCount: 421,
    isModerated: true,
  },
  {
    id: 'circle-newcomers',
    emoji: '🌎',
    name: 'Immigrant & Newcomer Circle',
    topic: 'Immigration',
    description: 'Navigating paperwork, rights, and daily life. Shared in English and Spanish.',
    memberCount: 197,
    isModerated: true,
  },
  {
    id: 'circle-caregivers',
    emoji: '🫶',
    name: 'Caregivers',
    topic: 'Caregiving',
    description: 'For people caring for aging parents, sick family, or loved ones with disabilities.',
    memberCount: 154,
    isModerated: true,
  },
];
