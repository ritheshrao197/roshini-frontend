# Roshini's — Indian Heritage Redesign: Phase 3 (Ingredients + Product Storytelling) Design

## Context

Phase 1 (Foundation) and Phase 2 (Hero + Heritage Introduction) are complete on
`redesign/indian-heritage-foundation` in `client-next/`. Phase 3 is the first
phase to touch the backend: it adds a new `ingredients` resource to `server/`
and consumes it from a new ingredient showcase section and a cinematic
GRAIN→NUT→SEED→BLEND product-storytelling sequence in `client-next/`.

**Repos:** `server/` and `client-next/` are separate git repositories under
one working directory (per root `CLAUDE.md`). This phase touches both — the
first phase to do so. Each repo gets its own implementation plan and SDD
workspace/ledger; this one spec covers both, since they're one coupled
feature from the user's perspective.

**Naming collision, already resolved with the user:** an unrelated,
unexplained process has left uncommitted files at
`src/components/home/IngredientShowcaseSection.tsx` and
`.../ProductStorytellingSection.tsx` in `client-next/` (discovered during
Phase 2's final review; investigated, left untouched, user directed to build
under different names rather than touch or overwrite them). This phase's
frontend section components are therefore named `IngredientGallerySection.tsx`
and `GrainToBlendStorySection.tsx` — chosen specifically to avoid any path
collision with those files or the other stray files found alongside them
(`AbstractBackground.tsx`, `ArtBackground.tsx`, `GoldParticles.tsx`,
`HeritageMarquee.tsx`, `KarnatakaHeritageStrip.tsx`, `CustomCursor.tsx`,
`IntroLoader.tsx`).

### Existing conventions confirmed by reading the code

**Server** (`achievements` is the closest precedent, confirmed by reading it
in full):
- Three files per resource: `models/<resource>.js` (Mongoose schema, plain
  `mongoose.model()` call, `{ timestamps: true }`), `controller/<resource>.js`
  (a single class instantiated once at module load, mixing public and admin
  methods), `routes/<resource>.js` (public) + `routes/admin<Resource>.js`
  (admin) — the public/admin file split `CLAUDE.md` documents for
  vlogs/achievements (categories is the one exception, not followed here).
- Admin routes use `loginCheck` alone (`middleware/auth.js`) — confirmed
  the RBAC matrix in `config/permissions.js` already has an unused
  `MANAGE_ACHIEVEMENTS`-shaped entry but is not wired into any route
  anywhere in the codebase; every simple resource's admin routes use
  `loginCheck` only. This phase follows that actual convention, not the
  unused RBAC scaffolding — introducing real RBAC enforcement here would be
  a separate, unrelated change.
- `app.js` requires both route files near the top and mounts both under
  bare `/api` (`app.use("/api", achievementRouter)` /
  `app.use("/api", adminAchievementRouter)`) — paths differentiate inside
  each route file (`/achievements` vs `/admin/achievements`).
- `displayOrder` (Number, default 0) is the established manual-ordering
  field, sorted `{ displayOrder: 1, createdAt: -1 }` — no drag-and-drop
  reorder endpoint exists anywhere; an admin edits the number per record.
- Public GET response shape: `{ <pluralResourceName>: [...] }` (bare array
  under a key named after the resource, not a `{success, data}` envelope).
- `controller/homepage.js`'s `getHomepageData` aggregates products,
  categories, achievements, sections, vlogs, and hero sliders via
  `Promise.all`, returning them as top-level keys in one JSON response —
  this is what `client-next`'s `getHomePageData()` calls by default.
- Two image-handling precedents exist: a bare `icon: String` field
  (achievements — admin pastes an emoji or URL) and a full Cloudinary
  upload flow (categories — multer → `imageValidator` → zod validation →
  `services/cloudinaryUpload.js`). **Neither is used here** — see Goals.

**Client** (confirmed by reading `src/lib/api.ts`):
- Each resource gets a TypeScript interface + a `getX()` function using
  `fetchPublicWithTimeout`, parsing `data.<key> || []`, with Next.js
  `next: { revalidate, tags }` caching.
- `HomePageData` is a flat interface matching the server aggregate's keys;
  `getHomePageData()` fetches `/api/homepage` first, falling back to
  individual per-resource calls (including a call to whatever new
  `getIngredients()` this phase adds) if that aggregate call fails.
