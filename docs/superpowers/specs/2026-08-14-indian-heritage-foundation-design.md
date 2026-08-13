# Roshini's — Indian Heritage Redesign: Phase 1 (Foundation) Design

## Context

Roshini's Home Products is being redesigned from its current "old-world grocer"
aesthetic into a **premium contemporary Indian heritage brand** — combining
Kalamkari-inspired botanical linework, Madhubani-inspired geometric accents,
block-print texture cues, and editorial composition, without tipping into
"traditional/religious/festive/wedding-invitation" territory. The full brief
(30+ sections, covering hero, navigation, ingredient storytelling, product
showcase, nutrition, testimonials, footer, and a two-library motion
architecture) is too large for one spec, so the work is split into five
phases:

1. **Foundation** (this spec) — palette, typography scale, illustration
   system, texture, navigation
2. Hero + Heritage Introduction
3. Ingredients + Product Storytelling (the GRAIN→NUT→SEED→BLEND sequence)
4. Remaining sections (Why-Roshini's, Story, Nutrition, Testimonials,
   Marquee, final CTA, Footer)
5. Polish (mobile-specific treatment, reduced-motion, performance)

Phases 2–5 get their own brainstorm → spec → plan cycle once this one ships.

**Repo:** `client-next/` (Next.js 16, React 19, Tailwind v4) is its own git
repository, separate from `server/`. This phase touches `client-next/` only —
no backend/API changes.

**Constraint (non-negotiable, from root `CLAUDE.md`):** the `quantitiy`
field spelling, cart/checkout/payment logic, product data, auth, and SEO are
untouched. This phase is visual/structural only.

**Constraint (from `client-next/AGENTS.md`):** this is Next.js 16 with
React 19 — behavior may differ from training data; consult
`node_modules/next/dist/docs/` for anything unfamiliar (e.g. the
`<ViewTransition>` primitive used by the earlier motion plan) before writing
code that depends on it.

### Existing foundation confirmed by reading the code

- **Palette**: `src/app/globals.css` `:root` (lines 11–280) defines a large
  token system — `--primary-brown #5D310E`, `--secondary-brown #AE6837`,
  `--premium-gold #C28B36`, `--organic-green #5E7D32`, legacy aliases
  (`--espresso`, `--walnut`, `--terracotta`, `--sage`, `--charcoal`), full
  `--brown-50…900` / `--green-50…900` ramps, background/surface tokens
  (`--bg`, `--bg-warm`, `--surface`, …), text tokens, shadows, spacing,
  motion durations/easings. A parallel `html.dark` block (lines 286–364)
  redefines most of these for dark mode. Everything is registered into
  Tailwind v4 via `@theme inline` (lines 370–507).
- **A second, independent color system**: `src/lib/CustomizationContext.tsx`
  injects `--brand-brown`, `--brand-brown-dark`, `--brand-brown-light`,
  `--brand-cream`, `--brand-cream-dark` into `:root` at runtime via a
  `<style>` tag, sourced from `GET /api/customize/get-settings` (admin
  panel), with `defaultSettings` (lines 24–33) as the fallback before the
  fetch resolves. These tokens are consumed directly in `ProductCard.tsx`,
  `HomeSections.tsx`, `page.tsx`, `ProductInteractiveDetails.tsx`, and the
  auth/account pages — so this is a live, actively-used second palette, not
  dead code. It does **not** overlap with the `--primary-brown` family above
  even though both represent "the brown."
- **Typography**: `next/font` is not used; fonts load via a `<link>` tag in
  `layout.tsx` (54–60) — **Fraunces** (400–700 + italic, registered as
  `--font-serif`) and **Poppins** (300–700, registered as `--font-sans`),
  plus Merriweather (loaded but not wired into the Tailwind theme). Fraunces
  is already a high-contrast editorial serif and Poppins is already a clean
  modern sans — this matches the brief's typography direction closely.
- **Animation libraries**: both `gsap` (^3.15.0) and `motion` (^13.1.0, the
  current Framer Motion) are already installed and used throughout
  (`Header.tsx`, `ProductCard.tsx`, `HomeSections.tsx`, `HeroSlider.tsx` via
  `ScrollTrigger`). No new animation dependency is needed for this phase.
- **No illustration/decorative SVG system exists.** `public/` has only
  Next.js boilerplate SVGs and product/logo raster images. Icons in the UI
  today are inline stroke-style SVGs or raw emoji. This phase introduces the
  first piece of that system.
- **Navigation**: `src/components/partials/Header.tsx` (via
  `HeaderWrapper.tsx`) is a `sticky top-0` header with a full-width top
  announcement/language-selector bar, an always-opaque `.site-header`
  background (`globals.css` ~1881), inline always-visible search field with
  autocomplete, nav links (Shop, Blogs, Our Story, conditional Admin), cart
  icon with count badge, and a `motion`-animated mobile drawer. It is
  **not** transparent-over-hero today — scrolling only toggles `.is-scrolled`
  (adds blur/shadow/translucency), it doesn't start transparent.
