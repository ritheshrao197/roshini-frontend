# Hero + Heritage Introduction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the fallback hero (`src/components/home/HeroSlider.tsx`'s no-CMS branch) into a cinematic, botanically-framed hero with a Motion entrance sequence and a GSAP scroll-linked parallax, add a new Heritage Introduction section right after it, and bring forward 7 reviewed motion-primitive files from an earlier stashed effort.

**Architecture:** Additive — a new illustration file, a new section component, 7 extracted-and-integrated library/component files — plus a rewrite of the fallback-hero JSX inside the existing `HeroSlider.tsx` (the CMS Swiper branch gets a palette audit only, not a rewrite). No new page routes. Two new npm dependencies (`motion@^13.1.0`, `gsap@^3.15.0` — see Global Constraints).

**Tech Stack:** Next.js 16, React 19, Tailwind v4, `motion/react` (entrance/reveal animation), `gsap`+`gsap/ScrollTrigger` (the hero's scroll-linked parallax — the only GSAP use in this plan).

**Spec:** `client-next/docs/superpowers/specs/2026-08-14-hero-heritage-intro-design.md`

## Global Constraints

- **`motion` (`^13.1.0`) and `gsap` (`^3.15.0`) must be added as new npm dependencies in Task 1** — these exact versions are what the extracted stashed code was originally written against. (Correction: this plan and its spec originally assumed these were already installed, based on a Phase 1 exploration that ran *before* the unrelated motion-plan work was stashed — the stash's own uncommitted changes had added them to `package.json` at that time, which the exploration observed; stashing reverted `package.json` to not have them. Verified empirically during Task 1 execution — see ledger.)
- `client-next` has no configured test runner — verification is `npm run lint`, `npm run build`, and manual `npm run dev` checks (no unit tests to write).
- Never touch: `src/lib/cart.ts`, payment/checkout code, product data/API layer, `src/lib/AuthContext.tsx`/`useAuth`, SEO metadata in `layout.tsx`, `server/`.
- Every new animation must be gated behind `useReducedMotion()` (from `src/lib/useMotionPrefs.ts`, Task 1) — when true, render the final state immediately with no animation, and never create a GSAP `ScrollTrigger` at all.
- `package.json`'s version field changes on every commit — `client-next/.git/hooks/pre-commit` unconditionally bumps and stages it. This is expected repo behavior, not a scope violation. Do not flag it in any task review.
- The CMS-driven Swiper hero branch of `HeroSlider.tsx` (the `sliders?.length` truthy path, roughly lines 155-187) is **not** structurally rewritten by this plan — only Task 6 touches it, and only for a palette/token audit.
- **Header-hero contrast is a hard requirement, not a nice-to-have.** `var(--nav-on-hero)` (`#F7F0E4`) is the header's fixed "light text" color while `.is-transparent` is active. The current `.hero-fallback` background (`linear-gradient(135deg, var(--color-linen), var(--color-ivory) 60%, var(--color-linen))`, both very light) would leave the header's nav text at ~1:1 contrast — genuinely invisible, the exact bug Phase 1's final review found and fixed for the *old* hero. Task 3 must add a dedicated dark scrim behind the header's overlap band (see Task 3) so this doesn't regress.

---

### Task 1: Extract and integrate the 7 stashed motion-primitive files

**Files:**
- Create: `src/lib/useMotionPrefs.ts`, `src/lib/motionConfig.ts`, `src/lib/gsapUtils.ts`, `src/components/motion/RevealText.tsx`, `src/components/motion/FadeUp.tsx`, `src/components/motion/ImageReveal.tsx`, `src/components/motion/ParallaxLayer.tsx`

**Interfaces:**
- Produces: `useReducedMotion()`, `usePointerFine()`, `useCanHover()` (from `useMotionPrefs.ts`); `motionConfig` object and `gsapEase` object (from `motionConfig.ts`); `useGsapContext(scopeRef, setup, deps)`, plus re-exported `gsap`/`ScrollTrigger` (from `gsapUtils.ts`); default-exported `RevealText({children, as, className, style, by, stagger, delay})`; default-exported `FadeUp({children, className, style, delay, distance, duration, as})` plus named `StaggerGroup`/`StaggerItem`; default-exported `ImageReveal({children, className, style, delay, from})`; default-exported `ParallaxLayer({children, className, style, range})`. Tasks 3, 4, and 5 all consume these exact exports.

- [ ] **Step 1: Install `motion` and `gsap`**

```bash
npm install motion@^13.1.0 gsap@^3.15.0
```

Confirm both land in `package.json`'s `dependencies` (not `devDependencies`) and that `npm install` exits cleanly.

- [ ] **Step 2: Extract the 7 files from the stash's untracked-files commit**

These files were authored in an earlier, unrelated session and stashed (never committed) before Phase 1 began. They are recoverable read-only via `git show`, without touching the stash itself:

```bash
git show 'stash@{0}^3:src/lib/useMotionPrefs.ts' > src/lib/useMotionPrefs.ts
git show 'stash@{0}^3:src/lib/motionConfig.ts' > src/lib/motionConfig.ts
git show 'stash@{0}^3:src/lib/gsapUtils.ts' > src/lib/gsapUtils.ts
git show 'stash@{0}^3:src/components/motion/RevealText.tsx' > src/components/motion/RevealText.tsx
git show 'stash@{0}^3:src/components/motion/FadeUp.tsx' > src/components/motion/FadeUp.tsx
git show 'stash@{0}^3:src/components/motion/ImageReveal.tsx' > src/components/motion/ImageReveal.tsx
git show 'stash@{0}^3:src/components/motion/ParallaxLayer.tsx' > src/components/motion/ParallaxLayer.tsx
```

If any `git show` command fails (e.g. "fatal: invalid object name" or path not found), STOP and report — it means the stash reference has changed since this plan was written, and the file must be located a different way rather than guessed at.

- [ ] **Step 3: Read every extracted file end to end**

Before doing anything else, read all 7 files. They should look like this (summarized — read the actual extracted content, this is not exhaustive):

- `useMotionPrefs.ts`: `useSyncExternalStore`-based `useMediaQuery`, exporting `useReducedMotion`, `usePointerFine`, `useCanHover`. No hardcoded colors, no dependencies beyond React.
- `motionConfig.ts`: a plain `motionConfig` object (durations/eases/stagger values matching `globals.css`'s `--duration-*`/`--ease-*` tokens) and a `gsapEase` object of cubic-bezier strings. No React, no side effects.
- `gsapUtils.ts`: registers `ScrollTrigger` once (`typeof window !== "undefined"` guard), re-exports `gsap`/`ScrollTrigger`, and exports `useGsapContext(scopeRef, setup, deps)` which wraps `gsap.context()` in a `useLayoutEffect` and calls `.revert()` on cleanup.
- `RevealText.tsx`, `FadeUp.tsx`, `ImageReveal.tsx`, `ParallaxLayer.tsx`: `motion/react`-based components, each `"use client"`, each gated appropriately (e.g. `ParallaxLayer` checks `useReducedMotion` from `motion/react` — note this is `motion/react`'s own reduced-motion hook, not the project's `useMotionPrefs.ts` one; both exist and both work, don't "fix" this by changing which one it imports unless it's actually broken).

If what you read materially differs from this summary (missing exports, broken imports, references to files that don't exist in this codebase), STOP and report BLOCKED with specifics — do not silently patch a file that doesn't match its expected shape without checking with the controller first, since these files were written for a different, unknown codebase state originally.

- [ ] **Step 4: Verify — lint and type-check**

Run: `cd client-next && npm run lint`
Expected: no new errors attributable to these 7 files (the project has pre-existing baseline lint issues in other files — 143 errors/85 warnings as of the last Phase 1 commit; compare against that baseline, don't expect zero).

- [ ] **Step 5: Verify — build**

Run: `npm run build`
Expected: succeeds. These files aren't imported by anything yet (Tasks 3-5 wire them up), so this mainly confirms there's no syntax/type error sitting dormant, and that `motion`/`gsap` resolve correctly as real dependencies now that Step 1 installed them.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/lib/useMotionPrefs.ts src/lib/motionConfig.ts src/lib/gsapUtils.ts src/components/motion/RevealText.tsx src/components/motion/FadeUp.tsx src/components/motion/ImageReveal.tsx src/components/motion/ParallaxLayer.tsx
git commit -m "feat: add motion/gsap dependencies and extract reviewed motion primitives from stash"
```

---

### Task 2: Botanical illustration set (5 new hero-framing motifs)

**Files:**
- Create: `src/components/decorative/HeroBotanicals.tsx`

**Interfaces:**
- Produces: named exports `MilletSprig`, `AlmondBranch`, `FlowerCluster`, `LeafPair`, `SeedScatter` — each a `() => React.JSX.Element` rendering a self-contained `<svg>` using `currentColor`/`vectorEffect="non-scaling-stroke"`, matching `IndianBorder.tsx`'s established conventions (no props needed — sizing/positioning/color are the consumer's job via wrapping `className`/CSS, same pattern as `IndianBorder`). Task 3 imports and positions all 5 around the hero product image.

- [ ] **Step 1: Create the illustration file**

Create `src/components/decorative/HeroBotanicals.tsx`:

```tsx
import React from "react";

const STROKE_WIDTH = 1.25;

/** A slender millet stalk with alternating small grain ovals along its length. */
export function MilletSprig() {
  return (
    <svg
      viewBox="0 0 40 120"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE_WIDTH}
      strokeLinecap="round"
      className="w-full h-full"
    >
      <path vectorEffect="non-scaling-stroke" d="M20 118 C 18 90 22 70 18 40 C 16 25 20 12 20 2" />
      {[14, 26, 38, 50, 62, 74, 86, 98].map((y, i) => (
        <ellipse
          key={y}
          vectorEffect="non-scaling-stroke"
          cx={i % 2 === 0 ? 20 - 6 : 20 + 6}
          cy={y}
          rx="4.5"
          ry="2.5"
          transform={`rotate(${i % 2 === 0 ? -20 : 20} ${i % 2 === 0 ? 14 : 26} ${y})`}
        />
      ))}
    </svg>
  );
}

/** A short diagonal almond branch with three almond-shaped leaves. */
export function AlmondBranch() {
  return (
    <svg
      viewBox="0 0 100 60"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE_WIDTH}
      strokeLinecap="round"
      className="w-full h-full"
    >
      <path vectorEffect="non-scaling-stroke" d="M4 56 C 30 44 60 30 96 4" />
      <path vectorEffect="non-scaling-stroke" d="M24 48 C 20 38 24 30 34 26 C 30 34 28 42 24 48 Z" />
      <path vectorEffect="non-scaling-stroke" d="M50 34 C 46 24 50 16 60 12 C 56 20 54 28 50 34 Z" />
      <path vectorEffect="non-scaling-stroke" d="M74 18 C 70 8 74 0 84 -4 C 80 4 78 12 74 18 Z" transform="translate(0 4)" />
    </svg>
  );
}

/** A small cluster of three simple 5-petal flowers on thin stems. */
export function FlowerCluster() {
  const flowers = [
    { cx: 16, cy: 40, r: 4, scale: 1 },
    { cx: 34, cy: 22, r: 3.2, scale: 0.85 },
    { cx: 48, cy: 36, r: 3.6, scale: 0.9 },
  ];
  return (
    <svg
      viewBox="0 0 64 56"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE_WIDTH}
      strokeLinecap="round"
      className="w-full h-full"
    >
      <path vectorEffect="non-scaling-stroke" d="M16 52 L16 40" />
      <path vectorEffect="non-scaling-stroke" d="M34 52 L34 22" />
      <path vectorEffect="non-scaling-stroke" d="M48 52 L48 36" />
      {flowers.map(({ cx, cy, r, scale }, i) => (
        <g key={i} transform={`translate(${cx} ${cy}) scale(${scale})`}>
          {Array.from({ length: 5 }, (_, p) => {
            const angle = (p * 72 * Math.PI) / 180;
            const px = Math.cos(angle) * r;
            const py = Math.sin(angle) * r;
            return (
              <ellipse
                key={p}
                vectorEffect="non-scaling-stroke"
                cx={px}
                cy={py}
                rx={r * 0.7}
                ry={r * 1.1}
                transform={`rotate(${p * 72} ${px} ${py})`}
              />
            );
          })}
          <circle vectorEffect="non-scaling-stroke" r={r * 0.4} fill="currentColor" stroke="none" />
        </g>
      ))}
    </svg>
  );
}

/** Two mirrored curved leaves on a short shared stem. */
export function LeafPair() {
  return (
    <svg
      viewBox="0 0 60 50"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE_WIDTH}
      strokeLinecap="round"
      className="w-full h-full"
    >
      <path vectorEffect="non-scaling-stroke" d="M30 46 L30 10" />
      <path
        vectorEffect="non-scaling-stroke"
        d="M30 30 C 18 26 8 16 6 4 C 20 6 30 16 30 30 Z"
      />
      <path
        vectorEffect="non-scaling-stroke"
        d="M30 30 C 42 26 52 16 54 4 C 40 6 30 16 30 30 Z"
      />
    </svg>
  );
}

/** A loose scatter of small seed ovals, varied in size and rotation. */
export function SeedScatter() {
  const seeds = [
    { x: 6, y: 8, rx: 4, ry: 2.2, rot: 15 },
    { x: 20, y: 2, rx: 3.4, ry: 1.8, rot: -25 },
    { x: 32, y: 14, rx: 4.4, ry: 2.4, rot: 40 },
    { x: 10, y: 22, rx: 3.2, ry: 1.7, rot: -10 },
    { x: 26, y: 26, rx: 3.8, ry: 2, rot: 65 },
  ];
  return (
    <svg
      viewBox="0 0 44 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE_WIDTH}
      className="w-full h-full"
    >
      {seeds.map(({ x, y, rx, ry, rot }, i) => (
        <ellipse
          key={i}
          vectorEffect="non-scaling-stroke"
          cx={x}
          cy={y}
          rx={rx}
          ry={ry}
          transform={`rotate(${rot} ${x} ${y})`}
        />
      ))}
    </svg>
  );
}
```

- [ ] **Step 2: Verify — lint and type-check**

Run: `cd client-next && npm run lint`
Expected: no new errors from this file.

- [ ] **Step 3: Commit**

```bash
git add src/components/decorative/HeroBotanicals.tsx
git commit -m "feat: add 5-motif botanical illustration set for hero framing"
```

(No visual verification yet — nothing renders these until Task 3.)

---

### Task 3: Hero rebuild — copy, botanical framing, header-contrast scrim, Motion entrance sequence

**Files:**
- Modify: `src/components/home/HeroSlider.tsx` (the `hero-fallback` branch, lines 84-152 as currently written)
- Modify: `src/app/globals.css` (new scrim rule)

**Interfaces:**
- Consumes: `RevealText`, `FadeUp` (Task 1), `MilletSprig`/`AlmondBranch`/`FlowerCluster`/`LeafPair`/`SeedScatter` (Task 2), `useReducedMotion` (Task 1).

- [ ] **Step 1: Update the hero copy**

In `src/components/home/HeroSlider.tsx`, replace the eyebrow/headline/description block (currently lines 88-97):

```tsx
          <div className="flex flex-col justify-center gap-6">
            <FadeUp>
              <span className="section-label">CRAFTED FROM INDIA'S GRAINS &amp; NUTS</span>
            </FadeUp>
            <RevealText as="h1" className="display-heading text-[var(--color-espresso)]" delay={0.15}>
              Wholesome food, rooted in tradition.
            </RevealText>
            <FadeUp delay={0.55}>
              <p className="site-muted text-base md:text-lg leading-relaxed max-w-lg">
                Thoughtfully blended millet, nuts and seeds for everyday nourishment.
              </p>
            </FadeUp>

            <FadeUp delay={0.7}>
              <div className="flex flex-wrap gap-4 sm:gap-6 pt-2">
                <MagneticButton>
                  <Link href={flagshipHref} className="btn-primary btn-lg rounded-xl">
                    {flagship ? "Shop Nutrimix" : "Shop Now"}
                  </Link>
                </MagneticButton>
                <Link href="#brand-story" className="btn-ghost btn-lg rounded-xl">Explore the Blend</Link>
              </div>
            </FadeUp>
          </div>
```

Add the two new imports at the top of the file (near the existing `MagneticButton` import):

```tsx
import RevealText from "@/components/motion/RevealText";
import { FadeUp } from "@/components/motion/FadeUp";
```

Note: `RevealText`'s `children` prop must be a plain string (it calls `.split(" ")` internally) — the JSX above passes a literal string child, not an expression, which satisfies this.

- [ ] **Step 2: Add the botanical framing layer around the product image**

In `src/components/home/HeroSlider.tsx`, the right column currently renders the glow layer and the product image inside `imageWrapRef`'s wrapping div (lines 110-140). Add a botanical framing layer as a sibling to that wrapper, inside the same outer `relative flex items-center justify-center` container (which starts at line 110):

```tsx
          <div className="relative flex items-center justify-center" style={{ perspective: "1200px" }}>
            {/* Botanical framing layer — behind the product, corner-anchored, restrained */}
            <div className="pointer-events-none absolute inset-0" aria-hidden="true" style={{ color: "var(--color-secondary-brown)", opacity: 0.5 }}>
              <div className="absolute -top-4 -left-6 w-20 h-20 md:w-28 md:h-28">
                <MilletSprig />
              </div>
              <div className="absolute -top-2 -right-4 w-16 h-16 md:w-24 md:h-24 rotate-[15deg]">
                <AlmondBranch />
              </div>
              <div className="absolute -bottom-6 -left-4 w-16 h-16 md:w-20 md:h-20">
                <LeafPair />
              </div>
              <div className="absolute -bottom-4 -right-6 w-14 h-14 md:w-20 md:h-20">
                <FlowerCluster />
              </div>
              <div className="absolute top-1/2 -right-10 w-10 h-10 md:w-14 md:h-14 -translate-y-1/2 rotate-[30deg]">
                <SeedScatter />
              </div>
            </div>

            <div
              ref={imageWrapRef}
              className="relative w-full max-w-md aspect-square transition-transform duration-300 ease-out will-change-transform"
              style={{ transformStyle: "preserve-3d" }}
            >
```

(The rest of that `imageWrapRef` div — glow layer, `<Image>`/`hero-panel` fallback — is unchanged; only the new botanical-framing `<div>` is inserted immediately before it, as a sibling.)

Add the import for the 5 illustration components:

```tsx
import { MilletSprig, AlmondBranch, FlowerCluster, LeafPair, SeedScatter } from "@/components/decorative/HeroBotanicals";
```

- [ ] **Step 3: Animate the botanical layer and the product image in on mount**

Wrap the botanical framing `<div>` (added in Step 2) and the `imageWrapRef` product wrapper in `motion.div`s driven by `useReducedMotion`. Replace the two divs from Step 2 with:

```tsx
            <motion.div
              className="pointer-events-none absolute inset-0"
              aria-hidden="true"
              style={{ color: "var(--color-secondary-brown)", opacity: reduceMotion ? 0.5 : undefined }}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.85 }}
              animate={{ opacity: 0.5, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.75 }}
            >
              {/* ...same 5 positioned illustration <div>s from Step 2... */}
            </motion.div>

            <motion.div
              ref={imageWrapRef}
              className="relative w-full max-w-md aspect-square transition-transform duration-300 ease-out will-change-transform"
              style={{ transformStyle: "preserve-3d" }}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
            >
