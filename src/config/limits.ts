// Freemium limits. The free tier is intentionally USEFUL, never crippled.
// Crisis Navigation is never limited and never appears here.

import type { Tier } from '@/types';

export interface TierLimits {
  aiQuestionsPerDay: number; // Infinity = unlimited
  maxDocuments: number;
  maxCircles: number;
  familySeats: number;
}

export const TIER_LIMITS: Record<Tier, TierLimits> = {
  free: { aiQuestionsPerDay: 10, maxDocuments: 5, maxCircles: 3, familySeats: 1 },
  plus: { aiQuestionsPerDay: Infinity, maxDocuments: 50, maxCircles: 10, familySeats: 1 },
  pro: { aiQuestionsPerDay: Infinity, maxDocuments: 500, maxCircles: 50, familySeats: 5 },
  community: { aiQuestionsPerDay: Infinity, maxDocuments: 1000, maxCircles: 100, familySeats: 25 },
};

export function limitsFor(tier: Tier): TierLimits {
  return TIER_LIMITS[tier];
}
