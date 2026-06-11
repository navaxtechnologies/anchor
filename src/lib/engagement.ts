// V2 engagement engine: Next Best Step, Weekly Life Score, daily reflections.
// All rule-based and local in Phase 1 — honest heuristics, no fake AI. The
// advisor-powered version arrives with the server proxy (ARCHITECTURE M2).

import type { IntentKey, PriorityKey, ResourceCategory } from '@/types';

// ---------------------------------------------------------------------------
// Next Best Step — one concrete, doable recommendation. Never a wall of tasks.
// ---------------------------------------------------------------------------
export interface NextStep {
  /** i18n key for the step label. */
  labelKey: string;
  /** Where tapping the step goes. */
  route: string;
}

interface NextStepInput {
  intents: IntentKey[];
  priorities: PriorityKey[];
  hasCheckedInToday: boolean;
  savedCount: number;
  contactedCount: number;
  documentCount: number;
}

const INTENT_CATEGORY: Partial<Record<IntentKey, ResourceCategory>> = {
  money: 'employment',
  health: 'medical',
  housing: 'housing',
  family: 'childcare',
  career: 'employment',
};

export function nextBestStep(input: NextStepInput): NextStep {
  // 1. A saved resource not yet contacted → the call is the step.
  if (input.savedCount > 0 && input.contactedCount === 0) {
    return { labelKey: 'home.steps.callSaved', route: '/(tabs)' };
  }
  // 2. Organizing intent / documents priority with an empty vault → first doc.
  if (
    (input.intents.includes('organizing') || input.priorities.includes('organize_documents')) &&
    input.documentCount === 0
  ) {
    return { labelKey: 'home.steps.firstDocument', route: '/(tabs)/vault' };
  }
  // 3. Community intent → join a circle.
  if (input.intents.includes('community')) {
    return { labelKey: 'home.steps.joinCircle', route: '/circles' };
  }
  // 4. Any intent that maps to a resource category → find help there.
  const mapped = input.intents.find((i) => INTENT_CATEGORY[i]);
  if (mapped) {
    return {
      labelKey: `home.steps.${mapped}`,
      route: `/(tabs)/resources?category=${INTENT_CATEGORY[mapped]}`,
    };
  }
  // 5. Mental-health priority → mental health resources.
  if (input.priorities.includes('mental_health')) {
    return { labelKey: 'home.steps.mentalHealth', route: '/(tabs)/resources?category=mental_health' };
  }
  // 6. Default: explore help nearby.
  return { labelKey: 'home.steps.explore', route: '/(tabs)/resources' };
}

// ---------------------------------------------------------------------------
// Weekly Life Score — four gentle dimensions, 0..1. No shame, no red.
// Scores reflect ENGAGEMENT with the app's tools, not a judgment of the
// user's life — the copy must always frame it that way.
// ---------------------------------------------------------------------------
export interface LifeScore {
  financial: number;
  organization: number;
  community: number;
  wellbeing: number;
}

interface LifeScoreInput {
  checkInsThisWeek: number;
  reflectionsThisWeek: number;
  documentCount: number;
  joinedCircles: number;
  savedResources: number;
  contactedResources: number;
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

export function lifeScore(i: LifeScoreInput): LifeScore {
  return {
    financial: clamp01(0.2 + i.savedResources * 0.15 + i.contactedResources * 0.25),
    organization: clamp01(0.2 + i.documentCount * 0.2),
    community: clamp01(0.15 + i.joinedCircles * 0.3),
    wellbeing: clamp01(0.15 + i.checkInsThisWeek * 0.12 + i.reflectionsThisWeek * 0.12),
  };
}

// ---------------------------------------------------------------------------
// Daily reflection — one question per day, rotating deterministically by date.
// Question text lives in i18n as home.reflections.q0..q6.
// ---------------------------------------------------------------------------
export const REFLECTION_COUNT = 7;

export function todaysQuestionIndex(dateStr: string): number {
  // Stable per-day rotation: day-of-year mod count.
  const d = new Date(dateStr + 'T12:00:00');
  const start = new Date(d.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((d.getTime() - start.getTime()) / 86_400_000);
  return dayOfYear % REFLECTION_COUNT;
}
