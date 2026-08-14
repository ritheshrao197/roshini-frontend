# Ingredient Gallery + Grain-to-Blend Storytelling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consume the new `ingredients` API (built in the sibling `server/` repo's plan) to render an illustrated ingredient gallery and a cinematic GRAIN→NUT→SEED→BLEND GSAP storytelling sequence on the homepage, replacing the empty `#ingredients` placeholder from Phase 1/2.

**Architecture:** A small family of parametrized SVG icon primitives (not 17 bespoke illustrations), a card-grid gallery section using existing Motion primitives (`StaggerGroup`/`StaggerItem`/`RevealText`), and a pinned GSAP ScrollTrigger sequence using the same `useGsapContext` pattern already reviewed and proven in `HeroSlider.tsx`. Both new sections join `FIXED_SECTIONS` from the start — Phase 2 learned the hard way that anything meant to always render must bypass the CMS `sections` gate, not be added only to `DEFAULT_LAYOUT`.

**Tech Stack:** Next.js 16, React 19, `motion/react`, `gsap`+`ScrollTrigger` — all already installed, no new dependency.

**Spec:** `docs/superpowers/specs/2026-08-14-ingredients-storytelling-design.md`

## Global Constraints

- No new npm dependency.
- `client-next` has no configured test runner — verification is `npm run lint`, `npm run build`, and manual `npm run dev` checks.
- Never touch: `src/lib/cart.ts`, payment/checkout code, auth, SEO metadata, `server/` (a separate plan/repo covers the backend).
- **Do not create, modify, or import from** `src/components/home/IngredientShowcaseSection.tsx`, `ProductStorytellingSection.tsx`, or any of the other unexplained untracked files found during Phase 2 (`AbstractBackground.tsx`, `ArtBackground.tsx`, `GoldParticles.tsx`, `HeritageMarquee.tsx`, `KarnatakaHeritageStrip.tsx`, `CustomCursor.tsx`, `IntroLoader.tsx`). This plan's components are named `IngredientGallerySection.tsx` and `GrainToBlendStorySection.tsx` specifically to avoid collision — do not rename them to anything closer to the unexplained files' names.
- `package.json`'s version field changes on every commit — a pre-commit hook, not a scope violation, do not flag it.
- This plan depends on the sibling `server/` repo's `2026-08-14-ingredients-resource.md` plan being complete and its seed script run — `GET /api/ingredients` must return the 17 seeded ingredients before Task 6's verification can pass. Tasks 1-5 can be implemented and lint/build-verified independently of the backend being ready (the components degrade gracefully to an empty array), but full manual verification needs the real API.
- Icon keys used in `ICON_MAP` (Task 2) MUST exactly match the `iconKey` values seeded by the server plan's `seed-ingredients.js`: `grain-jowar`, `grain-brown-top-millet`, `grain-foxtail-millet`, `grain-pearl-millet`, `grain-kodo-millet`, `grain-proso-millet`, `grain-little-millet`, `grain-barnyard-millet`, `nut-almond`, `nut-pistachio`, `nut-cashew`, `seed-pumpkin`, `seed-chia`, `seed-flax`, `seed-watermelon`, `pod-dates`, `pod-peanuts`. A mismatch here means a card renders with no icon — this is the single most important cross-repo consistency point in this plan.

---

### Task 1: API layer — `Ingredient` type + `getIngredients()`

**Files:**
- Modify: `src/lib/api.ts`

**Interfaces:**
- Produces: `interface Ingredient { _id: string; name: string; category: "millet" | "nut" | "seed" | "other"; description: string; iconKey: string; displayOrder: number }`, `async function getIngredients(): Promise<Ingredient[]>`, and `ingredients: Ingredient[]` added to `HomePageData`. Tasks 3 and 4 both consume `Ingredient` and the data it carries.

- [ ] **Step 1: Add the `Ingredient` interface and `getIngredients()`**

In `src/lib/api.ts`, immediately after the existing `Achievement` interface + `getAchievements()` function (search for `export async function getAchievements()`), add:

```typescript
export interface Ingredient {
  _id: string;
  name: string;
  category: "millet" | "nut" | "seed" | "other";
  description: string;
  iconKey: string;
  displayOrder: number;
}

export async function getIngredients(): Promise<Ingredient[]> {
  try {
    const res = await fetchPublicWithTimeout(`${API_URL}/ingredients`, {
      next: { revalidate: 600, tags: ["ingredients"] },
    });
    if (!res.ok) throw new Error("Failed to fetch ingredients");
    const data = await res.json();
    return data.ingredients || [];
  } catch (err) {
    console.error("getIngredients Error:", err);
    return [];
  }
}
```