- **Homepage composition**: `src/app/page.tsx` renders a CMS-driven ordered
  section list (`DEFAULT_LAYOUT`, lines 21–33) via a switch statement
  (56–83): `HeroSlider`, then from `HomeSections.tsx`: `TrustBadgesSection`,
  `BrandMarqueeSection`, `CategoriesSection`, `FeaturedProductsSection`,
  `WhyUsSection`, `BrandStorySection`, `AchievementsSection`,
  `TestimonialsSection`, `NewsletterSection`, `HealthHubSection`. Footer is
  hardcoded inline in `page.tsx` (86–144), not a separate component.

### Workspace note

`client-next` was on `main` with ~16 uncommitted files that appear to be a
completed (but never committed) implementation of an earlier, narrower
"motion & interaction upgrade" plan (`src/components/motion/*`,
`src/lib/{gsapUtils,motionConfig,useMotionPrefs}.ts`, plus edits to
`Header.tsx`, `HeroSlider.tsx`, `HomeSections.tsx`, `ProductCard.tsx`,
`globals.css`, etc.). Per the user's direction, that work was **stashed**
(`git stash` — message "wip: motion-interaction-plan (pre Indian heritage
redesign)") rather than committed or discarded, and this phase's work
happens on a fresh branch (`redesign/indian-heritage-foundation`) cut from
clean `main`. The stash is preserved for a future decision and is not part
of this phase's scope. Because the stash already contains working
`gsapUtils.ts` / `motionConfig.ts` / `useMotionPrefs.ts` / motion primitives,
a later phase may choose to `git stash show -p` and cherry-pick pieces
rather than rebuild them — that decision is out of scope for Phase 1, which
does not touch animation primitives at all (Phase 1 is static/visual only:
palette, type scale, illustration component, texture, nav markup/CSS). Any
motion/transition work on the nav (e.g. the transparent→opaque scroll
transition) uses plain CSS transitions, not `motion`/`gsap`, keeping this
phase's diff independent of the stashed work.

## Goals

1. Replace the brand palette (both token systems) with the brief's premium
   Indian-heritage palette, expressed as regenerated tint/shade ramps so
   every existing component re-skins without individual edits.
2. Tune typographic scale/spacing for an editorial feel — no new fonts.
3. Introduce a reusable, hand-authored SVG `IndianBorder` component
   (botanical / geometric / minimal variants) establishing the illustration
   linework style later phases will reuse for ingredient icons.
4. Add a barely-perceptible paper-grain texture layer.
5. Redesign the navigation to a minimal-luxury layout: transparent-over-hero
   on the homepage only, opaque elsewhere (as today), with Search as an
   icon-triggered overlay, the language selector folded into a compact
   control, and the Admin link visually de-emphasized.

## Non-goals (explicitly deferred to later phases)

- No new sections (Heritage Introduction, Ingredient showcase, Product
  storytelling sequence, etc.) — Phase 2/3.
- No scroll-linked or GSAP-driven animation — Phase 1 is static, using only
  existing CSS transitions for the nav's scroll state change.
- No new `/ingredients` page — the nav's "Ingredients" link points at a
  `#ingredients` anchor on the homepage that is inert until Phase 3 adds
  that section.
- No resolution of the stashed motion-plan work — left stashed, revisited
  later.
- No changes to cart, checkout, payment, auth, product data/API, or SEO.

## Design

### 1. Palette

New base colors (from the brief):

| Role | Hex | Brief name |
|---|---|---|
| Primary / darkest brown | `#4A2618` | Deep Earth Brown |
| Secondary accent | `#A95636` | Terracotta |
| Background / ivory | `#F7F0E4` | Warm Ivory |
| Accent | `#C88A3D` | Muted Saffron |
| Rare accent | `#24384A` | Deep Indigo |
| Optional sparing accent | `#53634A` | Botanical Green |
| Darkest text/neutral | `#1C1917` | Dark Charcoal |

**Mapping strategy** (so every existing consumer re-skins automatically):

- `--primary-brown`, `--espresso`, `--text-heading-primary` family →
  `#4A2618`
- `--secondary-brown`, `--walnut`, `--terracotta`, `--accent-terracotta`
  family → `#A95636`
- `--premium-gold` → `#C88A3D`
- `--organic-green`, `--sage`, `--accent-leafgreen` family → `#53634A`
  (used sparingly per the brief — this phase only remaps the token; it does
  not add new green UI surfaces)
- `--bg`, `--bg-main`, `--bg-cream`, `--ivory`, `--linen`, `--surface-2/3`
  family → ramp anchored at `#F7F0E4`
