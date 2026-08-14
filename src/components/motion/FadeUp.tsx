"use client";

import React from "react";
import { motion, type Variants } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

interface FadeUpProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Delay in seconds before this element's own animation starts. */
  delay?: number;
  /** Vertical travel distance in px. */
  distance?: number;
  /** Animation duration in seconds. */
  duration?: number;
  as?: "div" | "li" | "article";
  /**
   * Pass `false` to opt out of the hidden initial state, so the element renders at
   * its natural (visible) position from the very first paint — server-rendered HTML
   * included. Required for SSR-critical, above-the-fold content, which must not be
   * `opacity: 0` until hydration completes. Omit for the default fade-up-on-scroll.
   */
  initial?: false;
}

/**
 * Single fade-up-on-scroll element. The `motion` sibling to ScrollReveal, for
 * spots that need explicit per-item delay/stagger control rather than nth-child CSS.
 */
export function FadeUp({
  children,
  className = "",
  style,
  delay = 0,
  distance = 24,
  duration = 0.6,
  as = "div",
  initial,
}: FadeUpProps) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      style={style}
      initial={initial === false ? false : { opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration, ease: EASE, delay }}
    >
      {children}
    </Tag>
  );
}

interface StaggerGroupProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Delay between each direct child's entrance, in seconds. */
  staggerDelay?: number;
  as?: "div" | "ul";
}

const containerVariants = (staggerDelay: number): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: staggerDelay },
  },
});

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/**
 * Wrap a grid/list of items; each direct child should be a `<FadeUp.Item>` (or use
 * `itemVariants`-compatible motion element) — they'll stagger in together once the
 * group enters the viewport, replaying only once.
 */
export function StaggerGroup({
  children,
  className = "",
  style,
  staggerDelay = 0.1,
  as = "div",
}: StaggerGroupProps) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      style={style}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={containerVariants(staggerDelay)}
    >
      {children}
    </Tag>
  );
}

export function StaggerItem({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div className={className} style={style} variants={itemVariants}>
      {children}
    </motion.div>
  );
}

export default FadeUp;
