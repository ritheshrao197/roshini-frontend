"use client";

import { useLayoutEffect, type RefObject, type DependencyList } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

/**
 * Runs `setup(context)` inside a gsap.context() scoped to `scopeRef`, after
 * layout, and reverts everything it created (tweens, timelines, ScrollTriggers)
 * on unmount or dependency change. This is the one safe way to use GSAP inside
 * a React/Next.js tree — without gsap.context()+revert(), ScrollTriggers created
 * on one page survive client-side navigation and keep firing against DOM nodes
 * that no longer exist.
 *
 * Reserve this for the 2–4 genuinely cinematic, scroll-linked sequences (hero
 * scroll, ingredient→product storytelling) — everything else (cards, buttons,
 * nav, simple reveals) should use Motion or plain CSS instead.
 */
export function useGsapContext(
  scopeRef: RefObject<Element | null>,
  setup: (context: gsap.Context) => void,
  deps: DependencyList = []
) {
  useLayoutEffect(() => {
    if (!scopeRef.current) return;

    const ctx = gsap.context((self) => setup(self), scopeRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
