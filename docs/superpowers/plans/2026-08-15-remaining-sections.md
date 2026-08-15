# Phase 4 Client: Remaining Sections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign Why-Us, Brand Story, Testimonials, Newsletter (as a Final CTA), and the Footer onto the heritage visual language and Motion animation system; add two new sections (Nutrition, Marquee); wire everything into `page.tsx`.

**Architecture:** Section components stay in `src/components/home/HomeSections.tsx` where they already live (Why-Us, Brand Story, Testimonials, Newsletter — restyled in place, not moved), except the two new sections (own files, matching Phase 3's convention of one file per new section) and the Footer (extracted to `src/components/partials/Footer.tsx`, matching where `Header.tsx` lives). Entrance animation goes through the existing `FadeUp`/`StaggerGroup`/`StaggerItem` primitives (`src/components/motion/FadeUp.tsx`) — already covered by the site-wide `<MotionConfig reducedMotion="user">` for reduced-motion, no new work needed there. The Marquee's continuous scroll is the one exception requiring its own explicit reduced-motion handling (a continuous animation isn't "one entrance that plays once," so `MotionConfig`'s trigger-based gating doesn't fully cover it).

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind v4, `motion/react`, existing heritage design tokens in `globals.css`.

**Spec:** `docs/superpowers/specs/2026-08-15-phase4-remaining-sections-design.md`

**Depends on:** the sibling `server/` repo's plan (`docs/superpowers/plans/2026-08-15-testimonials-and-sections.md`) must be complete and verified — Task 1 and Task 5 of this plan consume live `/api/testimonials` data, and Task 9's final ordering depends on the live `/api/sections` collection actually containing `nutrition`/`marquee`.

## Global Constraints

- Never `git add .` / `git add -A` — stage files individually by exact path. This repo has **9 known unrelated untracked foreign files** that must never be staged: `src/components/common/CustomCursor.tsx`, `src/components/common/IntroLoader.tsx`, `src/components/decorative/AbstractBackground.tsx`, `src/components/decorative/ArtBackground.tsx`, `src/components/decorative/GoldParticles.tsx`, `src/components/home/HeritageMarquee.tsx`, `src/components/home/IngredientShowcaseSection.tsx`, `src/components/home/KarnatakaHeritageStrip.tsx`, `src/components/home/ProductStorytellingSection.tsx`. Verify `git show --stat` on every commit before moving on.
- **Do not read, import, or reuse `src/components/home/HeritageMarquee.tsx`** — it's one of the foreign files above (unrelated work-in-progress, its `animate-marquee` CSS class isn't even defined anywhere). Task 6 builds the real marquee as `ValuesMarqueeSection.tsx`.
- `npm run build` is known to fail repo-wide on a pre-existing, unrelated TS error in two of the foreign files above (an invalid `variant="kasuti"` passed to `IndianBorder`) — already independently confirmed multiple times in Phase 3. Not a regression, not this plan's to fix, do not attempt to fix it, do not flag it as a new finding.
- `package.json`'s version field is auto-bumped by the pre-commit hook on every commit — expected, never flag as scope creep.
- All new/touched styling uses the heritage token set already defined in `globals.css` (`--color-espresso`, `--color-ivory`, `--color-terracotta`, `--color-walnut`, `--color-sage`, and their light/dark-mode-aware base tokens) — no new raw hex values, and existing raw hex in Brand Story (Task 4) must be fully eliminated, not left alongside new tokens.
- All new entrance animation uses `FadeUp`/`StaggerGroup`/`StaggerItem` from `src/components/motion/FadeUp.tsx` (already imported elsewhere in the codebase) — not `ScrollReveal`, which these tasks are migrating away from. `ScrollReveal.tsx` itself is not deleted (other, out-of-scope call sites may still use it) — only the call sites this plan touches change.
- `NewsletterForm.tsx`'s hardcoded `http://localhost:8000` fetch URL (rather than using `API_URL`/`NEXT_PUBLIC_API_URL`) is a pre-existing bug, unrelated to this plan's scope (Task 7 restyles `NewsletterSection`'s wrapper, not `NewsletterForm`'s internals) — do not fix it as part of this plan, do not flag it as a new finding.
- Lint baseline: 234 problems (146 errors, 88 warnings) — confirm no new issues introduced by this plan's work at each task and at final verification.

---

### Task 1: API layer — `Testimonial` type + `getTestimonials()`

**Files:**
- Modify: `src/lib/api.ts`

**Interfaces:**
- Produces: `Testimonial` interface, `getTestimonials(): Promise<Testimonial[]>`, `HomePageData.testimonials: Testimonial[]`.

- [ ] **Step 1: Add the `Testimonial` interface and `getTestimonials()` function**

Read the current file first — locate the `Ingredient`/`getIngredients()` pair (currently around lines 334-355) and add this immediately after it, following the exact same pattern:

```typescript
export interface Testimonial {
  _id: string;
  name: string;
  location: string;
  quote: string;
  rating: number;
  avatarInitial: string;
  displayOrder: number;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const res = await fetchPublicWithTimeout(`${API_URL}/testimonials`, {
      next: { revalidate: 600, tags: ["testimonials"] },
    });
    if (!res.ok) throw new Error("Failed to fetch testimonials");
    const data = await res.json();
    return data.testimonials || [];
  } catch (err) {
    console.error("getTestimonials Error:", err);
    return [];
  }
}
```

- [ ] **Step 2: Extend `HomePageData` and `getHomePageData()`**

Locate the `HomePageData` interface (currently lines 397-405) and add `testimonials: Testimonial[];` after `ingredients: Ingredient[];`.

Locate `getHomePageData()`'s catch-block fallback (currently lines 417-436). Add `getTestimonials()` to the `Promise.all` array **in the same relative position** as `testimonials` will occupy in the destructuring and return — immediately after `getIngredients()`:

```typescript
const [products, categories, achievements, ingredients, testimonials, heroSliders, sections, vlogsData] = await Promise.all([
  getFeaturedProducts(),
  getCategories(),
  getAchievements(),
  getIngredients(),
  getTestimonials(),
  getHeroSliders(),
  getWebsiteSections(),
  getVlogs(1, 15),
]);

return {
  products,
  categories,
  achievements,
  ingredients,
  testimonials,
  heroSliders,
  sections,
  vlogs: vlogsData.vlogs || [],
};
```

**Verify after editing:** the Nth name in the destructuring array must correspond to the Nth call in the `Promise.all` array — read the whole edited block back before moving on (this exact class of position mismatch was a real bug caught mid-implementation in Phase 3).

- [ ] **Step 3: Run lint**

Run: `npm run lint`
Expected: no new errors/warnings versus baseline (234/146/88).

- [ ] **Step 4: Run the dev server and verify no TypeScript errors**

Run: `npm run dev`, confirm it starts cleanly (`Ready in ...`), no compile errors. `getTestimonials()` will return `[]` until the server plan's Task 5 has run — that's expected, not a bug here.

- [ ] **Step 5: Commit**

```bash
git add src/lib/api.ts
git commit -m "feat: add Testimonial type and getTestimonials() to the API layer"
```

---

### Task 2: Why-Us — animation migration + illustration accent

**Files:**
- Modify: `src/components/home/HomeSections.tsx` (`WhyUsSection`)

**Interfaces:**
- Consumes: `FadeUp`, `StaggerGroup`, `StaggerItem` from `src/components/motion/FadeUp.tsx`.

**No content changes** — the `WHY_US` array (lines 138-145) and its 6 items are unchanged; only entrance animation and a small illustration accent are added.

- [ ] **Step 1: Add the import**

Near the top of `HomeSections.tsx`, alongside the existing `ScrollReveal` import:

```typescript
import { FadeUp, StaggerGroup, StaggerItem } from "@/components/motion/FadeUp";
import IndianBorder from "@/components/decorative/IndianBorder";
```

(Skip the `IndianBorder` import if it's already present in the file from another section — check first.)

- [ ] **Step 2: Wrap the heading block in `FadeUp`, add a small `IndianBorder` accent**

Read the current `WhyUsSection` function (lines 147-186) in full before editing. Replace the heading block:

```tsx
<div className="text-center mb-12 md:mb-16">
  <span className="section-label">Why Families Trust Us</span>
  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-2" style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--espresso)" }}>
    Why Choose Roshini&rsquo;s?
  </h2>
</div>
```

with:

```tsx
<FadeUp className="text-center mb-12 md:mb-16">
  <span className="section-label">Why Families Trust Us</span>
  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-2" style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--espresso)" }}>
    Why Choose Roshini&rsquo;s?
  </h2>
  <IndianBorder variant="minimal" position="bottom" className="max-w-xs mx-auto mt-6 opacity-60" />
</FadeUp>
```

- [ ] **Step 3: Replace the card grid's wrapper div with `StaggerGroup`/`StaggerItem`**

Replace:

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" style={{ gridAutoRows: "1fr" }}>
  {WHY_US.map((item) => (
    <div
      key={item.title}
      className="flex flex-col p-6 sm:p-8 group hover:-translate-y-1 transition-all"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
```

with:

```tsx
<StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" style={{ gridAutoRows: "1fr" }}>
  {WHY_US.map((item) => (
    <StaggerItem
      key={item.title}
      className="flex flex-col p-6 sm:p-8 group hover:-translate-y-1 transition-all"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
```

And its closing tags: the innermost `</div>` that closes each card becomes `</StaggerItem>`, and the grid's own closing `</div>` becomes `</StaggerGroup>`. Read the full block after editing to confirm every open/close tag matches — `StaggerItem` doesn't accept the `key` outside the mapped array (it belongs on the element returned by `.map()`, exactly where `key` already sits today).

- [ ] **Step 4: Verify visually**

Run `npm run dev`, load the homepage, scroll to Why-Us. Expected: the 6 cards fade/rise in with a staggered delay the first time the section enters the viewport (not on every scroll), a thin botanical divider appears under the heading, hover-lift still works per-card.

- [ ] **Step 5: Commit**

```bash
git add src/components/home/HomeSections.tsx
git commit -m "feat: migrate Why-Us section to Motion animation, add illustration accent"
```

---

### Task 3: Nutrition section (new)

**Files:**
- Create: `src/components/home/NutritionSection.tsx`

**Interfaces:**
- Produces: `NutritionSection` (default export, no props — static curated content, matching `WhyUsSection`'s pattern).
- Consumes: `FadeUp`, `StaggerGroup`, `StaggerItem`.

- [ ] **Step 1: Write the component**

```tsx
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
```

- [ ] **Step 2: Verify visually**

Not yet wired into `page.tsx` (Task 9 does that) — for now, confirm it compiles: `npm run lint` on this file specifically, and `npm run dev` starts with no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/NutritionSection.tsx
git commit -m "feat: add NutritionSection (new editorial section)"
```

---

### Task 4: Brand Story — token migration + animation migration

**Files:**
- Modify: `src/components/home/HomeSections.tsx` (`BrandStorySection`)

**Interfaces:**
- Consumes: `FadeUp`, `StaggerGroup`, `StaggerItem` (already imported by Task 2, if this task runs after it — otherwise add the import per Task 2 Step 1).

**No content changes** — `BRAND_STORY_BEATS` (lines 188-204) unchanged; every raw hex value is replaced with a heritage token, and `ScrollReveal` is replaced with `FadeUp`/`StaggerGroup`/`StaggerItem`.

- [ ] **Step 1: Replace the section background and decorative blob**

Read the current `BrandStorySection` function (lines 206-270) in full before editing. Replace:

```tsx
    <section
      id="brand-story"
      className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #5D310E 0%, #3D1E08 100%)" }}
    >
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle, #C28B36 0%, transparent 70%)" }} />
```

with:

```tsx
    <section
      id="brand-story"
      className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, var(--color-espresso), var(--color-walnut))" }}
    >
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle, var(--color-terracotta) 0%, transparent 70%)" }} />
```

(This background gradient matches the one already used for the hero slide fallback in `globals.css:1765` — visual consistency with the rest of the redesign, not a new pairing.)

- [ ] **Step 2: Replace the intro block's `ScrollReveal` with `FadeUp`, and its raw hex colors**

Replace:

```tsx
        <ScrollReveal>
          <span className="section-label" style={{ color: "#D9AE7A" }}>Why Roshini&rsquo;s?</span>
          <h2
            className="display-heading mt-3 mb-8"
            style={{ color: "#FFFFFF", fontSize: "clamp(2.25rem, 4vw + 1rem, 4rem)" }}
          >
            Wholesome food.
            <br />
            Made with intention.
          </h2>
          <p className="text-base sm:text-lg leading-relaxed max-w-2xl" style={{ color: "#F3E8DC" }}>
            Roshini&rsquo;s Home Products is a women-led, family-run wellness brand dedicated to creating natural, preservative-free food inspired by India&rsquo;s everyday traditions — not a lab-formulated health product.
          </p>
        </ScrollReveal>
```

with:

```tsx
        <FadeUp>
          <span className="section-label" style={{ color: "var(--color-terracotta)" }}>Why Roshini&rsquo;s?</span>
          <h2
            className="display-heading mt-3 mb-8"
            style={{ color: "var(--color-ivory)", fontSize: "clamp(2.25rem, 4vw + 1rem, 4rem)" }}
          >
            Wholesome food.
            <br />
            Made with intention.
          </h2>
          <p className="text-base sm:text-lg leading-relaxed max-w-2xl" style={{ color: "color-mix(in srgb, var(--color-ivory) 90%, transparent)" }}>
            Roshini&rsquo;s Home Products is a women-led, family-run wellness brand dedicated to creating natural, preservative-free food inspired by India&rsquo;s everyday traditions — not a lab-formulated health product.
          </p>
        </FadeUp>
```

- [ ] **Step 3: Replace the beats grid — `ScrollReveal` per-item to `StaggerGroup`/`StaggerItem`, raw hex to tokens**

Replace:

```tsx
        <div className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {BRAND_STORY_BEATS.map((beat) => (
            <ScrollReveal
              key={beat.index}
              className="pt-6"
              style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}
              as="div"
            >
              <span className="block text-sm font-mono mb-3" style={{ color: "#C28B36" }}>
                {beat.index}
              </span>
              <h3
                className="text-xl md:text-2xl font-bold mb-3"
                style={{ fontFamily: "var(--font-serif)", color: "#FFFFFF" }}
              >
                {beat.title}
              </h3>
              <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#DCC8AE" }}>
                {beat.body}
              </p>
            </ScrollReveal>
          ))}
        </div>
```

with:

```tsx
        <StaggerGroup className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {BRAND_STORY_BEATS.map((beat) => (
            <StaggerItem
              key={beat.index}
              className="pt-6"
              style={{ borderTop: "1px solid color-mix(in srgb, var(--color-ivory) 15%, transparent)" }}
            >
              <span className="block text-sm font-mono mb-3" style={{ color: "var(--color-terracotta)" }}>
                {beat.index}
              </span>
              <h3
                className="text-xl md:text-2xl font-bold mb-3"
                style={{ fontFamily: "var(--font-serif)", color: "var(--color-ivory)" }}
              >
                {beat.title}
              </h3>
              <p className="text-sm sm:text-base leading-relaxed" style={{ color: "color-mix(in srgb, var(--color-ivory) 80%, transparent)" }}>
                {beat.body}
              </p>
            </StaggerItem>
          ))}
        </StaggerGroup>
```

- [ ] **Step 4: Replace the CTA button's raw hex**

Replace:

```tsx
        <div className="mt-16 md:mt-20">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 text-sm font-bold tracking-wide rounded-xl transition-all shadow-lg hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
            style={{ background: "#C28B36", color: "#FFFFFF", boxShadow: "0 10px 25px rgba(61, 30, 8, 0.4)" }}
          >
```

with:

```tsx
        <FadeUp className="mt-16 md:mt-20">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 text-sm font-bold tracking-wide rounded-xl transition-all shadow-lg hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
            style={{ background: "var(--color-terracotta)", color: "var(--color-ivory)", boxShadow: "0 10px 25px color-mix(in srgb, var(--color-espresso) 40%, transparent)" }}
          >
```

(matching the `<div>` → `FadeUp` change, close the tag as `</FadeUp>` instead of `</div>` at the end of this block.)

- [ ] **Step 5: Verify no raw hex remains**

Run: `grep -n '#[0-9A-Fa-f]\{6\}' src/components/home/HomeSections.tsx` (or search manually) restricted to the `BrandStorySection` function body. Expected: zero matches inside that function (matches elsewhere in the file, in other sections not touched by this task, are fine and out of scope).

- [ ] **Step 6: Verify visually**

`npm run dev`, scroll to Brand Story. Expected: dark espresso-to-walnut gradient background (visually similar to before, now token-driven), text fades/staggers in on scroll, no color regression, CTA button still styled prominently.

- [ ] **Step 7: Commit**

```bash
git add src/components/home/HomeSections.tsx
git commit -m "fix: migrate Brand Story to heritage tokens and Motion animation"
```

---

### Task 5: Testimonials — backend-driven + restyle + animation

**Files:**
- Modify: `src/components/home/HomeSections.tsx` (`TestimonialsSection`)

**Interfaces:**
- Consumes: `Testimonial` type from `src/lib/api.ts` (Task 1).
- Produces: `TestimonialsSection({ testimonials }: { testimonials: Testimonial[] })` — signature change from no-props.

- [ ] **Step 1: Add the import and remove the hardcoded array**

Add to the imports at the top of `HomeSections.tsx`:

```typescript
import type { Testimonial } from "@/lib/api";
```

Delete the hardcoded `TESTIMONIALS` const (currently lines 345-349) — it's now replaced by live data.

- [ ] **Step 2: Rewrite the section to accept and render `testimonials`, with heritage tokens and Motion**

Read the current `TestimonialsSection` function (lines 351-389) in full, then replace the whole function with:

```tsx
export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8" style={{ background: "var(--surface-2)" }}>
      <div className="max-w-6xl mx-auto">
        <FadeUp>
          <span className="section-label">Real Customers, Real Stories</span>
          <h2 className="display-heading mt-3 mb-14 md:mb-20" style={{ fontSize: "clamp(2rem, 3.5vw + 1rem, 3.5rem)", color: "var(--color-espresso)" }}>
            What Families Are Saying
          </h2>
        </FadeUp>
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
          {testimonials.map((t) => (
            <StaggerItem
              key={t._id}
              className="pt-6 flex flex-col gap-4"
              style={{ borderTop: "2px solid var(--color-espresso)" }}
            >
              <div className="flex gap-1" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <span key={idx} aria-hidden="true" style={{ color: "var(--color-espresso)" }}>★</span>
                ))}
              </div>
              <p
                className="text-lg md:text-xl leading-snug"
                style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--text)" }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-auto pt-2 flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ background: "var(--color-espresso)", color: "var(--color-ivory)" }}
                  aria-hidden="true"
                >
                  {t.avatarInitial}
                </div>
                <div>
                  <div className="font-bold text-sm" style={{ color: "var(--color-espresso)" }}>{t.name}</div>
                  <div className="text-xs site-muted">{t.location}</div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
```

Note: `t.text`/`t.avatar` (the old hardcoded field names) are now `t.quote`/`t.avatarInitial` (the `Testimonial` type's field names from Task 1) — this is a real field-name change, not a typo; verify every reference in the new function body uses the new names.

- [ ] **Step 3: Verify no raw hex or old `--brand-*` tokens remain in this function**

Confirm the rewritten function body uses only `--color-*`/`--text`/`--surface-2` tokens, no `--brand-cream`/`--brand-brown` (the older token family this section used to use).

- [ ] **Step 4: Commit**

```bash
git add src/components/home/HomeSections.tsx
git commit -m "feat: make TestimonialsSection backend-driven, migrate to heritage tokens and Motion, render avatar badge"
```

(`page.tsx` still calls `<TestimonialsSection />` with no props at this point in the plan — it will fail to compile until Task 9 threads `testimonials` through. This is expected and resolved by Task 9; do not attempt to fix `page.tsx` in this task.)

---

### Task 6: Marquee section (new)

**Files:**
- Create: `src/components/home/ValuesMarqueeSection.tsx`
- Modify: `src/app/globals.css` (new keyframe + class, since the foreign `HeritageMarquee.tsx`'s equivalent class was never actually defined anywhere — this plan must not repeat that)

**Interfaces:**
- Produces: `ValuesMarqueeSection` (default export, no props — static curated content).

- [ ] **Step 1: Add the marquee keyframe and class to `globals.css`**

Read the current file's structure near other animation-related rules (search for `@keyframes` to find where existing ones live) and add:

```css
@keyframes heritage-marquee-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.heritage-marquee-track {
  display: flex;
  width: max-content;
  animation: heritage-marquee-scroll 32s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .heritage-marquee-track {
    animation: none;
  }
}
```

(`prefers-reduced-motion` is a CSS media query, independent of the Motion library's `reducedMotion="user"` context — required here because this is a plain CSS `animation`, not a Motion component, so `MotionConfig` doesn't cover it. This is the explicit reduced-motion handling this task needs to add itself.)

- [ ] **Step 2: Write the component**

The track renders the phrase list twice back-to-back so the `-50%` translateX loops seamlessly (a standard infinite-marquee technique — the two copies are identical, so the seam is invisible):

```tsx
import React from "react";

const VALUES = [
  "Stone-Ground",
  "Small-Batch",
  "Rooted in Tradition",
  "No Preservatives",
  "Family Recipe",
  "100% Natural",
  "Karnataka Heritage",
  "Homemade Quality",
];

function ValuesList({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div className="flex items-center flex-shrink-0" aria-hidden={ariaHidden}>
      {VALUES.map((value, i) => (
        <React.Fragment key={i}>
          <span
            className="text-2xl md:text-4xl font-bold whitespace-nowrap px-6 md:px-10"
            style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--color-espresso)" }}
          >
            {value}
          </span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25" style={{ color: "var(--color-terracotta)" }} aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" d="M10 3 C 6 3 6 10 10 10 C 14 10 14 17 10 17" />
          </svg>
        </React.Fragment>
      ))}
    </div>
  );
}

export default function ValuesMarqueeSection() {
  return (
    <section className="py-10 md:py-14 overflow-hidden" style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div className="heritage-marquee-track">
        <ValuesList />
        <ValuesList ariaHidden />
      </div>
    </section>
  );
}
```

(The second `<ValuesList ariaHidden />` is a visual duplicate hidden from assistive tech via `aria-hidden` — screen readers get the phrase list once, not twice.)

- [ ] **Step 3: Verify visually and check reduced motion**

`npm run dev`. Not yet wired into `page.tsx` (Task 9) — for a quick isolated check, temporarily render `<ValuesMarqueeSection />` directly in `page.tsx` or a scratch route, confirm the phrases scroll continuously and loop seamlessly with no visible jump at the seam, then revert the temporary render (Task 9 does the real wiring). Using browser devtools' `prefers-reduced-motion: reduce` emulation, confirm the track stops moving entirely.

- [ ] **Step 4: Commit**

```bash
git add src/components/home/ValuesMarqueeSection.tsx src/app/globals.css
git commit -m "feat: add ValuesMarqueeSection (new infinite scroll of heritage-value phrases)"
```

---

### Task 7: Newsletter → Final CTA redesign

**Files:**
- Modify: `src/components/home/HomeSections.tsx` (`NewsletterSection`)

**Interfaces:**
- Consumes: `FadeUp` (already imported by earlier tasks in this file).
- `sectionId` stays `"newsletter"` — no change to `page.tsx`'s switch case needed for this task (Task 9 doesn't touch this case).

- [ ] **Step 1: Rewrite the section as a heritage-styled closing band**

Read the current `NewsletterSection` function (lines 391-407) in full, then replace it with:

```tsx
export function NewsletterSection() {
  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8" style={{ background: "linear-gradient(135deg, var(--color-espresso), var(--color-walnut))" }}>
      <FadeUp className="max-w-3xl mx-auto text-center space-y-6">
        <span className="section-label" style={{ color: "var(--color-terracotta)" }}>Join the Roshini&rsquo;s Family</span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold" style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--color-ivory)" }}>
          Rooted in Tradition, Delivered to You
        </h2>
        <p className="text-sm md:text-base leading-relaxed" style={{ color: "color-mix(in srgb, var(--color-ivory) 90%, transparent)" }}>
          Join 500+ families who receive weekly wellness tips, new product launches and exclusive member discounts.
        </p>
        <NewsletterForm />
        <p className="text-[11px]" style={{ color: "color-mix(in srgb, var(--color-ivory) 70%, transparent)" }}>No spam. Unsubscribe anytime. We respect your privacy.</p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-sm font-bold hover:underline"
          style={{ color: "var(--color-ivory)" }}
        >
          Prefer to browse first? Explore our products →
        </Link>
      </FadeUp>
    </section>
  );
}
```

(`Link` and `NewsletterForm` are already imported at the top of the file — no new imports needed for this task.)

- [ ] **Step 2: Verify visually**

`npm run dev`, scroll to the Newsletter section (still its existing position for now — Task 9 doesn't move it). Expected: dark espresso-to-walnut band (visually consistent with Brand Story's Task 4 background, intentional — both are the site's "statement" bands), form still functions, new shop link visible below the privacy note.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/HomeSections.tsx
git commit -m "feat: redesign Newsletter section as a heritage-styled Final CTA band"
```

---

### Task 8: Footer — extract, restyle, SVG icons, social row

**Files:**
- Create: `src/components/partials/Footer.tsx`
- Modify: `src/app/page.tsx` (remove the inline footer JSX — done in this task, ahead of Task 9's other `page.tsx` edits, since it's a self-contained removal)

**Interfaces:**
- Produces: `Footer` (default export, no props).

- [ ] **Step 1: Write the extracted, restyled component**

Read the current inline `<footer>` JSX in `page.tsx` (lines 91-151) in full before writing this — the content structure (brand mark, 3 link columns, bottom bar) carries over unchanged; only icons and the social row are new, plus the `IndianBorder` that currently sits immediately before the footer moves inside this component so `Footer` is self-contained:

```tsx
import React from "react";
import Link from "next/link";
import IndianBorder from "@/components/decorative/IndianBorder";

const SOCIAL_LINKS = [
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#" },
];

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect vectorEffect="non-scaling-stroke" x="3" y="3" width="18" height="18" rx="5" />
      <circle vectorEffect="non-scaling-stroke" cx="12" cy="12" r="4.2" />
      <circle vectorEffect="non-scaling-stroke" cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path vectorEffect="non-scaling-stroke" d="M14.5 8.5h2V5.3c-.35-.05-1.5-.15-2.85-.15-2.82 0-4.75 1.72-4.75 4.9V13H6v3.5h3.4V23h3.6v-6.5h3.4l.5-3.5h-3.9v-2.6c0-1 .28-1.9 1.5-1.9Z" />
    </svg>
  );
}

const SOCIAL_ICONS: Record<string, () => React.JSX.Element> = {
  Instagram: InstagramIcon,
  Facebook: FacebookIcon,
};

function MapPinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path vectorEffect="non-scaling-stroke" d="M12 21c-4.2-4.6-6.5-8.2-6.5-11.2A6.5 6.5 0 0 1 12 3a6.5 6.5 0 0 1 6.5 6.5c0 3-2.3 6.6-6.5 11.5Z" />
      <circle vectorEffect="non-scaling-stroke" cx="12" cy="9.5" r="2.25" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path vectorEffect="non-scaling-stroke" d="M7 3.5 9.5 8 7 10c1 2.7 3.3 5 6 6l2-2.5 4.5 2.5v3a1.5 1.5 0 0 1-1.6 1.5C10.3 20.6 3.4 13.7 3 7.1A1.5 1.5 0 0 1 4.5 5.5H7Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect vectorEffect="non-scaling-stroke" x="3" y="5" width="18" height="14" rx="2" />
      <path vectorEffect="non-scaling-stroke" d="m4 6.5 8 6 8-6" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle vectorEffect="non-scaling-stroke" cx="12" cy="12" r="8.5" />
      <path vectorEffect="non-scaling-stroke" d="M12 7.5V12l3 2" />
    </svg>
  );
}

export default function Footer() {
  return (
    <>
      <IndianBorder variant="minimal" position="top" className="px-4 sm:px-6 lg:px-8" />
      <footer className="pt-16 pb-8 px-4 sm:px-6 lg:px-8 mt-auto" style={{ background: "var(--brand-brown-dark, #3C2015)", color: "var(--brand-cream)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pb-12" style={{ borderBottom: "1px solid rgba(246, 238, 225, 0.2)" }}>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center font-bold text-xl shadow-sm" style={{ borderRadius: "var(--radius-lg)", background: "var(--brand-cream)", color: "var(--brand-brown-dark, #3C2015)" }}>R</div>
                <div>
                  <div className="font-bold text-lg leading-none" style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--brand-cream)" }}>Roshini&rsquo;s</div>
                  <div className="text-[10px] tracking-widest uppercase mt-1" style={{ color: "var(--brand-cream-dark)" }}>Home Products</div>
                </div>
              </div>
              <p className="text-xs leading-relaxed max-w-xs" style={{ color: "var(--brand-cream-dark)" }}>
                Traditional nutrition crafted with love in Karnataka. Homemade quality, delivered to your door.
              </p>
              <div className="flex items-center gap-3 pt-2">
                {SOCIAL_LINKS.map(({ label, href }) => {
                  const Icon = SOCIAL_ICONS[label];
                  return (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      className="w-8 h-8 flex items-center justify-center transition-colors hover:opacity-80"
                      style={{ borderRadius: "var(--radius-md)", border: "1px solid rgba(246, 238, 225, 0.3)", color: "var(--brand-cream)" }}
                    >
                      <Icon />
                    </a>
                  );
                })}
              </div>
            </div>
            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: "var(--brand-cream)" }}>Shop</h4>
              <ul className="space-y-2.5">
                {[["All Products", "/shop"], ["Health Mixes", "/shop?category=health-mixes"], ["Herbal Teas", "/shop?category=herbal-tea"], ["Spice Powders", "/shop?category=spice"]].map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="text-xs transition-colors hover:underline" style={{ color: "var(--brand-cream-dark)" }}>{label}</a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Account */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: "var(--brand-cream)" }}>Account</h4>
              <ul className="space-y-2.5">
                {[["Sign In", "/login"], ["Register", "/register"], ["My Orders", "/account/dashboard"]].map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="text-xs transition-colors hover:underline" style={{ color: "var(--brand-cream-dark)" }}>{label}</a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Contact */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: "var(--brand-cream)" }}>Contact</h4>
              <ul className="space-y-3 text-xs" style={{ color: "var(--brand-cream-dark)" }}>
                <li className="flex items-center gap-2"><MapPinIcon /><span>Karnataka, India</span></li>
                <li className="flex items-center gap-2"><PhoneIcon /><span>+91 95918 96917</span></li>
                <li className="flex items-center gap-2"><MailIcon /><span>roshinishomeproducts@gmail.com</span></li>
                <li className="flex items-center gap-2"><ClockIcon /><span>Mon–Sat: 9am – 7pm IST</span></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs" style={{ color: "var(--brand-cream-dark)" }}>
            <div>© 2026 Roshini&rsquo;s Home Products. All rights reserved.</div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <Link href="/privacy-policy" className="transition-colors hover:underline" style={{ color: "var(--brand-cream-dark)" }}>Privacy Policy</Link>
              <Link href="/terms-of-service" className="transition-colors hover:underline" style={{ color: "var(--brand-cream-dark)" }}>Terms of Service</Link>
              <Link href="/refund-policy" className="transition-colors hover:underline" style={{ color: "var(--brand-cream-dark)" }}>Refund Policy</Link>
              <Link href="/shipping-policy" className="transition-colors hover:underline" style={{ color: "var(--brand-cream-dark)" }}>Shipping Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
```

(The `--brand-cream`/`--brand-brown-dark` tokens are unchanged from the original — they're a separate, still-valid token family used elsewhere in the codebase for this exact dark-footer treatment; this task's scope is icons + social row + extraction, not re-tokenizing every color the footer already used correctly.)

- [ ] **Step 2: Remove the inline footer from `page.tsx` and import `Footer`**

In `page.tsx`, delete the entire block from `{/* ── FOOTER ── */}` through the closing `</footer>` (currently lines 91-151), including the `<IndianBorder variant="minimal" position="top" ... />` line immediately before it (now inside `Footer.tsx`). Add the import at the top of the file:

```typescript
import Footer from "@/components/partials/Footer";
```

Replace the deleted block with a single `<Footer />` call in the same position (immediately after the closing `)}` of the section `.map()`, still inside the outer `<div className="min-h-screen flex flex-col" ...>`).

- [ ] **Step 3: Verify visually**

`npm run dev`, scroll to the footer. Expected: same structural layout as before, emoji replaced with line icons, new Instagram/Facebook icon row under the brand blurb (both linking to `#` for now), page still ends cleanly with the bottom bar.

- [ ] **Step 4: Commit**

```bash
git add src/components/partials/Footer.tsx src/app/page.tsx
git commit -m "feat: extract Footer to its own component, replace emoji with SVG icons, add social row"
```

---

### Task 9: `page.tsx` wiring — Nutrition, Marquee, Testimonials data threading, section order

**Files:**
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `NutritionSection` (Task 3), `ValuesMarqueeSection` (Task 6), `Testimonial[]`/`testimonials` (Task 1 + Task 5's new `TestimonialsSection` signature).

**Precondition:** the sibling `server/` plan's Task 6 (sections migration) must be complete and verified — this task's final ordering check (Step 4) depends on the live `/api/sections` collection actually containing `nutrition` and `marquee`. If it isn't done yet, `DEFAULT_LAYOUT`'s fallback ordering (Step 1) still lets local dev work correctly against an empty/fallback `sections` response — but the live-data check in Step 4 will need the server plan to have landed first.

- [ ] **Step 1: Update `DEFAULT_LAYOUT`**

Read the current file first (`page.tsx` may have shifted slightly since Task 8 touched it). Locate `DEFAULT_LAYOUT` (currently lines 30-40) and replace it with:

```typescript
const DEFAULT_LAYOUT = [
  { sectionId: "trust_badges" },
  { sectionId: "categories" },
  { sectionId: "featured_products" },
  { sectionId: "why_us" },
  { sectionId: "nutrition" },
  { sectionId: "brand_story" },
  { sectionId: "achievements" },
  { sectionId: "testimonials" },
  { sectionId: "marquee" },
  { sectionId: "health_hub" },
  { sectionId: "newsletter" }
];
```

- [ ] **Step 2: Add imports**

```typescript
import NutritionSection from "@/components/home/NutritionSection";
import ValuesMarqueeSection from "@/components/home/ValuesMarqueeSection";
```

- [ ] **Step 3: Add the two new switch cases, and thread `testimonials` into the existing `testimonials` case**

Locate the switch statement's `"why_us"` case and add a new case immediately after it:

```typescript
case "why_us":
  return <WhyUsSection key={`whyus-${index}`} />;
case "nutrition":
  return <NutritionSection key={`nutrition-${index}`} />;
```

Locate the `"testimonials"` case and change it to pass the new prop, then add the `"marquee"` case immediately after it:

```typescript
case "testimonials":
  return <TestimonialsSection key={`testimonials-${index}`} testimonials={testimonials} />;
case "marquee":
  return <ValuesMarqueeSection key={`marquee-${index}`} />;
```

- [ ] **Step 4: Destructure `testimonials` from `getHomePageData()`**

Locate the destructure at the top of `HomePage()`:

```typescript
const { products, categories, achievements, ingredients, heroSliders, sections: apiSections, vlogs } = await getHomePageData();
```

Change to:

```typescript
const { products, categories, achievements, ingredients, testimonials, heroSliders, sections: apiSections, vlogs } = await getHomePageData();
```

- [ ] **Step 5: Verify against real live data**

With the server plan's migration already run (precondition above), start `npm run dev` and load the homepage. Confirm, in order: hero → heritage_intro → trust_badges → categories → featured_products (+ ingredients + grain-to-blend) → why_us → **nutrition** → brand_story → achievements → testimonials (now showing live backend data, not the old hardcoded 3) → **marquee** → health_hub → newsletter (Final CTA) → footer. If `nutrition`/`marquee` don't appear at all, check `GET /api/sections` directly — their absence there means the server migration hasn't been run against this environment's database yet, not a bug in this task's code.

- [ ] **Step 6: Verify TypeScript compiles clean and lint passes**

Run: `npm run lint`
Expected: no new errors/warnings versus baseline. Also confirm no TypeScript error about `TestimonialsSection` now requiring a `testimonials` prop (this task is what resolves the "expected" compile gap Task 5 left behind).

- [ ] **Step 7: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: wire Nutrition and Marquee sections into the homepage, thread testimonials data"
```

---

### Task 10: Full verification pass

**Files:** none (verification only, no code changes).

- [ ] **Step 1: Full section-order check at desktop and mobile**

Live Playwright (or manual browser) walkthrough at 1440px and 390px against the real seeded backend. Confirm the order from Task 9 Step 5 renders identically at both widths, confirm Testimonials shows the 3 real backend testimonials (not the old hardcoded array — check names/quotes match the seed data verbatim), confirm the avatar-initial badges render.

- [ ] **Step 2: Marquee reduced-motion check**

With `prefers-reduced-motion: reduce` emulated, confirm the marquee track is static (no scrolling) and the phrases are still fully readable (not cut off mid-loop).

- [ ] **Step 3: Footer check**

Confirm the 4 contact-row icons render as line icons (not emoji, not blank boxes), confirm the Instagram/Facebook social icons render and are clickable (even though they currently point to `#`), confirm the footer layout is unchanged from before at both desktop and mobile widths.

- [ ] **Step 4: Regression check — Phases 1-3 unaffected**

Spot-check: hero slider still animates correctly, heritage intro section unchanged, ingredient gallery and grain-to-blend story sections (Phase 3) still render in their established position (immediately after Featured Products) and still work (icons still converge, CTA still keyboard-accessible per Phase 3's fix wave).

- [ ] **Step 5: Lint and build**

Run: `npm run lint` — expect no new issues versus baseline.
Run: `npm run build` — expect it to fail on the same known, pre-existing, unrelated foreign-file `"kasuti"` error (not a new failure introduced by this plan; confirm by reading the error output and checking it references the same two foreign files as before, not any file this plan touched).

- [ ] **Step 6: Console check**

No new console errors/warnings during the walkthrough beyond the pre-existing, already-known dev-only 404s (`build-metadata.json`) and Motion's expected reduced-motion notice.

- [ ] **Step 7: Report**

No commit for this task. Write a verification summary for the controller's ledger, matching the format of Phase 3's Task 6 report.
