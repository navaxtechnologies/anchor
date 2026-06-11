// ANCHOR emotional design system — "Sunrise" palette. Warm, hopeful, held.
// Design intent: warmth on open, delight on touch, relief on finding help.
// Accessibility note: where the aesthetic spec used white-on-teal500 (~2.5:1),
// primary surfaces use teal700 instead — high contrast is a product non-negotiable.
// Simple Mode still scales everything from one switch.

// ─────────────────────────────────────────────
// RAW PALETTE — full scales, used by components
// ─────────────────────────────────────────────
export const Palette = {
  // Anchor Teal — still water at dawn. Calm clarity, trust without coldness.
  teal: {
    50: '#F0FDFA',
    100: '#CCFBF1',
    200: '#99F6E4',
    300: '#5EEAD4',
    400: '#2DD4BF',
    500: '#14B8A6',
    600: '#0D9488',
    700: '#0F766E',
    900: '#134E4A',
  },
  // Sunrise Gold — used sparingly. Pure joy, achievement.
  gold: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
  },
  // Soft Lavender — community, you are not alone.
  lavender: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6',
    600: '#7C3AED',
  },
  // Coral Peach — human warmth, the feeling of being held.
  coral: {
    50: '#FFF5F5',
    100: '#FED7D7',
    200: '#FEB2B2',
    300: '#FC8181',
    400: '#F87171',
  },
  // Sky Blue — the AI advisor. A calm guide speaking.
  sky: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    200: '#BAE6FD',
    300: '#7DD3FC',
    400: '#38BDF8',
    500: '#0EA5E9',
    600: '#0284C7',
    700: '#0369A1',
  },
  // Deep Navy — depth and trust. Headings, hero gradients (V2).
  navy: {
    50: '#F0F5FA',
    300: '#7896B5',
    500: '#2C4A68',
    700: '#1B344F',
    800: '#142A40',
    900: '#0F2233',
  },
  // Warm Sand / Soft Ivory — grounded warmth (V2).
  sand: {
    50: '#FBF8F1',
    100: '#F6F1E7',
    200: '#EDE4D3',
    300: '#DCCDB4',
  },
  // Warm neutrals — never cold gray.
  neutral: {
    0: '#FFFFFF',
    50: '#FAFAFA',
    100: '#F5F5F0',
    200: '#E8E8E3',
    300: '#D1D1CB',
    400: '#A8A89F',
    500: '#737370',
    600: '#525250',
    700: '#363634',
    800: '#1F1F1E',
    900: '#111110',
  },
} as const;

// Gradients — hero moments, cards, celebrations.
export const Gradients = {
  sunrise: ['#14B8A6', '#0EA5E9'],
  warmCard: ['#F0FDF4', '#FAFDF9'],
  celebrate: ['#FBBF24', '#F59E0B'],
  community: ['#EDE9FE', '#F0FDF4'],
  advisor: ['#E0F2FE', '#F0FDFA'],
  morning: ['#14B8A6', '#38BDF8', '#FBBF24'],
} as const;

// ─────────────────────────────────────────────
// SEMANTIC THEME COLORS — what screens consume
// ─────────────────────────────────────────────
export interface ThemeColors {
  primary: string;
  primarySoft: string;
  accent: string;
  accentSoft: string;
  crisis: string;
  crisisSoft: string;
  emergency: string;
  bg: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textMuted: string;
  textInverse: string;
  border: string;
  success: string;
  successSoft: string;
  warning: string;
  gold: string;
  goldSoft: string;
  lavender: string;
  lavenderSoft: string;
  sky: string;
  skySoft: string;
  overlay: string;
}

// Light — layered warmth, never clinical white.
export const colors: ThemeColors = {
  primary: Palette.teal[700],      // CTAs, headers — 5:1 on white
  primarySoft: Palette.teal[500],  // active states, accents
  accent: Palette.teal[600],
  accentSoft: Palette.teal[50],

  // Crisis: red kept for universal recognition, softened. Calm, not alarm.
  crisis: '#DC2626',
  crisisSoft: '#FEF2F2',
  emergency: '#B91C1C',

  bg: '#FAFDF9',          // warm white with the tiniest hint of green life
  surface: '#FFFFFF',
  surfaceAlt: '#F0FDF4',  // soft sage

  text: Palette.neutral[800],
  textMuted: Palette.neutral[600],
  textInverse: '#FFFFFF',

  border: Palette.neutral[200],
  success: '#16A34A',
  successSoft: '#DCFCE7',
  warning: '#CA8A04',

  gold: Palette.gold[500],
  goldSoft: Palette.gold[100],
  lavender: Palette.lavender[500],
  lavenderSoft: Palette.lavender[100],
  sky: Palette.sky[500],
  skySoft: Palette.sky[50],

  overlay: 'rgba(20, 184, 166, 0.06)',
};

