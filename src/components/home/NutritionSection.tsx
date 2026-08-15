"use client";

import React from "react";
import { FadeUp, StaggerGroup, StaggerItem } from "@/components/motion/FadeUp";

const NUTRITION_POINTS = [
  {
    stat: "01",
    title: "Millet & Grain Goodness",
    desc: "A wholesome blend of millets and grains, thoughtfully combined with nuts and seeds for everyday nourishment.",
  },
  {
    stat: "02",
    title: "Rich in Goodness",
    desc: "A carefully selected combination of nuts, seeds, grains and millets, bringing a variety of naturally occurring nutrients to your everyday meals.",
  },
  {
    stat: "03",
    title: "Made for Everyday Nourishment",
    desc: "Simple, wholesome ingredients crafted into a convenient blend that fits effortlessly into your family's daily routine.",
  },
  {
    stat: "04",
    title: "Inspired by Tradition",
    desc: "Rooted in India's rich food traditions, our blends bring the goodness of time-tested ingredients to modern family kitchens.",
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
