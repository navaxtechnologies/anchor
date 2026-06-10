// Category emoji + accent colors — warmth and instant recognition across
// the Resource Finder and resource cards.

import { Palette } from '@/theme';
import type { ResourceCategory } from '@/types';

export const categoryEmoji: Record<ResourceCategory, string> = {
  food: '🍽️',
  housing: '🏠',
  mental_health: '💚',
  legal: '⚖️',
  medical: '🩺',
  childcare: '🧒',
  employment: '💼',
  immigration: '🌎',
  crisis: '🆘',
};

export const categoryColor: Record<ResourceCategory, string> = {
  food: Palette.gold[400],
  housing: Palette.teal[400],
  mental_health: Palette.lavender[400],
  legal: Palette.sky[400],
  medical: Palette.coral[300],
  childcare: Palette.gold[300],
  employment: Palette.teal[500],
  immigration: Palette.sky[500],
  crisis: '#DC2626',
};
