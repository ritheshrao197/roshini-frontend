/**
 * Central timing/easing tokens shared by Motion (React components), GSAP
 * (cinematic scroll sequences), and plain CSS transitions. Values mirror the
 * duration/ease custom properties in globals.css so all three motion layers
 * stay visually consistent — this is the single source of truth, don't
 * hand-roll durations/eases elsewhere.
 */

export const motionConfig = {
  duration: {
    fast: 0.15,
    normal: 0.4,
    slow: 0.7,
    cinematic: 1.0,
  },
  ease: {
    // Matches --ease-default in globals.css
    smooth: [0.22, 1, 0.36, 1] as const,
    // Matches --ease-out
    soft: [0, 0, 0.2, 1] as const,
    // Matches --ease-bounce — reserved for playful micro-interactions, not cinematic moments
    bounce: [0.34, 1.56, 0.64, 1] as const,
  },
  stagger: {
    tight: 0.08,
    normal: 0.1,
    loose: 0.12,
  },
} as const;

/** GSAP wants plain "power2.out"-style strings or cubic-bezier(), not arrays. */
export const gsapEase = {
  smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
  soft: "cubic-bezier(0, 0, 0.2, 1)",
} as const;
