# Roshini's — Indian Heritage Redesign: Phase 2 (Hero + Heritage Introduction) Design

## Context

Phase 1 (Foundation — palette, typography, the `IndianBorder` illustration
component, texture, navigation) is complete on `redesign/indian-heritage-foundation`.
Phase 2 is the first phase that changes what a visitor actually *sees* as
distinctively "Indian heritage": a rebuilt hero and a new heritage-statement
section immediately after it.

**Repo:** `client-next/` only, same branch conventions as Phase 1 (this
phase's work happens as new commits on `redesign/indian-heritage-foundation`,
or a new branch cut from it — decided at planning time).

### Existing foundation confirmed by reading the code

- **Two structurally different heroes exist** in `src/components/home/HeroSlider.tsx`:
  1. `hero-fallback` (lines 84-152) — rendered when no CMS sliders are
     configured. Already a two-column editorial layout: left text column
     (eyebrow via `.section-label`, `display-heading` h1, description,
     CTA buttons via `MagneticButton`), right column with the real flagship
     product photo, 2.5D mouse-tilt (`imageWrapRef`/`glowRef`, gated on
     `pointer: fine` + `!prefers-reduced-motion`), and a radial glow layer.
     Background: light `linen`/`ivory` gradient (`.hero-fallback` in
     `globals.css`).
  2. CMS Swiper hero (lines 155-187) — rendered when `sliders?.length` is
     truthy. Full-bleed background image per slide, dark `.hero-overlay`
     gradient (espresso/walnut → transparent), autoplay via Swiper,
     admin-configured title/subtitle/description/CTA/badges. Structurally
     unrelated to the fallback — driven by admin-uploaded content, not by
     this codebase's layout.
  - **Decision (confirmed with the user):** this dev environment and,
    per the user, likely production as well, has no CMS sliders configured
    — the fallback hero is what real visitors see. Phase 2 rebuilds the
    **fallback hero**. The CMS Swiper hero gets a palette/typography-only
    pass (reusing Phase 1's tokens) so it doesn't visually clash if a
    merchant configures it later, but is not structurally reworked.
- **Phase 1's transparent-nav mechanism** (`Header.tsx`, `.site-header.is-hero-overlay`
  / `.is-transparent` in `globals.css`) already assumes the header floats
  over whichever hero renders on `/`, using `var(--nav-on-hero)` (`#F7F0E4`,
  non-inverting) for text/icon color while unscrolled. This was fixed and
  verified against the fallback hero's *current* light background during
  Phase 1's final-review fix wave — Phase 2 must not regress that fix, and
  should treat header legibility as a first-class constraint of the new
  hero's visual design (not something to retrofit after).
- **A stashed, never-committed set of 9 files** from an earlier, unrelated
  motion-upgrade attempt was reviewed and found high-quality: SSR-safe
  media-query hooks (`src/lib/useMotionPrefs.ts`: `useReducedMotion`,
  `usePointerFine`, `useCanHover`), a shared timing/easing config
  (`src/lib/motionConfig.ts`), a GSAP `useGsapContext` helper with proper
  `gsap.context()`/`.revert()` cleanup (`src/lib/gsapUtils.ts`), and six
  `src/components/motion/` primitives: `RevealText`, `FadeUp`/`StaggerGroup`/`StaggerItem`,
  `ImageReveal`, `ParallaxLayer`, `Marquee`, `CursorFX`. All are
  `prefers-reduced-motion`/`pointer`-gated correctly and match the original
  brief's animation architecture (Motion for entrance/stagger, GSAP
  ScrollTrigger reserved for 2-4 genuinely cinematic scroll-linked
  sequences). They live at `stash@{0}^3:<path>` (the stash's
  untracked-files commit) — recoverable via `git show stash@{0}^3:<path>`
  without touching the stash itself, since the stash's *modified*-file
  changes (globals.css, HeroSlider.tsx, Header.tsx, HomeSections.tsx,
  ProductCard.tsx, page.tsx) conflict heavily with Phase 1's rewrites of
  those same files and must NOT be applied.
  - **Scope decision:** Phase 2 extracts and wires up only the 7 files it
    actually consumes — `useMotionPrefs.ts`, `motionConfig.ts`,
    `gsapUtils.ts`, `RevealText.tsx`, `FadeUp.tsx`, `ImageReveal.tsx`,
    `ParallaxLayer.tsx`. `Marquee.tsx` (needed by a later phase's marquee
    section) and `CursorFX.tsx` (site-wide, not phase-specific) stay in the
    stash, extracted when a phase actually uses them — per YAGNI, this
    phase shouldn't ship unused components.