```

Add `import { motion } from "motion/react";` and `import { useReducedMotion } from "@/lib/useMotionPrefs";` to the top of the file. Inside the component function (near the top, alongside the existing `useState`/`useRef` calls), add:

```tsx
  const reduceMotion = useReducedMotion();
```

Since `motion.div` replaces the plain `<div>` for `imageWrapRef`, confirm `ref={imageWrapRef}` still works on a `motion.div` (it does — `motion` components forward refs to the underlying DOM node) and that the existing mouse-tilt effect (which sets `el.style.transform` directly via `imageWrapRef.current`) still functions — Motion's `animate`/`initial` props control `opacity`/`scale` via its own transform channel, while the tilt effect's manual `style.transform` string will be the one GSAP/Motion doesn't own; if the mouse-tilt effect and Motion's scale animation visibly fight each other (e.g. the tilt's `transform` string overwrites Motion's scale), that's a real conflict to resolve during implementation — verify visually and, if needed, apply Motion's scale to an outer wrapper and keep the tilt effect on an inner one, rather than fighting over the same DOM node's `transform`.

- [ ] **Step 4: Add the header-contrast scrim**

In `src/app/globals.css`, immediately after the existing `.hero-fallback { background: ... }` rule (search for the literal string `.hero-fallback` to locate it — as of Phase 1's last commit it's around line 1732, well after the unrelated `.site-header.is-hero-overlay`/`.is-transparent` rules near line 1658, so don't assume proximity), add:

```css
/* Guarantees header legibility over .hero-fallback's light background,
   independent of the hero's overall brightness — see Phase 2 spec's
   "Header legibility" note. Sized to roughly the header's overlap band. */