- [ ] **Step 2: Extend `HomePageData` and its fallback path**

In the `HomePageData` interface (search for `export interface HomePageData`), add a field:

```typescript
export interface HomePageData {
  products: Product[];
  categories: Category[];
  achievements: Achievement[];
  ingredients: Ingredient[];
  heroSliders: any[];
  sections: any[];
  vlogs: Vlog[];
}
```

In `getHomePageData()`'s catch-block fallback (the `Promise.all([getFeaturedProducts(), getCategories(), getAchievements(), ...])` block), add `getIngredients()` to the array and destructure it:

```typescript
    const [products, categories, achievements, ingredients, heroSliders, sections, vlogsData] = await Promise.all([
      getFeaturedProducts(),
      getCategories(),
      getAchievements(),
      getIngredients(),
      getHeroSliders(),
      getWebsiteSections(),
      getVlogs(1, 15),
    ]);
```

Then add `ingredients,` to the returned object immediately below (read the exact current return shape first — it should mirror the destructured names).

- [ ] **Step 3: Verify — lint and type-check**

Run: `cd client-next && npm run lint`
Expected: no new errors beyond the established baseline.

- [ ] **Step 4: Verify — dev server (backend not required yet)**

Run: `npm run dev`. `getIngredients()` should resolve to `[]` gracefully if the backend's `/api/ingredients` isn't ready yet (or a real array if the server plan is already done) — either way, no console error should be uncaught, no page crash.

- [ ] **Step 5: Commit**

```bash
git add src/lib/api.ts
git commit -m "feat: add Ingredient type and getIngredients() to the API layer"
```

---

### Task 2: Ingredient icon primitives

**Files:**
- Create: `src/components/decorative/IngredientIcons.tsx`

**Interfaces:**
- Produces: exported `GrainIcon`, `NutIcon`, `SeedIcon`, `PodIcon` components, and `export const ICON_MAP: Record<string, () => React.JSX.Element>` mapping every one of the 17 `iconKey` strings (listed in Global Constraints) to a configured icon. Task 3 imports `ICON_MAP` by name.

- [ ] **Step 1: Create the icon primitives and lookup map**

Create `src/components/decorative/IngredientIcons.tsx`:

