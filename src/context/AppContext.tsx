import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';
import { storage } from '@/services/supabase';
import { setAnalyticsEnabled, track } from '@/services/analytics';
import { setLanguage as applyLanguage, initI18n } from '@/i18n';
import { buildTheme, type Theme } from '@/theme';
import { limitsFor } from '@/config/limits';
import type { CheckIn, Language, Tier } from '@/types';

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

interface AiUsage {
  date: string;
  count: number;
}

interface PersistedState {
  onboarded: boolean;
  language: Language;
  simpleMode: boolean;
  tier: Tier;
  rememberContext: boolean;
  analyticsEnabled: boolean;
  savedResourceIds: string[];
  joinedCircleIds: string[];
  aiUsage: AiUsage;
  checkIns: CheckIn[];
}

const DEFAULT_STATE: PersistedState = {
  onboarded: false,
  language: 'en',
  simpleMode: false,
  tier: 'free',
  rememberContext: false,
  analyticsEnabled: true,
  savedResourceIds: [],
  joinedCircleIds: [],
  aiUsage: { date: todayStr(), count: 0 },
  checkIns: [],
};

interface AppContextValue extends PersistedState {
  ready: boolean;
  theme: Theme;
  limits: ReturnType<typeof limitsFor>;
  aiRemaining: number;
  todaysCheckIn: CheckIn | undefined;
  // actions
  setLanguage: (l: Language) => void;
  setSimpleMode: (on: boolean) => void;
  completeOnboarding: () => void;
  setTier: (t: Tier) => void;
  toggleSaveResource: (id: string) => void;
  isSaved: (id: string) => boolean;
  toggleCircle: (id: string) => boolean; // returns true if joined, false if blocked/left
  recordAiQuestion: () => void;
  canAskAi: () => boolean;
  submitCheckIn: (mood: CheckIn['mood'], note?: string) => void;
  setRememberContext: (on: boolean) => void;
  setAnalyticsEnabledPref: (on: boolean) => void;
  deleteAllData: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedState>(DEFAULT_STATE);
  const [ready, setReady] = useState(false);

  // Load persisted state once.
  useEffect(() => {
    let active = true;
    (async () => {
      const saved = await storage.get<PersistedState>('appState');
      const next = saved ? { ...DEFAULT_STATE, ...saved } : DEFAULT_STATE;
      // Reset the daily AI counter if the day rolled over.
      if (next.aiUsage.date !== todayStr()) {
        next.aiUsage = { date: todayStr(), count: 0 };
      }
      initI18n(next.language);
      applyLanguage(next.language);
      setAnalyticsEnabled(next.analyticsEnabled);
      if (active) {
        setState(next);
        setReady(true);
        track('app_open');
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Persist on every change (after initial load).
  useEffect(() => {
    if (ready) void storage.set('appState', state);
  }, [state, ready]);

  const scheme = useColorScheme();
  const theme = useMemo(
    () => buildTheme(state.simpleMode, scheme === 'dark' ? 'dark' : 'light'),
    [state.simpleMode, scheme]
  );
  const limits = useMemo(() => limitsFor(state.tier), [state.tier]);
  const aiRemaining = Math.max(0, limits.aiQuestionsPerDay - state.aiUsage.count);

  const todaysCheckIn = useMemo(
    () => state.checkIns.find((c) => c.date === todayStr()),
    [state.checkIns]
  );

  const setLanguage = useCallback((l: Language) => {
    applyLanguage(l);
    setState((s) => ({ ...s, language: l }));
  }, []);

  const setSimpleMode = useCallback((on: boolean) => {
    setState((s) => ({ ...s, simpleMode: on }));
  }, []);

  const completeOnboarding = useCallback(() => {
    track('onboarding_complete');
    setState((s) => ({ ...s, onboarded: true }));
  }, []);

  const setTier = useCallback((t: Tier) => {
    track('plan_selected', { tier: t });
    setState((s) => ({ ...s, tier: t }));
  }, []);

  const toggleSaveResource = useCallback((id: string) => {
    setState((s) => {
      const has = s.savedResourceIds.includes(id);
      if (!has) track('resource_saved', { id });
      return {
        ...s,
        savedResourceIds: has
          ? s.savedResourceIds.filter((x) => x !== id)
          : [id, ...s.savedResourceIds],
      };
    });
  }, []);

  const isSaved = useCallback(
    (id: string) => state.savedResourceIds.includes(id),
    [state.savedResourceIds]
  );

  const toggleCircle = useCallback(
    (id: string): boolean => {
      const joined = state.joinedCircleIds.includes(id);
      if (joined) {
        setState((s) => ({ ...s, joinedCircleIds: s.joinedCircleIds.filter((x) => x !== id) }));
        return false;
      }
      if (state.joinedCircleIds.length >= limits.maxCircles) {
        return false; // blocked by tier limit
      }
      track('circle_joined', { id });
      setState((s) => ({ ...s, joinedCircleIds: [id, ...s.joinedCircleIds] }));
      return true;
    },
    [state.joinedCircleIds, limits.maxCircles]
  );

  const canAskAi = useCallback(() => aiRemaining > 0, [aiRemaining]);

  const recordAiQuestion = useCallback(() => {
    setState((s) => {
      const date = todayStr();
      const count = s.aiUsage.date === date ? s.aiUsage.count + 1 : 1;
      return { ...s, aiUsage: { date, count } };
    });
    track('advisor_message_sent');
  }, []);

  const submitCheckIn = useCallback((mood: CheckIn['mood'], note?: string) => {
    const date = todayStr();
    const checkIn: CheckIn = {
      id: 'ci-' + date,
      date,
      mood,
      note,
      createdAt: new Date().toISOString(),
    };
    track('checkin_submitted', { mood });
    setState((s) => ({
      ...s,
      checkIns: [checkIn, ...s.checkIns.filter((c) => c.date !== date)],
    }));
  }, []);

  const setRememberContext = useCallback((on: boolean) => {
    setState((s) => ({ ...s, rememberContext: on }));
  }, []);

  const setAnalyticsEnabledPref = useCallback((on: boolean) => {
    setAnalyticsEnabled(on);
    setState((s) => ({ ...s, analyticsEnabled: on }));
  }, []);

  const deleteAllData = useCallback(async () => {
    await storage.clearAll();
    setState({ ...DEFAULT_STATE });
  }, []);

  const value: AppContextValue = {
    ...state,
    ready,
    theme,
    limits,
    aiRemaining,
    todaysCheckIn,
    setLanguage,
    setSimpleMode,
    completeOnboarding,
    setTier,
    toggleSaveResource,
    isSaved,
    toggleCircle,
    recordAiQuestion,
    canAskAi,
    submitCheckIn,
    setRememberContext,
    setAnalyticsEnabledPref,
    deleteAllData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function useTheme(): Theme {
  return useApp().theme;
}