// Dark — not inverted light; its own warm identity. Deep forest, never cold black.
export const darkColors: ThemeColors = {
  ...colors,
  primary: Palette.teal[400],
  primarySoft: Palette.teal[300],
  accent: Palette.teal[300],
  accentSoft: 'rgba(20, 184, 166, 0.14)',

  crisis: '#F87171',
  crisisSoft: '#3A201D',
  emergency: '#EF4444',

  bg: '#0F1512',
  surface: '#1E2D22',
  surfaceAlt: '#162018',

  text: '#F0FDF4',
  textMuted: '#A7C4B5',
  textInverse: '#0F1512',

  border: '#2A3A2F',
  success: '#4ADE80',
  successSoft: '#16341F',
  warning: '#FCD34D',

  gold: Palette.gold[400],
  goldSoft: 'rgba(251, 191, 36, 0.16)',
  lavender: Palette.lavender[300],
  lavenderSoft: 'rgba(167, 139, 250, 0.16)',
  sky: Palette.sky[300],
  skySoft: 'rgba(56, 189, 248, 0.12)',

  overlay: 'rgba(20, 184, 166, 0.08)',
};

export type ColorScheme = 'light' | 'dark';

// ─────────────────────────────────────────────
// TYPOGRAPHY — human, legible. Simple Mode scales up.
// ─────────────────────────────────────────────
const baseType = {
  display: 32,
  title: 24,
  heading: 20,
  body: 16,
  small: 14,
  tiny: 12,
};

const simpleType = {
  display: 38,
  title: 30,
  heading: 25,
  body: 21,
  small: 18,
  tiny: 16,
};

export function typography(simpleMode: boolean) {
  return simpleMode ? simpleType : baseType;
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// Rounder geometry — soft, not corporate.
export const radius = {
  sm: 10,
  md: 16,
  lg: 24,
  pill: 999,
} as const;

export function minTapHeight(simpleMode: boolean) {
  return simpleMode ? 64 : 52;
}

export interface ThemeOptions {
  simpleMode: boolean;
  scheme: ColorScheme;
  /** Stronger text/border contrast for low-vision users. */
  highContrast: boolean;
  /** Dyslexia-friendly reading: wider letter spacing + taller lines. */
  dyslexiaMode: boolean;
}

export interface Theme {
  colors: ThemeColors;
  scheme: ColorScheme;
  type: ReturnType<typeof typography>;
  spacing: typeof spacing;
  radius: typeof radius;
  simpleMode: boolean;
  highContrast: boolean;
  dyslexiaMode: boolean;
  /** Extra letter spacing applied to body text (dyslexia mode). */
  letterSpacing: number;
  /** Line-height multiplier (dyslexia mode reads better with taller lines). */
  lineHeightMult: number;
  tapHeight: number;
}

export function buildTheme(
  simpleMode: boolean,
  scheme: ColorScheme = 'light',
  highContrast = false,
  dyslexiaMode = false
): Theme {
  const base = scheme === 'dark' ? darkColors : colors;
  const themeColors: ThemeColors = highContrast
    ? {
        ...base,
        text: scheme === 'dark' ? '#FFFFFF' : '#000000',
        textMuted: scheme === 'dark' ? '#D8E8DE' : Palette.neutral[700],
        border: scheme === 'dark' ? '#4A5C50' : Palette.neutral[400],
        primary: scheme === 'dark' ? Palette.teal[300] : Palette.navy[800],
      }
    : base;

  return {
    colors: themeColors,
    scheme,
    type: typography(simpleMode),
    spacing,
    radius,
    simpleMode,
    highContrast,
    dyslexiaMode,
    letterSpacing: dyslexiaMode ? 0.5 : 0,
    lineHeightMult: dyslexiaMode ? 1.65 : 1.4,
    tapHeight: minTapHeight(simpleMode),
  };
}