.hero-fallback::before {
  content: "";
  position: absolute;
  inset: 0 0 auto 0;
  height: 140px;
  background: linear-gradient(to bottom, rgba(28, 25, 23, 0.55), transparent);
  pointer-events: none;
  z-index: 1;
}
```

`.hero-fallback` is already `position: relative` (confirmed in the existing JSX: `className="hero-fallback relative overflow-hidden"`), so this pseudo-element positions correctly. Verify the hero's actual content (the `max-w-7xl mx-auto ... grid` container) has a higher effective stacking position than this scrim — it should, since it's a normal-flow sibling after the pseudo-element in paint order and doesn't need an explicit `z-index` unless testing shows otherwise.

- [ ] **Step 5: Verify — lint and type-check**

Run: `cd client-next && npm run lint`
Expected: no new errors beyond the established baseline.

- [ ] **Step 6: Verify — visual smoke check**

Run: `npm run dev`, view the homepage hero:
- Confirm the eyebrow/headline/description/CTA read the new copy, and the headline reveals word-by-word on load (not glitching or reflowing during the animation).
- Confirm the 5 botanical illustrations are visible around the product image, restrained (not competing with the product), and fade/scale in shortly after the product image.
- Confirm the product image scales in from ~92% to 100% and the existing mouse-tilt effect still works smoothly after the entrance animation completes (move the mouse over the image on desktop).
- **Confirm header legibility**: at the very top of the page (unscrolled), the header's nav text/icons must be clearly readable against the hero — this is the scrim from Step 4 doing its job. If it's still hard to read, the scrim's opacity/height needs adjusting — don't skip this check.
- Toggle `prefers-reduced-motion` (OS setting or DevTools rendering emulation) and confirm the hero renders in its final state immediately, no animation.
- Resize to mobile width and confirm the botanical framing layer doesn't cause overflow or crowd the product image awkwardly.

- [ ] **Step 7: Commit**

```bash
git add src/components/home/HeroSlider.tsx src/app/globals.css
git commit -m "feat: rebuild fallback hero with new copy, botanical framing, and Motion entrance sequence"
```

---

### Task 4: Hero scroll animation (GSAP ScrollTrigger)

**Files:**
- Modify: `src/components/home/HeroSlider.tsx`

**Interfaces:**
- Consumes: `useGsapContext`, `gsap`, `ScrollTrigger` (from Task 1's `gsapUtils.ts`), `useReducedMotion` (Task 1, already imported in Task 3).

- [ ] **Step 1: Add refs for the scroll-animated elements**

**Read the current `HeroSlider.tsx` first — Task 3 restructured the product-image wrapper beyond what an earlier draft of this plan assumed.** The product image is now split into an OUTER `motion.div` (`className="hero-product-entrance ..."`) that Motion's entrance animation owns, wrapping an INNER plain `<div ref={imageWrapRef} ...>` that the pre-existing mouse-tilt effect owns exclusively (it writes `imageWrapRef.current.style.transform` directly, every mousemove). **Do not attach GSAP's scroll animation to `imageWrapRef`** — that would recreate the exact transform-ownership conflict Task 3's own commit message and code comment describe fixing (two things writing to one element's `transform` fight every frame), just between GSAP and the tilt handler instead of Motion and the tilt handler.

In the `hero-fallback` branch's component scope (same function body as Task 3's edits), add refs for the section root, the headline, the botanical layer, and a NEW ref for the outer product-entrance wrapper:

```tsx
  const heroSectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const botanicalsRef = useRef<HTMLDivElement>(null);
  const productEntranceRef = useRef<HTMLDivElement>(null);
