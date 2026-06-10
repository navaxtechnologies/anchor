// Authoritative app-level types for ANCHOR. See docs/ARCHITECTURE.md §4.

export type Language = 'en' | 'es';

export type Tier = 'free' | 'plus' | 'pro' | 'community';

export type ResourceCategory =
  | 'food'
  | 'housing'
  | 'mental_health'
  | 'legal'
  | 'medical'
  | 'childcare'
  | 'employment'
  | 'immigration'
  | 'crisis';

export interface Resource {
  id: string;
  name: string;
  category: ResourceCategory;
  description: string;
  address: string;
  phone: string;
  hours: string;
  eligibility: string;
  /** ISO-ish language labels the org serves, e.g. ['English', 'Spanish']. */
  languages: string[];
  /** Human-readable wait estimate, e.g. 'Same day' or '1–2 weeks'. */
  estimatedWait: string;
  website?: string;
  applicationUrl?: string;
  lat?: number;
  lng?: number;
}

export type CrisisUrgency = 'emergency' | 'urgent' | 'support';

export interface CrisisAction {
  /** Label shown on the action button. */
  labelKey: string;
  /** 'call' dials, 'text' opens SMS, 'link' opens a URL, 'route' goes to Resource Finder. */
  type: 'call' | 'text' | 'link' | 'route';
  /** Phone number, SMS short code, URL, or a resource category to route to. */
  value: string;
  /** True for 911/988-style primary actions, rendered with emphasis. */
  primary?: boolean;
}

export interface CrisisCategory {
  id: string;
  /** Stable key used for i18n + routing, e.g. 'mental_health'. */
  key: string;
  urgency: CrisisUrgency;
  /** Actions are ordered most-immediate first. */
  actions: CrisisAction[];
}

export type DocumentCategory =
  | 'identity'
  | 'housing'
  | 'medical'
  | 'legal'
  | 'financial'
  | 'benefits'
  | 'other';

export interface DocumentMeta {
  id: string;
  title: string;
  category: DocumentCategory;
  /** Reference into the encrypted storage abstraction — never the raw bytes. */
  storagePath: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
}

export interface Circle {
  id: string;
  name: string;
  topic: string;
  description: string;
  memberCount: number;
  isModerated: boolean;
  /** Warm visual identity for the circle card. */
  emoji?: string;
}

export interface CheckIn {
  id: string;
  date: string; // YYYY-MM-DD
  mood: 1 | 2 | 3 | 4 | 5;
  note?: string;
  createdAt: string;
}

export type AdvisorRole = 'user' | 'assistant' | 'system';

export interface AdvisorMessage {
  id: string;
  role: AdvisorRole;
  content: string;
  createdAt: string;
  /** Set when crisis-language detection fired on this message. */
  flaggedCrisis?: boolean;
}

export interface Profile {
  id: string;
  language: Language;
  simpleMode: boolean;
  tier: Tier;
  /** Consent for the AI to remember personal context. Defaults to false. */
  rememberContext: boolean;
  createdAt: string;
}
