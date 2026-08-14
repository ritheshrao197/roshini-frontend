"use client";

import { useSyncExternalStore } from "react";

/**
 * Shared media-query gates for the motion system. Consolidates checks that were
 * previously reimplemented ad hoc in MagneticButton / ProductCard / HeroSlider.
 */

function subscribe(query: string) {
  return (onChange: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  };
}

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    subscribe(query),
    () => window.matchMedia(query).matches,
    () => false // SSR snapshot: assume no match until hydrated on the client
  );
}

/** True when the user's OS/browser requests reduced motion. */
export function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** True for mouse/trackpad-style pointers (as opposed to touch). */
export function usePointerFine() {
  return useMediaQuery("(pointer: fine)");
}

/**
 * True when it's safe to run cursor-following / mouse-parallax / tilt effects:
 * a fine pointer is present AND the user hasn't asked for reduced motion.
 */
export function useCanHover() {
  const reduced = useReducedMotion();
  const fine = usePointerFine();
  return fine && !reduced;
}
