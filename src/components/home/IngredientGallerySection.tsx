"use client";

import React from "react";
import RevealText from "@/components/motion/RevealText";
import { StaggerGroup, StaggerItem } from "@/components/motion/FadeUp";
import { ICON_MAP, GrainIcon, NutIcon, SeedIcon, PodIcon } from "@/components/decorative/IngredientIcons";
import type { Ingredient } from "@/lib/api";

/**
 * Last-resort icon when an ingredient's `iconKey` isn't in `ICON_MAP` — e.g. an
 * admin creates an ingredient via `POST /api/admin/ingredients` with a new key
 * before a matching icon primitive exists. Falls back on the ingredient's
 * `category`, which is a closed union, so this map is always total.
 */
const FALLBACK_BY_CATEGORY: Record<Ingredient["category"], () => React.JSX.Element> = {
  millet: () => <GrainIcon />,
  nut: () => <NutIcon />,
  seed: () => <SeedIcon />,
  other: () => <PodIcon />,
};

export default function IngredientGallerySection({ ingredients }: { ingredients: Ingredient[] }) {
  if (!ingredients?.length) return null;

  return (
    <section id="ingredients" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8" style={{ background: "var(--bg-alt)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <span className="section-label">Thoughtfully Sourced</span>
          <RevealText as="h2" className="display-heading text-[var(--color-espresso)] mt-2">
            Grains, nuts and seeds, chosen with care.
          </RevealText>
        </div>

        <StaggerGroup as="div" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6" staggerDelay={0.09}>
          {ingredients.map((ingredient) => {
            const Icon = ICON_MAP[ingredient.iconKey] ?? FALLBACK_BY_CATEGORY[ingredient.category];
            return (
              <StaggerItem key={ingredient._id} className="rounded-2xl p-5 text-center" style={{ background: "var(--surface)", border: "1px solid var(--color-border)" }}>
                <div className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--color-secondary-brown)" }} aria-hidden="true">
                  {Icon ? <Icon /> : null}
                </div>
                <h3 className="font-serif font-semibold text-sm text-[var(--color-espresso)]">{ingredient.name}</h3>
                <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "var(--text-muted)" }}>{ingredient.description}</p>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