- **Phase 2's CMS-bypass lesson applies directly here:** section visibility
  is controlled by the `sections`/`DEFAULT_LAYOUT`/`FIXED_SECTIONS` system
  in `src/app/page.tsx`. Phase 2 learned the hard way that anything meant
  to always render must be in the `FIXED_SECTIONS` set, rendered as fixed
  JSX — not added only to `DEFAULT_LAYOUT`, which a populated real CMS
  `sections` collection silently bypasses. This phase's two new sections
  follow the established fixed pattern from the start, not as a
  follow-up fix.
- `IndianBorder`, `RevealText`, `FadeUp`/`StaggerGroup`/`StaggerItem`,
  `useGsapContext`/`gsap`, `useMotionPrefs` are all available, reviewed,
  and already used correctly elsewhere (Phase 1/2) — this phase reuses
  them, doesn't reinvent them.

## Goals

1. **Server:** add an `ingredients` resource (model, public + admin
   routes/controller, `app.js` mounting, inclusion in the homepage
   aggregate) matching the `achievements` pattern exactly. Seed the 17
   ingredients from the original brief.
2. **Client:** add `getIngredients()`/`Ingredient` type to `api.ts`, extend
   `HomePageData`.
3. **Client:** a small family of hand-drawn SVG icon *primitives*
   (grain-stalk, round-nut, small-seed, elongated-pod), parametrized per
   ingredient rather than 17 fully bespoke illustrations — same restrained
   linework as `IndianBorder`/`HeroBotanicals`, keeping this tractable
   while still reading as an intentional, cohesive system (not 17 unrelated
   one-off drawings).
4. **Client:** `IngredientGallerySection.tsx` — a responsive card grid
   (icon + name + short description per card), `StaggerGroup`/`StaggerItem`
   entrance per the brief's spec (opacity 0→1, y 30→0, scale 0.96→1,
   80-120ms stagger). Replaces the current empty `#ingredients` anchor
   placeholder in `FeaturedProductsSection`'s slot.
5. **Client:** `GrainToBlendStorySection.tsx` — the cinematic
   GRAIN→NUT→SEED→BLEND→ROSHINI'S GSAP ScrollTrigger sequence, using one
   representative icon per *category* (not all 17 — the sequence is about
   categories converging, not an icon crowd), converging toward a central
   product composition, ending on "Made thoughtfully for everyday
   nourishment." + a "SHOP NOW" CTA.

## Non-goals

- No RBAC/permission-matrix wiring for the new admin routes — matches the
  existing `loginCheck`-only convention, not a scope-creep improvement.
- No Cloudinary image upload for ingredients — icons are hand-coded
  frontend SVG, keyed by a backend `iconKey` string (per the user's
  explicit decision, to preserve the illustration system's visual
  cohesion).
- No drag-and-drop admin reordering UI — `displayOrder` is a plain
  numeric field, matching `achievements`' existing precedent.
- No touching, overwriting, or importing from the unexplained
  `IngredientShowcaseSection.tsx`/`ProductStorytellingSection.tsx`/etc.
  files already present in the working tree.
- No changes to cart, checkout, payment, auth, product data/API beyond the
  new `ingredients` resource, or SEO.
- No admin-panel UI for managing ingredients in this phase (the admin API
  routes exist and are testable, but building the actual admin React page
  to use them is deferred — out of scope unless the user asks; the public
  showcase is the priority).

## Design

### 1. Server — `ingredients` resource

New files, mirroring `achievements` exactly:

- `server/models/ingredients.js` — schema: `name` (String, required),
  `category` (String, enum `["millet", "nut", "seed", "other"]`,
  required), `description` (String, required), `iconKey` (String,
  required — maps to a frontend icon primitive + variant, e.g.
  `"grain-jowar"`, `"nut-almond"`), `displayOrder` (Number, default 0),
  `isActive` (Boolean, default true), `{ timestamps: true }`.
- `server/controller/ingredients.js` — `IngredientController` class:
  `getAllActiveIngredients` (public, `{isActive:true}`, sorted
  `{displayOrder:1, createdAt:-1}`, returns `{ ingredients }`),
  `getAllAdminIngredients`, `postAddIngredient`, `putUpdateIngredient`,
  `deleteIngredient` — same shape as `AchievementController`.
- `server/routes/ingredients.js` (public) — `GET /ingredients`.
- `server/routes/adminIngredients.js` (admin) — `GET/POST /admin/ingredients`,
  `PUT/DELETE /admin/ingredients/:id`, all `loginCheck`-gated.
- `server/app.js` — require + mount both new routers under `/api`, next to
  the achievements mounting.