```tsx
import React from "react";

const STROKE_WIDTH = 1.1;

interface GrainIconProps {
  /** 0-7 — varies stalk curve and grain spacing per grain type for visual distinction within the family. */
  seed?: number;
}

export function GrainIcon({ seed = 0 }: GrainIconProps) {
  const curve = 6 + (seed % 4) * 2;
  const grainCount = 5 + (seed % 3);
  const positions = Array.from({ length: grainCount }, (_, i) => 6 + i * (28 / grainCount));
  return (
    <svg viewBox="0 0 24 40" fill="none" stroke="currentColor" strokeWidth={STROKE_WIDTH} strokeLinecap="round" className="w-full h-full">
      <path vectorEffect="non-scaling-stroke" d={`M12 38 C ${12 - curve / 2} 30 ${12 + curve / 2} 20 12 2`} />
      {positions.map((y, i) => (
        <g key={i} transform={`translate(12 ${y})`}>
          <ellipse vectorEffect="non-scaling-stroke" cx={i % 2 === 0 ? -3 : 3} cy="0" rx="2.2" ry="1.3" transform={`rotate(${i % 2 === 0 ? -18 : 18})`} />
        </g>
      ))}
    </svg>
  );
}

interface NutIconProps {
  style?: "round" | "oval" | "teardrop";
}

const NUT_SHAPES: Record<NonNullable<NutIconProps["style"]>, string> = {
  round: "M12 4 C 18 4 20 10 20 16 C 20 24 16 28 12 28 C 8 28 4 24 4 16 C 4 10 6 4 12 4 Z",
  oval: "M12 3 C 17 3 19 10 19 17 C 19 24 16 29 12 29 C 8 29 5 24 5 17 C 5 10 7 3 12 3 Z",
  teardrop: "M12 2 C 16 8 20 14 20 20 C 20 25 16 29 12 29 C 8 29 4 25 4 20 C 4 14 8 8 12 2 Z",
};

export function NutIcon({ style = "round" }: NutIconProps) {
  return (
    <svg viewBox="0 0 24 32" fill="none" stroke="currentColor" strokeWidth={STROKE_WIDTH} strokeLinecap="round" className="w-full h-full">
      <path vectorEffect="non-scaling-stroke" d={NUT_SHAPES[style]} />
      <path vectorEffect="non-scaling-stroke" d="M12 8 L12 24" opacity="0.5" />
    </svg>
  );
}

interface SeedIconProps {
  style?: "flat" | "round" | "longOval";
}

const SEED_DIMS: Record<NonNullable<SeedIconProps["style"]>, { rx: number; ry: number }> = {
  flat: { rx: 9, ry: 5 },
  round: { rx: 7, ry: 7 },
  longOval: { rx: 5, ry: 10 },
};

export function SeedIcon({ style = "round" }: SeedIconProps) {
  const { rx, ry } = SEED_DIMS[style];
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={STROKE_WIDTH} className="w-full h-full">
      <ellipse vectorEffect="non-scaling-stroke" cx="12" cy="12" rx={rx} ry={ry} />
      <path vectorEffect="non-scaling-stroke" d={`M12 ${12 - ry} L12 ${12 + ry}`} opacity="0.4" />
    </svg>
  );
}

interface PodIconProps {
  style?: "date" | "peanut";
}

export function PodIcon({ style = "date" }: PodIconProps) {
  if (style === "peanut") {
    return (
      <svg viewBox="0 0 24 34" fill="none" stroke="currentColor" strokeWidth={STROKE_WIDTH} strokeLinecap="round" className="w-full h-full">
        <path vectorEffect="non-scaling-stroke" d="M12 2 C 18 2 19 8 15 11 C 19 13 19 20 15 22 C 19 25 18 32 12 32 C 6 32 5 25 9 22 C 5 20 5 13 9 11 C 5 8 6 2 12 2 Z" />
        <path vectorEffect="non-scaling-stroke" d="M12 11 C 13 11.5 13 12.5 12 13" opacity="0.5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 34" fill="none" stroke="currentColor" strokeWidth={STROKE_WIDTH} strokeLinecap="round" className="w-full h-full">
      <path vectorEffect="non-scaling-stroke" d="M12 3 C 19 8 20 16 17 24 C 15 29 9 29 7 24 C 4 16 5 8 12 3 Z" />
      <path vectorEffect="non-scaling-stroke" d="M8 20 C 10 22 14 22 16 20" opacity="0.4" />
    </svg>
  );
}

/**
 * Maps each ingredient's backend `iconKey` to a configured icon. Keys here
 * MUST exactly match the `iconKey` values in server/seed-ingredients.js —
 * a mismatch means that ingredient's card renders with no icon.
 */
export const ICON_MAP: Record<string, () => React.JSX.Element> = {
  "grain-jowar": () => <GrainIcon seed={0} />,
  "grain-brown-top-millet": () => <GrainIcon seed={1} />,
  "grain-foxtail-millet": () => <GrainIcon seed={2} />,
  "grain-pearl-millet": () => <GrainIcon seed={3} />,
  "grain-kodo-millet": () => <GrainIcon seed={4} />,
  "grain-proso-millet": () => <GrainIcon seed={5} />,
  "grain-little-millet": () => <GrainIcon seed={6} />,
  "grain-barnyard-millet": () => <GrainIcon seed={7} />,
  "nut-almond": () => <NutIcon style="teardrop" />,
  "nut-pistachio": () => <NutIcon style="oval" />,
  "nut-cashew": () => <NutIcon style="round" />,
  "seed-pumpkin": () => <SeedIcon style="flat" />,
  "seed-chia": () => <SeedIcon style="round" />,
  "seed-flax": () => <SeedIcon style="longOval" />,
  "seed-watermelon": () => <SeedIcon style="flat" />,
  "pod-dates": () => <PodIcon style="date" />,
  "pod-peanuts": () => <PodIcon style="peanut" />,
};
```

- [ ] **Step 2: Verify — lint and type-check**

Run: `cd client-next && npm run lint`
Expected: no new errors from this file.

- [ ] **Step 3: Commit**

```bash
git add src/components/decorative/IngredientIcons.tsx
git commit -m "feat: add parametrized ingredient icon primitives (grain/nut/seed/pod) and ICON_MAP"
```

---

### Task 3: Ingredient Gallery section

