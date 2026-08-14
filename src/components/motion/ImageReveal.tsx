"use client";

import React from "react";
import { motion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

interface ImageRevealProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  /** Direction the mask wipes open from. */
  from?: "left" | "right";
}

/**
 * Editorial-style image reveal: container clip-path wipes open while the image
 * inside settles from a slight scale-up, once, on scroll into view.
 */
export default function ImageReveal({
  children,
  className = "",
  style,
  delay = 0,
  from = "left",
}: ImageRevealProps) {
  const hiddenClip = from === "left" ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)";

  return (
    <motion.div
      className={className}
      style={{ ...style, overflow: "hidden" }}
      initial={{ clipPath: hiddenClip }}
      whileInView={{ clipPath: "inset(0 0 0 0)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      <motion.div
        style={{ width: "100%", height: "100%" }}
        initial={{ scale: 1.08 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 1.1, ease: EASE, delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
