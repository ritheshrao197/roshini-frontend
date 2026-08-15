"use client";

import React from "react";
import { motion } from "motion/react";
import IndianBorder from "@/components/decorative/IndianBorder";
import { LotusBloom } from "@/components/decorative/HeroBotanicals";

export default function HeritageIntroSection() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8" style={{ background: "var(--bg)" }}>
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scaleX: 0.6 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "center" }}
        >
          <IndianBorder variant="botanical" position="top" className="mb-8" />
        </motion.div>

        <motion.div
          className="w-10 h-10 mx-auto mb-6"
          style={{ color: "var(--color-premium-gold)" }}
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 0.85, scale: 1 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          aria-hidden="true"
        >
          <LotusBloom />
        </motion.div>

        <motion.p
          className="display-heading text-[var(--color-espresso)]"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          Born from the grains, nuts and seeds that have nourished Indian
          kitchens for generations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scaleX: 0.6 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          style={{ transformOrigin: "center" }}
        >
          <IndianBorder variant="kolam" position="bottom" className="mt-8" />
        </motion.div>
      </div>
    </section>
  );
}
