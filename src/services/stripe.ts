// Stripe subscription seam. MOCKED in Phase 1 — no real charges.
//
// Integration (M3): use @stripe/stripe-react-native + a server that creates
// Checkout/PaymentSheet sessions and handles webhooks → writes `subscriptions`.
// The publishable key is the only Stripe value that may live on-device.

import type { Tier } from '@/types';
import { storage } from './supabase';

export const stripeConfigured = !!process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY;

export interface PlanPrice {
  monthly: number; // USD
  yearly?: number; // USD
}

export const PLAN_PRICING: Record<Tier, PlanPrice> = {
  free: { monthly: 0 },
  plus: { monthly: 4.99, yearly: 39.99 },
  pro: { monthly: 12.99, yearly: 99.99 },
  community: { monthly: 24.99 },
};

/** Pretend to run checkout. Returns the chosen tier as if payment succeeded. */
export async function startCheckout(tier: Tier): Promise<{ ok: true; tier: Tier }> {
  await new Promise((r) => setTimeout(r, 400));
  await storage.set('tier', tier);
  return { ok: true, tier };
}

export async function restorePurchases(): Promise<Tier> {
  const tier = await storage.get<Tier>('tier');
  return tier ?? 'free';
}