```

Attach `ref={heroSectionRef}` to the `<section className="hero-fallback ...">` root element. Attach `ref={headlineRef}` to a new wrapping `<div>` around the `<RevealText>` call (`RevealText` doesn't forward a `ref` — confirm this by checking Task 1's extracted `RevealText.tsx`):

```tsx
            <div ref={headlineRef}>
              <RevealText as="h1" className="display-heading text-[var(--color-espresso)]" delay={0.15}>
                Wholesome food, rooted in tradition.
              </RevealText>
            </div>
```

Attach `ref={botanicalsRef}` to the botanical framing `motion.div` (the one with `className="hero-botanical-frame pointer-events-none absolute inset-0"`). Attach `ref={productEntranceRef}` to the OUTER `motion.div` with `className="hero-product-entrance relative w-full max-w-md aspect-square"` — this is the node GSAP will animate, NOT `imageWrapRef`.

- [ ] **Step 2: Wire up the scroll-linked animation**

Add, in the component body (after the refs are declared, alongside the existing `useEffect` calls):

```tsx
  useGsapContext(
    heroSectionRef,
    () => {
      if (reduceMotion || !productEntranceRef.current) return;

      gsap.timeline({
        scrollTrigger: {
          trigger: heroSectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      })
        .to(productEntranceRef.current, { y: -60, scale: 0.94, ease: "none" }, 0)
        .to(botanicalsRef.current, { y: -20, ease: "none" }, 0)
        .to(headlineRef.current, { opacity: 0, y: -30, ease: "none" }, 0);
    },
    [reduceMotion]
  );
```

Add `import { useGsapContext, gsap } from "@/lib/gsapUtils";` to the top of the file.

This only runs for the fallback-hero branch (the `useGsapContext` call sits inside the same function as the rest of `HeroSlider`, but its `setup` callback early-returns via `!productEntranceRef.current`, which is only populated when the fallback branch renders — the CMS Swiper branch doesn't use this ref at all, so this is a safe no-op there). Note: `useGsapContext` is called unconditionally on every render of `HeroSlider` regardless of which branch renders — this matches React's rules-of-hooks requirement (hooks can't be called conditionally), and the `setup` function's own guard is what makes it a no-op on the CMS branch, not a conditional hook call.

**One accepted, narrow edge case to verify rather than over-engineer:** Motion's entrance animation on `productEntranceRef`'s node settles ~1.35s after mount (0.45s delay + 0.9s duration) and does not continue driving that node's transform afterward. GSAP's `ScrollTrigger` only starts producing non-zero scrub values once the user actually scrolls the hero out of the `"top top"` position — in the overwhelming majority of real sessions, that happens well after 1.35s. There is a narrow theoretical window (a user scrolling within the first ~1.3s of page load) where Motion's entrance and GSAP's scroll animation could both be targeting `productEntranceRef`'s transform simultaneously. Verify this visually in Step 6 by scrolling immediately on page load; if you observe a visible glitch (not just a theoretical concern), apply the same fix pattern Task 3 established — split GSAP's scroll target onto its own dedicated wrapper node, sibling to Motion's entrance node, rather than sharing one. Do not add this extra wrapper preemptively if the narrow-window case doesn't actually glitch — that would be solving a problem that isn't real.

- [ ] **Step 3: Verify — lint and type-check**

Run: `cd client-next && npm run lint`
Expected: no new errors beyond the established baseline.

- [ ] **Step 4: Verify — build**

Run: `npm run build`
Expected: succeeds (GSAP's `ScrollTrigger` registration is guarded by `typeof window !== "undefined"` in `gsapUtils.ts`, so this must not break SSR/static generation).

- [ ] **Step 5: Verify — visual smoke check**

Run: `npm run dev`, on the homepage:
- Scroll down slowly past the hero and confirm the product image drifts upward and shrinks slightly, the botanical illustrations move at a visibly different (slower) rate than the product image, and the headline fades out — all tied to scroll position, not time-based.
- Scroll back up and confirm the effect reverses smoothly (this is `scrub: true`'s job — verify it actually feels scroll-linked, not janky/delayed).
- Navigate away from the homepage (e.g. click into `/shop`) and back — confirm no console errors about a `ScrollTrigger` referencing a removed DOM node (this is what `useGsapContext`'s `ctx.revert()` cleanup exists to prevent — if you see such an error, the cleanup isn't firing correctly and this needs to be fixed, not ignored).
- Toggle `prefers-reduced-motion` and confirm no ScrollTrigger is created at all (no scroll-linked movement).
- Reload the homepage and scroll immediately (within ~1 second of load, before the entrance animation settles) — confirm there's no visible glitch/jump on the product image. Per Step 1's note, this is an accepted narrow edge case unless it's actually visible; if it is, apply the split-wrapper fix described there before proceeding.

- [ ] **Step 6: Commit**

```bash
git add src/components/home/HeroSlider.tsx
git commit -m "feat: add GSAP scroll-linked parallax to the hero (product shrink, botanical depth, headline fade)"
```

---

### Task 5: Heritage Introduction section

**Files:**
- Create: `src/components/home/HeritageIntroSection.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `IndianBorder` (existing, Phase 1), `motion` (`motion/react`, for the `whileInView` border draw-in).
- Produces: default-exported `HeritageIntroSection()` component with no props. `page.tsx` renders it via a new `"heritage_intro"` case.

- [ ] **Step 1: Create the section component**

Create `src/components/home/HeritageIntroSection.tsx`:

```tsx
"use client";

import React from "react";
import { motion } from "motion/react";
import IndianBorder from "@/components/decorative/IndianBorder";

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
          <IndianBorder variant="botanical" position="bottom" className="mt-8" />
        </motion.div>
      </div>
    </section>
  );
}
```

Note: `useReducedMotion` gating is intentionally skipped here — `whileInView` scale/opacity reveals of this magnitude (a short scroll-triggered fade/scale, not a continuous or large-motion effect) are commonly left enabled even under reduced motion, but if a stricter interpretation is wanted, wrap each `motion.*`'s `initial`/`whileInView` in the same `reduceMotion ? false : {...}` pattern Task 3 uses — decide during implementation by checking how `ScrollReveal`/other existing reveal patterns in this codebase already handle reduced motion for simple fades, and match that precedent rather than introducing a new convention.

- [ ] **Step 2: Wire the section into the homepage layout**

In `src/app/page.tsx`, add the import:

```tsx
import HeritageIntroSection from "@/components/home/HeritageIntroSection";
```

Add a new entry to `DEFAULT_LAYOUT` immediately after `"hero"`:

```tsx
const DEFAULT_LAYOUT = [
  { sectionId: "hero" },
  { sectionId: "heritage_intro" },
  { sectionId: "trust_badges" },
  { sectionId: "categories" },
  { sectionId: "featured_products" },
  { sectionId: "why_us" },
  { sectionId: "brand_story" },
  { sectionId: "achievements" },
  { sectionId: "testimonials" },
  { sectionId: "health_hub" },
  { sectionId: "newsletter" }
];
```

Add a new switch case immediately after the `"hero"` case:

```tsx
          case "heritage_intro":
            return <HeritageIntroSection key={`heritage-${index}`} />;
```

- [ ] **Step 3: Verify — lint and type-check**

Run: `cd client-next && npm run lint`
Expected: no new errors beyond the established baseline.

- [ ] **Step 4: Verify — visual smoke check**

Run: `npm run dev`, confirm the Heritage Introduction section appears directly below the hero, above Trust Badges. Scroll it into view and confirm the top/bottom `IndianBorder`s draw in (scale-x from 0.6→1 with a fade) and the statement text fades up, once, the first time it enters the viewport (scrolling away and back should not replay the animation, per `viewport={{ once: true }}`).

- [ ] **Step 5: Commit**

```bash
git add src/components/home/HeritageIntroSection.tsx src/app/page.tsx
git commit -m "feat: add Heritage Introduction section with animated IndianBorder framing"
```

---

### Task 6: CMS Swiper hero — palette audit

**Files:**
- Modify: `src/components/home/HeroSlider.tsx` (only the CMS Swiper branch, roughly lines 155-187 as currently written — do not touch the `hero-fallback` branch, that's Tasks 3-4's territory)

**Interfaces:** none — this is a read-and-verify task with at most small literal-value edits, no new exports or consumers.

- [ ] **Step 1: Audit for hardcoded colors**

Read the CMS Swiper branch (the `return` statement starting after the `if (!sliders?.length) { ... }` block closes). Check every inline `style` and every color-bearing class for values that bypass the Phase 1 token system:

- Line ~180 already uses `text-[var(--color-ivory)]` correctly — confirm this and similar existing usages are intact.
- Search specifically for any raw hex codes (`#` followed by 3 or 6 hex digits) or Tailwind arbitrary-value colors (`text-[#...]`, `bg-[#...]`) anywhere in this branch. If found, replace with the equivalent Phase 1 CSS custom property (e.g. `var(--color-espresso)`, `var(--color-secondary-brown)`, `var(--nav-on-hero)`) — match the color's apparent intent (dark text vs. light text vs. accent) rather than guessing a token by name alone.
- Confirm `.hero-title`/`.hero-subtitle`/`.hero-stat`/`.hero-overlay` (the CSS classes this branch uses, defined in `globals.css`) already reflect Phase 1's palette — they should, since Phase 1 Task 1 remapped the underlying tokens these classes reference (`--color-ivory`, `--color-espresso`, `--color-walnut`) rather than redefining the classes themselves. Confirm by reading the current `globals.css` rules for these classes, don't assume.

- [ ] **Step 2: Confirm typography inherits Phase 1's scale**

Confirm `text-4xl md:text-6xl lg:text-7xl` (used on the CMS hero's `<h1>`, line ~178) picks up Phase 1's `--font-size-6xl`/`--font-size-7xl` bump automatically — it should, since these are the same Tailwind utility classes Phase 1's token changes affect globally, not new classes. No code change needed here unless the audit in Step 1 finds something that contradicts this.

- [ ] **Step 3: Verify — lint**

Run: `cd client-next && npm run lint`
Expected: no new errors (this task may result in zero code changes if the audit finds nothing to fix — that's a valid, expected outcome, not a sign the task was skipped).

- [ ] **Step 4: Verify — visual smoke check (if CMS test data is available)**

If there's a way to configure test hero slider data in this environment (check the admin panel or seed scripts — do not fabricate CMS data structures speculatively), view the CMS hero and confirm it reads consistently with the rest of the redesigned site. If no CMS test data is available in this environment, note that explicitly in the report rather than skipping silently — this matches the same "not verifiable in this environment" honesty standard used in Phase 1.

- [ ] **Step 5: Commit** (only if Step 1 found something to fix)

```bash
git add src/components/home/HeroSlider.tsx
git commit -m "fix: align CMS hero slider colors with Phase 1 palette tokens"
```

If Step 1 found nothing to change, skip this commit and report the audit as clean in the task report instead.

---

### Task 7: Full verification pass

**Files:** none (verification only)

**Interfaces:** none — this task consumes the combined output of Tasks 1-6 and produces no code (unless it uncovers a real bug, in which case report it — do not fix it yourself in this task).

- [ ] **Step 1: Install and lint**

Run: `cd client-next && npm install && npm run lint`
Expected: `npm install` reports no changes (no new dependency was added across this plan); lint matches the established baseline (143 errors/85 warnings as of Phase 1's last commit — report the actual current count and confirm any difference is explained, same standard Phase 1's Task 12 used).

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: succeeds with no type errors, all routes generate.

- [ ] **Step 3: Full manual walkthrough**

Run `npm run dev` and, in a browser:
1. Homepage hero: new copy, headline word-reveal, botanical framing fade-in, product scale-in, existing mouse-tilt still works, header legible over the hero at the very top of the page (the scrim from Task 3).
2. Scroll the hero: product drift/shrink, botanical parallax depth, headline fade — all scroll-linked (use `scrub`, not time-based).
3. Heritage Introduction section: border draw-in + statement fade, once only.
4. Navigate to `/shop` and back to `/`: no console errors from a stale `ScrollTrigger`.
5. Toggle `prefers-reduced-motion`: hero renders instantly with no animation, no `ScrollTrigger` created, Heritage Introduction section's motion is at minimum non-jarring (per Task 5's note on its reduced-motion handling).
6. Resize to mobile width: hero layout holds, botanical framing doesn't overflow or crowd content, Heritage Introduction section text remains legible.
7. `/shop`, `/cart`: confirm nothing in this plan regressed Phase 1's opaque-header-on-non-home-routes behavior (this plan doesn't touch `Header.tsx`, so this should be unaffected — verify it actually is).
8. CMS Swiper hero (if testable per Task 6): palette consistency.

- [ ] **Step 4: Confirm workspace hygiene**

Run: `git status` in `client-next`. Expected: clean working tree, and `git stash list` still shows the original stash untouched (Task 1 only read from it via `git show`, never popped or dropped it).

- [ ] **Step 5: Report**

No commit for this task (verification-only) — record the walkthrough results (pass/fail per item above) in the task report for the controller/reviewer to read.
