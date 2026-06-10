// ANCHOR motion design system. Motion communicates exactly three things:
// progress, response, and celebration. Nothing else.
//
// Principles:
// 1. Fast in, slow out — elements arrive quickly, settle gently.
// 2. Spring physics for interactive responses — feels alive.
// 3. Celebration animations are big and brief — joyful, not annoying.
// 4. Always respect the reduce-motion setting (see useReducedMotion).

import { Easing } from 'react-native';

export const Motion = {
  duration: {
    instant: 100,    // immediate feedback (button press flash)
    quick: 200,      // state changes, toggles
    standard: 300,   // screen transitions, card appears
    deliberate: 500, // important moments (check-in submitted)
    celebrate: 800,  // celebration bursts
  },

  easing: {
    standard: Easing.bezier(0.4, 0, 0.2, 1), // smooth deceleration
    enter: Easing.bezier(0, 0, 0.2, 1),      // arrive with energy
    exit: Easing.bezier(0.4, 0, 1, 1),       // leave quickly, don't linger
    bounce: Easing.bounce,                    // playful — emoji selection
  },

  // Spring configs (Animated.spring supports damping/stiffness/mass).
  spring: {
    default: { damping: 18, stiffness: 200, mass: 0.8 },
    gentle: { damping: 20, stiffness: 120, mass: 1 },    // cards floating in
    bouncy: { damping: 10, stiffness: 180, mass: 0.6 },  // celebrations
    snappy: { damping: 25, stiffness: 300, mass: 0.5 },  // immediate feedback
  },
} as const;