- `server/controller/homepage.js` — add `ingredientModel.find({isActive:true})...`
  to the existing `Promise.all`, add `ingredients` to the destructured
  result and the final `res.json({...})`.
- `server/seed-ingredients.js` (new, one-off script, following whatever
  pattern `server/seed.js` already establishes for seeding) — inserts the
  17 ingredients (list finalized in the plan, with real names/categories/
  descriptions/iconKeys, no placeholders).

### 2. Client — API layer

In `src/lib/api.ts`: `Ingredient` interface (`_id`, `name`, `category`,
`description`, `iconKey`, `displayOrder`), `getIngredients()` (same shape
as `getAchievements()`), add `ingredients: Ingredient[]` to `HomePageData`
and to `getHomePageData()`'s fallback `Promise.all`.

### 3. Client — icon primitives

New `src/components/decorative/IngredientIcons.tsx`: a small set of
parametrized primitive renderers (not 17 separate components) —
`GrainIcon`, `NutIcon`, `SeedIcon`, `PodIcon` — each accepting minor
variation props (e.g. curve direction, count) so the 17 ingredients read as
a cohesive family with enough individual character to be distinguishable,
not 17 identical stamps. A lookup mapping `iconKey → { component, props }`
resolves which primitive+variant an ingredient's `iconKey` renders as.
Same conventions as `HeroBotanicals.tsx`: `currentColor` stroke,
`vectorEffect="non-scaling-stroke"`, restrained single-weight linework.

### 4. Client — Ingredient Gallery section

`src/components/home/IngredientGallerySection.tsx`: responsive grid
(`grid-cols-2 sm:grid-cols-3 lg:grid-cols-4` or similar — exact breakpoints
decided in the plan), each card = icon (from §3's lookup) + name +
description, wrapped in `StaggerGroup`/`StaggerItem` per the brief's
motion spec. Section heading via `RevealText`. Replaces the current
`<div id="ingredients" aria-hidden="true" />` placeholder — the anchor
moves onto this section's root element instead of staying a separate empty
div.

### 5. Client — Product storytelling sequence

`src/components/home/GrainToBlendStorySection.tsx`: a GSAP ScrollTrigger
sequence using 4 category-representative icons (one grain, one nut, one
seed, plus a "blend" composite) that animate from scattered positions
toward a central point as the user scrolls, revealing/dominant-izing a
product image at the sequence's end, then the statement "Made thoughtfully
for everyday nourishment." and a "SHOP NOW" CTA. Uses the same
`useGsapContext` pattern already established and reviewed in
`HeroSlider.tsx` — scoped `gsap.context()`, `ctx.revert()` cleanup,
`gsap.matchMedia()` for a desktop-only or reduced-on-mobile treatment
(per Phase 2's precedent for the hero's own scroll sequence), gated behind
`useReducedMotion()`.

### 6. Homepage wiring

Both new sections join `FIXED_SECTIONS` in `src/app/page.tsx` (per the
Phase-2-lesson called out above) — rendered as fixed JSX, positioned after
`FeaturedProductsSection` and before `WhyUsSection` (exact insertion point
decided in the plan by reading the current file), **not** added only to
`DEFAULT_LAYOUT`.

## Testing / Verification

**Server:**
1. `cd server && npm install` (no new dependency expected — reuses
   existing `mongoose`/`express`), start the dev server, hit
   `GET /api/ingredients` and confirm the seeded 17 come back.
2. Confirm `GET /api/homepage` now includes an `ingredients` array.
3. Test admin routes with a valid admin token (`POST`/`PUT`/`DELETE`
   `/api/admin/ingredients`).
4. Run the project's existing test suite (`npm test`) if any tests touch
   homepage/achievements-style resources, to confirm no regression.

**Client:**
1. `cd client-next && npm run lint && npm run build`.
2. `npm run dev` against the real backend (once seeded) — confirm the
   Ingredient Gallery renders all 17 with correct icons/names/descriptions,
   staggered entrance on scroll; confirm the storytelling sequence's
   scroll-linked convergence animation; confirm both sections are fixed
   (present regardless of CMS `sections` state — re-verify against the
   real backend the way Phase 2's Task 7 did, not just the default
   layout).
3. `prefers-reduced-motion` check on both new sections.
4. Mobile viewport check.
5. Confirm `/#ingredients` (the nav link from Phase 1) now scrolls to the
   real Ingredient Gallery section, not an empty placeholder.
