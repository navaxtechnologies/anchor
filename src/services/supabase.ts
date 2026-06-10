// Supabase seam. MOCKED in Phase 1 — no network, no real auth.
//
// Integration (M1): install @supabase/supabase-js, create the client from
// EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY, run supabase/schema.sql,
// and replace the in-memory stubs below. Persistence here uses AsyncStorage so the
// local app feels real (profile, check-ins, saved items survive restarts).

import AsyncStorage from '@react-native-async-storage/async-storage';

export const supabaseConfigured =
  !!process.env.EXPO_PUBLIC_SUPABASE_URL && !!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const NS = 'anchor:';

export const storage = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(NS + key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },
  async set<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(NS + key, JSON.stringify(value));
    } catch {
      // best-effort in the mock
    }
  },
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(NS + key);
    } catch {
      /* noop */
    }
  },
  async clearAll(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(keys.filter((k) => k.startsWith(NS)));
    } catch {
      /* noop */
    }
  },
};

// Mocked anonymous auth — crisis features never touch this.
export const auth = {
  async getAnonymousId(): Promise<string> {
    let id = await storage.get<string>('anonId');
    if (!id) {
      id = 'anon-' + Math.abs(hashString(String(Date.now()) + ':seed')).toString(36);
      await storage.set('anonId', id);
    }
    return id;
  },
};

// Tiny stable hash so we avoid Math.random for the id (deterministic in tests).
function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return h;
}
