// ANCHOR emotional design system — "Sunrise" palette. Warm, hopeful, held.
// Design intent: warmth on open, delight on touch, relief on finding help.
// Accessibility note: where the aesthetic spec used white-on-teal500 (~2.5:1),
// primary surfaces use teal700 instead — high contrast is a product non-negotiable.
// Simple Mode still scales everything from one switch.

// ─────────────────────────────────────────────
// RAW PALETTE — full scales, used by components
// ─────────────────────────────────────────────
export const Palette = {
  // Anchor Teal — still ocean at dawn. Primary identity (Luminous Clarity v2).
  teal: {
    25: '#F2FDFB',
    50: '#E6FAF7',
    100: '#C2F3EC',
    200: '#85E7D8',
    300: '#3DD5C1',
    400: '#14C4AC',
    500: '#0EA891',
    600: '#0B8C78',
    700: '#087062',
    800: '#054E44',
    900: '#032E28',
  },
  // Sunrise Gold — the horizon breaking open. Celebrations only.
  gold: {
    25: '#FFFDF5',
    50: '#FFF9E6',
    100: '#FFF0B3',
    200: '#FFE066',
    300: '#FFC833',
    400: '#FFB300',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
  },
  // Aurora Violet — deep water and wonder. AI advisor, premium.
  violet: {
    50: '#F5F0FF',
    100: '#EBE0FF',
    200: '#D4C0FF',
    300: '#B39DFF',
    400: '#8B73F5',
    500: '#6D4FF0',
    600: '#5438CC',
    700: '#3D27A8',
  },
  // Sage — new leaves, earth after rain. Success and growth.
  sage: {
    25: '#F7FDF9',
    50: '#EDFAF2',
    100: '#D4F3E0',
    300: '#72D49A',
    500: '#22A85A',
    600: '#198245',
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
  // Coral Dawn — skin, breath, presence. Community and care signals.
  coral: {
    50: '#FFF5F4',
    100: '#FFE8E5',
    200: '#FFC9C2',
    300: '#FFA599',
    400: '#FF7D70',
    500: '#FF5A4A',
  },
  // Sky — clarity and information.
  sky: {
    50: '#F0F9FF',
    100: '#DCF0FF',
    200: '#BAE0FF',
    300: '#7EC8FF',
    400: '#38ADFF',
    500: '#0090F0',
    600: '#006FC4',
    700: '#005A9E',
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

// Master gradients — each has a name, a mood, and a purpose.
// Never used just for color — used for feeling.
// NOTE (accessibility override): where the spec used teal500→violet500 under
// white text (~2.8:1), interactive surfaces use the 600/700 ends instead.
export const Gradients = {
  /** THE SIGNATURE — dawn water, teal deepening into violet. Hero moments. */
  anchor: ['#0EA891', '#6D4FF0'],
  /** Deep variant of the signature — AA-safe under white text (buttons). */
  anchorDeep: ['#087062', '#4A30B8'],
  /** Sunrise — the warmth of a new day. Morning card, milestones. */
  sunrise: ['#FFB300', '#FF7D70', '#0EA891'],
  /** Dawn mist — ultra-subtle card backgrounds. Almost invisible, alive. */
  mist: ['#F2FDFB', '#F5F0FF', '#FFFDF5'],
  /** Deep ocean — AI advisor header, premium screens. */
  ocean: ['#032E28', '#0B6B58'],
  /** Celebration — confetti moments and goal completion only. */
  celebrate: ['#FFB300', '#FF7D70'],
  /** Glass shimmer — glassmorphism cards. */
  glass: ['rgba(255,255,255,0.92)', 'rgba(255,255,255,0.75)'],
} as const;

/** Tinted glow auras beneath floating cards — luminous, never heavy. */
export const Aura = {
  teal: 'rgba(14, 168, 145, 0.12)',
  gold: 'rgba(255, 179, 0, 0.10)',
  violet: 'rgba(109, 79, 240, 0.10)',
  coral: 'rgba(255, 125, 112, 0.10)',
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
  violet: string;
  violetSoft: string;
  sky: string;
  skySoft: string;
  overlay: string;
}

// Light — Luminous Clarity. Warm true white; light radiates from within.
export const colors: ThemeColors = {
  primary: Palette.teal[700],      // CTAs, headers — ~5.4:1 on white
  primarySoft: Palette.teal[500],  // active states, accents
  accent: Palette.teal[600],
  accentSoft: Palette.teal[50],

  // Crisis: softened red — urgency without panic. Calm, not alarm.
  crisis: '#E03838',
  crisisSoft: '#FFF2F1',
  emergency: '#C42B2B',

  bg: '#FDFDFC',                  // warm true white
  surface: '#FFFFFF',
  surfaceAlt: Palette.sage[25],   // soft sage wash

  text: Palette.neutral[800],
  textMuted: Palette.neutral[600],
  textInverse: '#FFFFFF',

  border: Palette.neutral[200],
  success: Palette.sage[500],
  successSoft: Palette.sage[50],
  warning: '#CA8A04',

  gold: Palette.gold[500],
  goldSoft: Palette.gold[100],
  lavender: Palette.lavender[500],
  lavenderSoft: Palette.lavender[100],
  violet: Palette.violet[500],
  violetSoft: Palette.violet[50],
  sky: Palette.sky[500],
  skySoft: Palette.sky[50],

  overlay: 'rgba(14, 168, 145, 0.06)',
};

// Dark — "Deep Ocean": underwater at night, where light comes from within.
export const darkColors: ThemeColors = {
  ...colors,
  primary: Palette.teal[400],
  primarySoft: Palette.teal[300],
  accent: Palette.teal[300],
  accentSoft: 'rgba(14, 168, 145, 0.14)',

  crisis: '#FF7B6E',
  crisisSoft: '#3A1F1C',
  emergency: '#FF5252',

  bg: '#090E0D',
  surface: '#142019',
  surfaceAlt: '#0D1614',

  text: '#E8FAF5',
  textMuted: '#8FBFB0',
  textInverse: '#090E0D',

  border: 'rgba(14, 168, 145, 0.18)',
  success: Palette.sage[300],
  successSoft: '#11281A',
  warning: '#FFC833',

  gold: Palette.gold[400],
  goldSoft: 'rgba(255, 179, 0, 0.16)',
  lavender: Palette.lavender[300],
  lavenderSoft: 'rgba(167, 139, 250, 0.16)',
  violet: Palette.violet[300],
  violetSoft: 'rgba(109, 79, 240, 0.18)',
  sky: Palette.sky[300],
  skySoft: 'rgba(56, 173, 255, 0.12)',

  overlay: 'rgba(14, 168, 145, 0.08)',
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