- `--charcoal`, `--neutral-charcoal` → `#1C1917`
- New token `--indigo-accent: #24384A` added (no existing token maps to it —
  it's new to the system) for the rare accent use the brief describes (e.g.
  a single detail in a later phase's nutrition section); **not** applied
  anywhere in Phase 1's own scope (nav/borders/texture don't call for it),
  added now so later phases have it available without touching
  `globals.css` again.
- `--brown-50…900` and `--green-50…900` ramps regenerated from the new
  anchors (500 = the new base hex; existing lighter/darker steps
  recalculated proportionally to preserve the ramp's existing
  contrast/spacing behavior, not copied verbatim from the brief since the
  brief only specifies single hexes, not full ramps).
- `html.dark` block (286–364) updated in parallel with dark-mode-appropriate
  variants of the same hues (darker ivory→near-black background, lighter
  brown for text-on-dark) so dark mode doesn't fall out of sync with light
  mode's new identity.
- `src/lib/CustomizationContext.tsx` `defaultSettings` (24–33) updated:
  `themePrimaryColor: "#4A2618"`, `themePrimaryColorDark`: a darker step of
  the same hue (not `#000`), `themePrimaryColorLight: "#A95636"`,
  `themeCreamColor: "#F7F0E4"`, `themeCreamColorDark`: a slightly deeper
  ivory step. Runtime admin overrides via `/api/customize/get-settings`
  still work exactly as before — this only changes what ships before an
  admin customizes it, per the user's decision that the redesign becomes
  the new fixed defaults.

Two token systems remain structurally separate (as they are today) — this
phase does not merge `--brand-*` into `--primary-brown` or vice versa, only
aligns their *values*. Merging them is a larger refactor outside this
phase's scope.

### 2. Typography

No new fonts. Changes are scale/spacing only, in `globals.css`'s typography
tokens (176–205) and the heading utility classes that consume them:

- Increase hero/section-heading sizes at the top of the existing scale
  (`--font-size-5xl/6xl/7xl`) for a more editorial, larger-than-web feel.
- Tighten `--line-height-tight` usage on display headings (already `1.1` —
  confirm it's actually applied to `h1`/hero headline classes, not just
  defined and unused).
- Slightly increase `--letter-spacing-wide/wider` usage on eyebrow/label
  text (small uppercase kickers like nav links, category labels) for an
  editorial-luxury feel, consistent with the brief's navigation spec
  ("generous spacing").

This is a tuning pass on existing classes, not a new type system.

### 3. Illustration system — `IndianBorder` component

New file: `src/components/decorative/IndianBorder.tsx` (new directory —
first entry in what becomes the illustration/decorative component library).

- **Props**: `variant: "botanical" | "geometric" | "minimal"`,
  `position?: "top" | "bottom" | "full"` (default `"top"`), `className?`.
- **Rendering**: inline `<svg>` with hand-authored `<path>` data, stroke
  using `currentColor` (so it inherits `color` from its wrapping element —
  themes automatically via the palette above, no hardcoded hex in the
  component).
  - `botanical`: a thin single-weight line motif of small leaves/vine
    curves/a stylized flower, restrained (not a dense pattern) — echoes
    Kalamkari linework without reproducing any specific traditional
    artwork.
  - `geometric`: a repeating small triangle/dot motif in a single row,
    evoking Madhubani/block-print geometry, restrained spacing (not a
    busy tiled pattern).
  - `minimal`: a single thin horizontal rule with one small centered
    botanical flourish (a stripped-down variant for footer/subtle use).
- **Usage in this phase**: applied only where the brief calls it
  "strategic" and where a matching section already exists —
  hero top frame (subtle, low-opacity, corner treatment — exact placement
  finalized visually during implementation since the hero also holds the
  product image) and footer top border (replacing the plain top border rule
  the footer currently has). Heritage-intro, ingredient, and story-section
  borders are added in Phase 2/3 when those sections exist.
- **Style guardrails carried into later phases**: consistent stroke width
  (defined once as a constant/CSS variable inside the component so Phase 3's
  ingredient icons match), no fills beyond the line work itself, no color
  outside the token system.

### 4. Texture

A single low-opacity (~3–4%) tiled paper-grain background, implemented as an
inline SVG `feTurbulence`-based data URI (or a small pre-generated static
SVG data URI — implementer's choice, whichever renders more consistently
across browsers) applied via a new `--texture-grain` custom property /
utility class on `body` (or a dedicated wrapping div in `layout.tsx`). No
blur filters, no animation, no new npm dependency. Must remain under the
brief's "felt, not noticed" bar — implementer should sanity-check the
opacity visually before committing to a value, the ~3–4% figure is a
starting point, not a hard requirement.

### 5. Navigation

