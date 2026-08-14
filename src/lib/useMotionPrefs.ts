"use client";

import { useMemo, useSyncExternalStore } from "react";

/**
 * Shared media-query gates for the motion system. Consolidates checks that were
 * previously reimplemented ad hoc in MagneticButton / ProductCard / HeroSlider.
 */

function makeSubscribe(query: string) {
  return (onChange: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  };
}

/**
 * The subscribe/getSnapshot pair is memoized on `query`: useSyncExternalStore
 * re-subscribes whenever the `subscribe` identity changes, so passing freshly
 * built closures on every render tore down and re-added the matchMedia listener
 * on each re-render. Stable identities mean one listener per query, for the
 * lifetime of the component.
 */
function useMediaQuery(query: string) {
  const [subscribe, getSnapshot] = useMemo(
    () => [makeSubscribe(query), () => window.matchMedia(query).matches] as const,
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    getSnapshot,
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