- **`motion` (^13.1.0) and `gsap` (^3.15.0, via `gsap/ScrollTrigger`) are
  already installed** (confirmed in Phase 1) but currently unused in the
  live codebase — Phase 2 is the first phase to actually import them.
- **No `RevealText`/`FadeUp`/etc. naming conflicts** — confirmed no files
  currently exist at `src/components/motion/*` or `src/lib/{useMotionPrefs,motionConfig,gsapUtils}.ts`
  on `redesign/indian-heritage-foundation`.

## Goals

1. Rebuild the fallback hero into the brief's composition: eyebrow +
   headline + description + CTA (left), product photo framed by new
   botanical illustrations (right), with a full entrance animation
   sequence and a scroll-linked parallax/shrink effect.
2. Add 5 new hand-drawn botanical SVG illustrations (millet-stalk sprig,
   almond branch, small flower cluster, leaf pair, seed scatter) in the
   same restrained linework style as `IndianBorder`, used to frame the
   hero product image.
3. Add a new "Heritage Introduction" section immediately after the hero: a
   large serif editorial statement framed by an animated `IndianBorder`
   (botanical variant).
4. Bring forward the 7 needed stashed motion-primitive files, reviewed and
   integrated (not blindly reused) into the current codebase.
5. Give the CMS Swiper hero a light palette/typography pass for
   consistency, without restructuring it.
6. Preserve and re-verify Phase 1's transparent-nav-over-hero fix against
   the new hero design.

## Non-goals (deferred to later phases)

- No ingredient showcase section, no product-storytelling GRAIN→NUT→SEED→BLEND
  sequence — Phase 3.
- No Marquee section, no Why-Roshini's/Story/Nutrition/Testimonials
  reskinning, no final CTA/footer rework — Phase 4.
- No site-wide cursor effect (`CursorFX`) — not phase-assigned yet, revisit
  when a phase's scope naturally calls for it.
- No restructuring of the CMS Swiper hero's layout, autoplay behavior, or
  admin-configurable fields.
- No changes to cart, checkout, payment, auth, product data/API, or SEO.

## Design

### 1. Hero rebuild (`hero-fallback` branch of `HeroSlider.tsx`)

Keep the existing two-column grid structure and the real flagship-product
photo + 2.5D tilt (both already solid). Changes:

- **Left column:** eyebrow label (`.section-label`, existing class) updated
  to "CRAFTED FROM INDIA'S GRAINS & NUTS" (replacing the current
  "Wholesome Food, Made With Intention," which duplicates the headline
  below it almost verbatim); headline updated to "Wholesome food, rooted
  in tradition." and promoted to `RevealText` (word-by-word reveal,
  `as="h1"`, matches the brief's text-reveal spec); description updated to
  "Thoughtfully blended millet, nuts and seeds for everyday nourishment."
  (tighter than the current sentence, same factual claims — no new health
  claims introduced); CTA row unchanged structurally (`MagneticButton` +
  ghost link already exist and work) — primary CTA label updated to "SHOP
  NUTRIMIX" when a flagship product resolves (falls back to today's "Shop
  Now" logic when it doesn't), secondary "Explore the Blend" link
  unchanged.
- **Right column:** product photo unchanged structurally; the existing
  radial glow (`glowRef`) stays as the "far" depth layer; the 5 new
  botanical illustrations are added as a "mid" depth layer around/behind
  the product (corner-anchored, restrained — framing, not competing with
  the product per the brief's explicit instruction).
- **Entrance sequence (Motion, on mount):** background fades in → botanical
  illustrations draw on (staggered opacity/scale) → headline reveals via
  `RevealText` → description fades up via `FadeUp` → CTA row fades up →
  product image scales 0.92→1 → glow/illustrations settle last. Sequenced
  via Motion variants with `delayChildren`/`staggerChildren`, not manual
  `setTimeout` chains.
- **Scroll behavior (GSAP, via `useGsapContext`):** as the user scrolls
  past the hero, the product image drifts up and scales down slightly, the
  botanical illustrations parallax at a different rate (depth), and the
  headline fades — one `ScrollTrigger` scoped to the hero section via
  `gsap.context()`, cleaned up on unmount per `gsapUtils.ts`'s existing
  pattern.
- **Reduced motion:** `useReducedMotion()` (from the extracted
  `useMotionPrefs.ts`) gates both the entrance sequence (renders final
  state immediately, no animation) and the GSAP ScrollTrigger (not created
  at all).
- **Header legibility:** the new hero's background/imagery must keep
  sufficient contrast for `var(--nav-on-hero)` text in the header's
  transparent state — verify this explicitly as part of implementation,
  not as an afterthought (this is the exact caveat carried forward from
  Phase 1).

### 2. Botanical illustration set (5 new SVGs)

New file(s) under `src/components/decorative/` (exact file organization —
one file per motif vs. a single file exporting five components — decided
at planning time, following `IndianBorder.tsx`'s established patterns:
`currentColor` stroke, `vectorEffect="non-scaling-stroke"`, `.svg`
CSS-class-based color/opacity per Phase 1's final-review fix rather than
inline style).

- Millet-stalk sprig
- Almond branch
- Small flower cluster
- Leaf pair
- Seed scatter

Restrained, single-weight line art — no dense patterns, no fills beyond
the linework itself, consistent stroke weight with `IndianBorder`.

### 3. Heritage Introduction section

New component (e.g. `src/components/home/HeritageIntroSection.tsx`),
inserted into `src/app/page.tsx`'s `DEFAULT_LAYOUT`/switch immediately
after the hero case and before `trust_badges` (both the `DEFAULT_LAYOUT`
array and the switch statement need a new `"heritage_intro"` case — since
this is a fixed, non-CMS-configurable section like the hero, not something
an admin toggles).

- Large serif editorial statement: "Born from the grains, nuts and seeds
  that have nourished Indian kitchens for generations." (per the original
  brief; no overstated health claims, consistent with the FSSAI-compliance
  note carried in the mega-brief).
