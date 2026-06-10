// Analytics seam. PostHog placeholder. No PII, ever. No-op until a key is set,
// and fully disablable from Settings. See docs/ARCHITECTURE.md §6.

let enabled = true;

export const analyticsConfigured = !!process.env.EXPO_PUBLIC_POSTHOG_KEY;

export function setAnalyticsEnabled(on: boolean) {
  enabled = on;
}

/** Event names are a closed set so we never accidentally log free-text/PII. */
export type AnalyticsEvent =
  | 'app_open'
  | 'onboarding_complete'
  | 'crisis_opened'
  | 'crisis_action'
  | 'resource_viewed'
  | 'resource_saved'
  | 'advisor_message_sent'
  | 'advisor_limit_hit'
  | 'checkin_submitted'
  | 'document_added'
  | 'circle_joined'
  | 'paywall_viewed'
  | 'plan_selected';

export function track(event: AnalyticsEvent, props?: Record<string, string | number | boolean>) {
  if (!enabled || !analyticsConfigured) return;
  // Integration: posthog.capture(event, props). Props are non-PII enums/counts only.
  // eslint-disable-next-line no-console
  if (__DEV__) console.log('[analytics]', event, props ?? {});
}
