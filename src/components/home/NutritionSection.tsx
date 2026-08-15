"use client";

import React from "react";
import { FadeUp, StaggerGroup, StaggerItem } from "@/components/motion/FadeUp";

const NUTRITION_POINTS = [
  {
    stat: "3x",
    title: "Naturally High in Fiber",
    desc: "Millets and whole grains carry significantly more dietary fiber than refined-flour alternatives — supporting digestion the way traditional diets always have.",
  },
  {
    stat: "0g",
    title: "Zero Refined Sugar",
    desc: "Sweetened only with dates, jaggery, and whole fruits — never with refined sugar or artificial sweeteners.",
  },
  {
    stat: "Slow",
    title: "Slow-Release Energy",
    desc: "Complex carbohydrates from whole grains release energy gradually, without the sugar spikes and crashes of refined flour.",
  },
  {
    stat: "100%",
    title: "Stone-Ground, Not Processed",
    desc: "Every batch is stone-ground the traditional way, preserving nutrients that high-heat industrial processing strips away.",
  },
];

export default function NutritionSection() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8" style={{ background: "var(--surface-2)" }}>
      <div className="max-w-7xl mx-auto">
        <FadeUp className="text-center mb-12 md:mb-16">
          <span className="section-label">Nourishment You Can Trust</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-2" style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--color-espresso)" }}>
            What Makes It Wholesome
          </h2>
        </FadeUp>
        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {NUTRITION_POINTS.map((point) => (
            <StaggerItem
              key={point.title}
              className="flex flex-col items-center text-center p-6 sm:p-8"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <span
                className="text-3xl md:text-4xl font-bold mb-3"
                style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--color-terracotta)" }}
              >
                {point.stat}
              </span>
              <h3 className="font-bold text-lg mb-2" style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--color-espresso)" }}>
                {point.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {point.desc}
              </p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