- Framed by `<IndianBorder variant="botanical" position="top" />` (and
  optionally `position="bottom"`), animated to draw itself in via Motion's
  `whileInView` once scrolled into view — reusing `IndianBorder` as-is
  (Phase 1 already made its color/opacity CSS-overridable and its stroke
  non-scaling, so it's ready for this without changes).

### 4. CMS Swiper hero — palette pass only

In the CMS-driven branch of `HeroSlider.tsx` (lines 155-187), confirm/adjust
any hardcoded colors to reference Phase 1's tokens (e.g. `--color-ivory`
already used at line 180 — audit for anything still hardcoded), and confirm
typography classes pick up Phase 1's type-scale changes automatically (they
should, since `.hero-title`/`.hero-subtitle` are shared classes already
updated in Phase 1). No structural changes to the Swiper carousel, slide
data model, or admin-configurable fields.

### 5. Stashed file integration

Extract via `git show stash@{0}^3:<path> > <path>` (read-only against the
stash, doesn't touch/pop it) for the 7 files listed in Goals #4, place them
at their original paths, review each against Phase 2's actual usage (the
files were reviewed for quality during brainstorming but should get a real
task-level review during implementation like any other new code — not
exempted from review just because they pre-date this phase).

## Files touched (representative)

- Rewritten: `src/components/home/HeroSlider.tsx` (fallback hero rebuild +
  entrance/scroll animation; CMS branch gets a light palette audit only)
- New: `src/components/decorative/` botanical illustration file(s) (5
  motifs), `src/components/home/HeritageIntroSection.tsx`
- New (extracted from stash, reviewed): `src/lib/useMotionPrefs.ts`,
  `src/lib/motionConfig.ts`, `src/lib/gsapUtils.ts`,
  `src/components/motion/RevealText.tsx`, `FadeUp.tsx`, `ImageReveal.tsx`,
  `ParallaxLayer.tsx`
- Edited: `src/app/page.tsx` (new `"heritage_intro"` layout entry + switch
  case), `src/app/globals.css` (additive — any new utility classes the
  hero/heritage-intro sections need; no re-litigating Phase 1's tokens)
- Not touched: cart/checkout/payment, product data/API, auth, SEO,
  `server/`, the CMS Swiper hero's structure/data model, `Marquee.tsx`,
  `CursorFX.tsx` (left in the stash for their eventual phase).

## Testing / Verification

1. `cd client-next && npm install` (adds `motion`/`gsap` usage — both
   already in `package.json`, so this should be a no-op) `&& npm run lint`.
2. `npm run dev` — verify hero entrance sequence on load, scroll-driven
   product shrink/parallax, header legibility over the new hero at both
   unscrolled and scrolled states (re-confirm Phase 1's fix still holds),
   Heritage Introduction section's border draw-in animation, and the CMS
   Swiper hero (if test data is available) for palette consistency.
3. Toggle `prefers-reduced-motion` — confirm the entrance sequence and
   scroll effects are fully disabled, content is immediately visible and
   usable.
4. Resize to mobile — confirm the hero's illustration layer and parallax
   are reduced/disabled per the original brief's mobile-intentionality
   guidance, and layout remains legible.
5. `npm run build` — production build must pass (this project has no
   configured test runner, per Phase 1's established pattern; build +
   lint + manual verification is the verification bar).
6. `git status` — confirm only the files listed above changed.
