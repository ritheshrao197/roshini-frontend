"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion as useMotionReducedMotion } from "motion/react";

interface ParallaxLayerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Total px of vertical drift as the layer crosses the viewport. */
  range?: number;
}

/**
 * Wraps a large hero/lifestyle/product-storytelling image so it drifts slightly
 * slower than the page as it scrolls through the viewport. Not meant to be applied
 * to every image — only a handful of deliberate storytelling moments.
 * Auto-disabled under prefers-reduced-motion.
 */
export default function ParallaxLayer({ children, className = "", style, range = 40 }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useMotionReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-range / 2, range / 2]);

  return (
    <div ref={ref} className={className} style={{ ...style, overflow: "hidden" }}>
      <motion.div style={{ y, willChange: "transform" }}>{children}</motion.div>
    </div>
  );
}
