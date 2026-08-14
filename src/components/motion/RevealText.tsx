"use client";

import React from "react";
import { motion } from "motion/react";

interface RevealTextProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "h4" | "span" | "p";
  className?: string;
  style?: React.CSSProperties;
  /** Split by "word" (default) or "line" (whole string as one line). */
  by?: "word" | "line";
  /** Stagger between words/lines, in seconds. */
  stagger?: number;
  /** Delay before the first word/line starts, in seconds. */
  delay?: number;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Premium heading reveal: splits text into words (or treats it as one line),
 * each wrapped in an overflow-hidden mask, animating translateY(100%) -> 0 + opacity.
 * Triggers once when scrolled into view.
 */
export default function RevealText({
  children,
  as = "h2",
  className = "",
  style,
  by = "word",
  stagger = 0.045,
  delay = 0,
}: RevealTextProps) {
  const Tag = motion[as];
  const pieces = by === "word" ? children.split(" ") : [children];

  return (
    <Tag className={className} style={style}>
      {pieces.map((piece, i) => (
        <span
          key={i}
          style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top" }}
        >
          <motion.span
            style={{ display: "inline-block", willChange: "transform" }}
            initial={{ y: "100%", opacity: 0 }}
            whileInView={{ y: "0%", opacity: 1 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.7, ease: EASE, delay: delay + i * stagger }}
          >
            {piece}
            {by === "word" && i < pieces.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