**Files:**
- Create: `src/components/home/IngredientGallerySection.tsx`

**Interfaces:**
- Consumes: `Ingredient` type (Task 1), `ICON_MAP` (Task 2), `RevealText` (existing), `StaggerGroup`/`StaggerItem` (existing, from `src/components/motion/FadeUp.tsx`).
- Produces: default-exported `IngredientGallerySection({ ingredients }: { ingredients: Ingredient[] })`. Task 5 renders it with real data from `getHomePageData()`.

- [ ] **Step 1: Create the section component**

Create `src/components/home/IngredientGallerySection.tsx`:

```tsx
"use client";

import React from "react";
import RevealText from "@/components/motion/RevealText";
import { StaggerGroup, StaggerItem } from "@/components/motion/FadeUp";
import { ICON_MAP } from "@/components/decorative/IngredientIcons";
import type { Ingredient } from "@/lib/api";

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
            const Icon = ICON_MAP[ingredient.iconKey];
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
```

Note: `id="ingredients"` moves onto this section's root — this is the real target for the Phase 1 nav's "Ingredients" link, replacing the empty placeholder div Task 5 removes.

- [ ] **Step 2: Verify — lint and type-check**

Run: `cd client-next && npm run lint`
Expected: no new errors beyond baseline.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/IngredientGallerySection.tsx
git commit -m "feat: add IngredientGallerySection (card grid with staggered entrance)"
```

(No visual verification yet — nothing renders this with real props until Task 5.)

---

### Task 4: Grain-to-Blend storytelling sequence

**Files:**
- Create: `src/components/home/GrainToBlendStorySection.tsx`

**Interfaces:**
- Consumes: `useGsapContext`, `gsap` (`src/lib/gsapUtils.ts`), `useReducedMotion` (`src/lib/useMotionPrefs.ts`), `GrainIcon`/`NutIcon`/`SeedIcon` (Task 2), `Product` type (`src/lib/api.ts`).
- Produces: default-exported `GrainToBlendStorySection({ product }: { product: Product | null })`. Task 5 renders it, passing the homepage's flagship product.

- [ ] **Step 1: Create the section component**

Create `src/components/home/GrainToBlendStorySection.tsx`:

```tsx
"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useGsapContext, gsap } from "@/lib/gsapUtils";
import { useReducedMotion } from "@/lib/useMotionPrefs";
import { GrainIcon, NutIcon, SeedIcon } from "@/components/decorative/IngredientIcons";
import type { Product } from "@/lib/api";