`Header.tsx` / `HeaderWrapper.tsx` / `globals.css` `.site-header` rules:

- **Link set**: center nav becomes Shop / Our Story / Journal (label change
  only — same route as today's "Blogs") / Ingredients (new link → homepage
  anchor `href="/#ingredients"`, no new page).
- **Search**: replace the always-visible inline search field with a search
  icon button that expands an overlay/panel containing the existing
  autocomplete search field and logic (the underlying search
  fetch/autocomplete behavior is unchanged — only its visual trigger
  changes from "always shown" to "icon-triggered").
- **Language selector**: remove the current full-width top announcement bar;
  the language-selection functionality (unchanged — still the same 11
  languages, same mechanism) moves into a compact icon+dropdown control in
  the header's right-hand cluster, alongside Search/Cart.
- **Admin link**: stays, still rendered only for admin users, but restyled
  to a visually muted/smaller treatment so it doesn't compete with the
  primary four nav links.
- **Transparent-over-hero**: on the homepage route only, the header renders
  transparent (no background, light/ivory text+icon color suitable for
  sitting over the hero image) at the top of the page, and crossfades to
  the existing opaque `.site-header` treatment once scrolled past the hero
  — implemented via a scroll-position class toggle (reusing the existing
  `.is-scrolled` mechanism/pattern) and plain CSS transitions on
  background/color, consistent with "no `motion`/`gsap` in this phase."
  Every other route (`shop`, `cart`, `product/*`, `blogs/*`, account/auth
  pages) keeps today's always-opaque header — there is no hero image on
  those routes to sit transparently over.
- **Spacing**: generous horizontal padding/gaps between the three nav
  clusters (logo / center links / icons), consistent with the brief's
  "minimal luxury" direction.

## Files touched (representative)

- `src/app/globals.css` — palette token values + ramps, `html.dark` block,
  typography scale tuning, `.site-header` transparent/scrolled states,
  texture utility, footer border rule.
- `src/lib/CustomizationContext.tsx` — `defaultSettings` values only.
- New: `src/components/decorative/IndianBorder.tsx`.
- `src/components/partials/Header.tsx` (and `HeaderWrapper.tsx` if scroll/
  route-detection logic belongs there) — link set, search overlay, language
  control relocation, admin link styling, transparent-hero state.
- `src/app/page.tsx` — footer's border treatment (uses `IndianBorder`), and
  add an `id="ingredients"` anchor point in the existing layout near where
  Phase 3's ingredient section will land (a no-op empty anchor, not a new
  section).
- `src/app/layout.tsx` — texture layer mount point, if implemented as a
  layout-level wrapper rather than a pure CSS `body` rule.

**Not touched**: cart/checkout/payment (`src/lib/cart.ts`, payment flow),
product data/API layer, admin pages beyond the customization defaults
above, auth logic, SEO metadata, `server/`.

## Testing / Verification

1. `cd client-next && npm install && npm run lint` — no new dependency is
   added in this phase, so `npm install` should be a no-op; run it anyway to
   confirm `package-lock.json` is undisturbed.
2. `npm run dev` — visually verify: homepage nav is transparent over the
   hero and crossfades to opaque on scroll; non-homepage routes (`/shop`,
   `/cart`) show the opaque header from initial render; search icon expands
   the overlay and existing autocomplete still works; language dropdown
   still switches languages; admin link (log in as admin) still navigates
   correctly and reads as visually secondary; footer shows the new
   `IndianBorder` top treatment; overall palette reads as the new
   ivory/deep-brown/terracotta/saffron identity across header, buttons,
   cards, footer.
3. Toggle admin customization settings (`/admin` → branding/theme
   settings) and confirm the `--brand-*` override still works — i.e. the
   new defaults don't accidentally hardcode over the live admin-override
   mechanism.
4. Resize to mobile width — confirm nav collapses sensibly (existing mobile
   drawer pattern, now themed with the new palette and link set).
5. `git status` in `client-next` — confirm only the files listed above (plus
   this spec file) changed, and the earlier stash remains untouched
   (`git stash list` still shows it).

## Open items carried to later phases

- Whether to cherry-pick pieces of the stashed motion-plan work
  (`gsapUtils.ts`, `motionConfig.ts`, `useMotionPrefs.ts`, `src/components/
  motion/*`) when Phase 2+ needs scroll-driven/entrance animation, versus
  rebuilding fresh — decide when that phase is brainstormed.
- `--indigo-accent` token exists after this phase but has no consumer yet;
  first real use is expected in the Nutrition section (Phase 4).
- Exact hero placement/sizing of the `IndianBorder` botanical frame is a
  visual-judgment call for the implementer within this spec's constraints
  (subtle, corner-anchored, not competing with the product image) — Phase 2
  may adjust it further once the full hero entrance sequence is designed.