export default function GrainToBlendStorySection({ product }: { product: Product | null }) {
  const sectionRef = useRef<HTMLElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);
  const nutRef = useRef<HTMLDivElement>(null);
  const seedRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const finalRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useGsapContext(
    sectionRef,
    () => {
      if (reduceMotion) return;

      // Pinned, scroll-scrubbed convergence — desktop/tablet only (matches the
      // hero's precedent for scrub-driven sequences: scrub costs battery and
      // reads as jank on the devices least able to spare it).
      gsap.matchMedia().add("(min-width: 768px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=200%",
            scrub: true,
            pin: true,
          },
        });

        tl.to(grainRef.current, { x: 0, y: 0, scale: 0.6, opacity: 0.4, duration: 1 }, 0)
          .to(nutRef.current, { x: 0, y: 0, scale: 0.6, opacity: 0.4, duration: 1 }, 0)
          .to(seedRef.current, { x: 0, y: 0, scale: 0.6, opacity: 0.4, duration: 1 }, 0)
          .to(productRef.current, { scale: 1, opacity: 1, duration: 1 }, 0.4)
          .to(labelRef.current, { opacity: 0, duration: 0.3 }, 0.5)
          .fromTo(finalRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, 0.7);
      });
    },
    [reduceMotion]
  );

  const flagshipImage =
    product?.image?.secureUrl ||
    product?.images?.[0]?.secureUrl ||
    null;
  const flagshipHref = product ? `/product/${product.slug || product._id}` : "/shop";

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-24 md:py-0 md:h-screen flex items-center justify-center"
      style={{ background: "var(--color-espresso)" }}
    >
      <div ref={labelRef} className="absolute top-12 left-1/2 -translate-x-1/2 text-center">
        <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "var(--nav-on-hero)" }}>
          Grain &middot; Nut &middot; Seed &middot; Blend
        </span>
      </div>

      <div ref={grainRef} className="absolute top-[15%] left-[15%] w-16 h-16 md:w-24 md:h-24" style={{ color: "var(--color-premium-gold)" }} aria-hidden="true">
        <GrainIcon seed={0} />
      </div>
      <div ref={nutRef} className="absolute top-[20%] right-[15%] w-16 h-16 md:w-24 md:h-24" style={{ color: "var(--color-premium-gold)" }} aria-hidden="true">
        <NutIcon style="teardrop" />
      </div>
      <div ref={seedRef} className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-16 h-16 md:w-24 md:h-24" style={{ color: "var(--color-premium-gold)" }} aria-hidden="true">
        <SeedIcon style="round" />
      </div>

      <div ref={productRef} className="relative z-10 flex flex-col items-center text-center px-6">
        {flagshipImage && (
          <div className="relative w-48 h-48 md:w-64 md:h-64 mb-8">
            <img src={flagshipImage} alt={product?.pName || "Roshini's Nutrimix"} className="w-full h-full object-contain drop-shadow-2xl" />
          </div>
        )}
        <div ref={finalRef}>
          <p className="text-lg md:text-2xl font-serif mb-6" style={{ color: "var(--nav-on-hero)" }}>
            Made thoughtfully for everyday nourishment.
          </p>
          <Link href={flagshipHref} className="btn-primary btn-lg rounded-xl">
            SHOP NOW
          </Link>
        </div>
      </div>
    </section>
  );
}
```

Note on reduced-motion correctness (verify this holds, don't just assume): when `reduceMotion` is true, no GSAP code runs at all — `grainRef`/`nutRef`/`seedRef` stay at their natural CSS-declared scattered positions and full opacity (no inline style ever sets them otherwise), and `finalRef` (the statement + CTA) stays at its natural, fully-visible state, since nothing ever applies an `opacity:0` to it outside the GSAP timeline. This is different from Motion-based components (which need explicit `initial={false}` to avoid an SSR-baked hidden state) — here, simply never running the GSAP setup is sufficient, because GSAP animations are applied imperatively after mount, never baked into the server-rendered HTML. Confirm this reasoning holds in Step 3's verification rather than trusting it blindly.

- [ ] **Step 2: Verify — lint and type-check**

Run: `cd client-next && npm run lint`
Expected: no new errors beyond baseline.

- [ ] **Step 3: Verify — build**

Run: `npm run build`
Expected: succeeds (confirms GSAP's SSR guard in `gsapUtils.ts` still holds for this new usage).

- [ ] **Step 4: Commit**

```bash
git add src/components/home/GrainToBlendStorySection.tsx
git commit -m "feat: add GrainToBlendStorySection (pinned GSAP scroll-convergence sequence)"
```

(No visual verification yet — nothing renders this with real props until Task 5.)

---

### Task 5: Homepage wiring

**Files:**
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `IngredientGallerySection` (Task 3), `GrainToBlendStorySection` (Task 4), `getHomePageData()`'s new `ingredients` field (Task 1, from the sibling `server/` plan's data once seeded).

- [ ] **Step 1: Read the current file first**

`page.tsx` was last touched by Phase 2's final-review fix wave (which introduced `FIXED_SECTIONS`). Read it in full before editing — this task's exact line numbers may have drifted, locate by content.

- [ ] **Step 2: Add imports**

Add near the existing `HeritageIntroSection` import:

```typescript
import IngredientGallerySection from "@/components/home/IngredientGallerySection";
import GrainToBlendStorySection from "@/components/home/GrainToBlendStorySection";
```

- [ ] **Step 3: Destructure `ingredients` from `getHomePageData()`**

In `HomePage()`, add `ingredients` to the existing destructuring assignment:

```typescript
  const { products, categories, achievements, ingredients, heroSliders, sections: apiSections, vlogs } = await getHomePageData();
```

- [ ] **Step 4: Add both new sections to `FIXED_SECTIONS` and render them as fixed JSX**

Update `FIXED_SECTIONS`:

```typescript
const FIXED_SECTIONS = new Set(["hero", "heritage_intro", "ingredient_gallery", "grain_to_blend"]);
```

In the JSX, after `<HeritageIntroSection />` and before the `layout.filter(...).map(...)` block, add both new sections as fixed elements:

```tsx
      <HeroSlider sliders={heroSliders} products={products} />
      <HeritageIntroSection />
      <IngredientGallerySection ingredients={ingredients} />
      <GrainToBlendStorySection product={products?.find((p) => /nutrimix/i.test(p.pName)) || products?.[0] || null} />
      {layout
        .filter((section) => !FIXED_SECTIONS.has(section.sectionId))
        .map((section, index) => {
```

(Match the flagship-product lookup to the exact same pattern `HeroSlider.tsx`'s fallback branch already uses — `/nutrimix/i` regex against `pName`, falling back to the first product — for consistency, not a new heuristic.)

- [ ] **Step 5: Remove the old `#ingredients` placeholder**

In the `"featured_products"` switch case, remove the now-redundant placeholder anchor (the section's real `id="ingredients"` now lives on `IngredientGallerySection`'s root, added in Task 3):

```tsx
          case "featured_products":
            return <FeaturedProductsSection key={`products-${index}`} products={products} />;
```

(Removing the `<div id="ingredients" aria-hidden="true" />` and the `React.Fragment` wrapper it required — `FeaturedProductsSection` goes back to a plain `case` return, matching the other simple cases.)

- [ ] **Step 6: Verify — lint and type-check**

Run: `cd client-next && npm run lint`
Expected: no new errors beyond baseline.

- [ ] **Step 7: Verify — visual smoke check (real backend required for full verification)**

Run: `npm run dev` against the real backend (with the sibling `server/` plan's seed script already run). Confirm:
- Ingredient Gallery renders between Featured Products and Why-Us (or wherever Task 4/5's insertion point actually lands relative to the rest of the CMS-driven sections — confirm the visual order makes sense), with all 17 cards showing correct icons/names/descriptions, staggered entrance on scroll.
- Grain-to-Blend section renders after it, pins on scroll (desktop), converges the three category icons toward the product image, reveals the final statement + CTA.
- `/#ingredients` (the Phase 1 nav link) now scrolls to the real gallery section, not an empty placeholder.
- Both sections render **regardless of CMS `sections` state** — this is the Phase 2 lesson. If a real, populated `sections` collection exists in the backend (predating this plan, same as Phase 2 encountered), confirm both new sections still appear; don't just test against the empty-CMS `DEFAULT_LAYOUT` path.
- If the backend isn't ready yet in this environment: confirm `IngredientGallerySection` gracefully renders nothing (its `if (!ingredients?.length) return null;` guard) rather than crashing, and note this explicitly in the report as "not fully verifiable in this environment" rather than silently skipping.

- [ ] **Step 8: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: wire IngredientGallerySection and GrainToBlendStorySection into the homepage as fixed sections"
```

---

### Task 6: Full verification pass

**Files:** none (verification only)

**Interfaces:** none.

- [ ] **Step 1: Install and lint**

Run: `cd client-next && npm install && npm run lint`
Expected: no new dependency added; lint matches the established baseline.

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: succeeds, no type errors, all routes generate.

- [ ] **Step 3: Full manual walkthrough (against the real, seeded backend)**

1. Homepage: both new sections render, in the right position, with real data.
2. Ingredient Gallery: all 17 icons render (none blank — this is the cross-repo `iconKey` consistency check from Global Constraints), staggered entrance plays once on scroll into view.
3. Grain-to-Blend: pins and scrubs correctly on desktop/tablet (≥768px), does NOT pin/scrub on mobile (<768px — confirm via the `gsap.matchMedia` gate), final statement + CTA are reachable and functional (CTA navigates to the flagship product or `/shop`).
4. `prefers-reduced-motion`: Ingredient Gallery cards appear instantly (no stagger animation); Grain-to-Blend section shows its natural scattered layout with the final statement + CTA immediately visible, no pin/scrub.
5. Navigate away from `/` and back — no console errors from a stale `ScrollTrigger` (same check Phase 2's Task 4 established for the hero).
6. `/#ingredients` scrolls to the real gallery section.
7. Confirm nothing from Phase 1/2 regressed (header, hero, heritage intro all still work as before).
8. Confirm the unrelated, unexplained files from Phase 2's discovery are still untouched (`git status` should show them as the same untracked files, not modified by this plan).

- [ ] **Step 4: Confirm workspace hygiene**

Run: `git status` — confirm only the files this plan's tasks listed changed (plus the known unrelated untracked files, which should remain untouched and unmodified).

- [ ] **Step 5: Report**

No commit for this task (verification-only) — record results, including explicitly noting whether the real backend was available for full verification or whether any step had to be marked "not verifiable in this environment."
