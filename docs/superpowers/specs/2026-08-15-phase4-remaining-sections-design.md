# Phase 4: Remaining Sections — Indian Heritage Redesign Design

**Status:** Approved for planning
**Repos affected:** `server/` (new `testimonials` resource + a `websitesections` migration) and `client-next/` (7 homepage sections + footer)
**Precedes:** Phase 5 (mobile/reduced-motion/performance polish)
**Builds on:** Phase 1 (foundation/palette/typography), Phase 2 (hero/heritage-intro, Motion+GSAP system), Phase 3 (ingredients/storytelling, backend-resource pattern)

## Goal

Bring the remaining homepage sections — Why-Us, Brand Story, Testimonials, Achievements (untouched), Health Hub (untouched), Newsletter/Final-CTA, and the Footer — onto the heritage visual language and the Phase 2/3 Motion/GSAP animation system, and add two net-new sections (Nutrition, Marquee) that don't exist today.

## Current state (verified against live code, 2026-08-15)

`page.tsx` fixed-then-CMS-driven order today:
`hero` (fixed) → `heritage_intro` (fixed) → `trust_badges` → `categories` → `featured_products` (+ `IngredientGallerySection` + `GrainToBlendStorySection`, injected via Phase 3's switch-case pattern) → `why_us` → `brand_story` → `achievements` → `testimonials` → `health_hub` → `newsletter` → hardcoded `<footer>` JSX (not a CMS section at all).

All section components live in `src/components/home/HomeSections.tsx` except the Phase 3 additions and the footer.

Per-section state:
- **Why-Us** (`WhyUsSection`, `HomeSections.tsx:147-186`) — already on new tokens (`--bg-warm`, `--espresso`, `--color-sage`/`--color-terracotta`/`--color-walnut`). Static `WHY_US` array, 6 items. No entrance animation, only a CSS hover lift.
- **Brand Story** (`BrandStorySection`, `:206-270`) — raw hex colors (`#5D310E`, `#3D1E08`, `#C28B36`, `#D9AE7A`, `#F3E8DC`, `#DCC8AE`), not heritage tokens. Static `BRAND_STORY_BEATS` array, 3 items. Uses `ScrollReveal` (custom `IntersectionObserver` component, `src/components/common/ScrollReveal.tsx`) for fade-in.
- **Achievements** (`AchievementsSection`, `:272-343`) — CMS/API-driven (`achievements` prop), already reviewed/shipped in an earlier redesign pass. **Out of scope for Phase 4** — not touched.
- **Testimonials** (`TestimonialsSection`, `:345-389`) — static `TESTIMONIALS` array, 3 items (Priya Sharma/Bengaluru, Anitha Rao/Mysuru, Deepak Nair/Chennai — full text below in the server section). Mixed tokens (`--brand-cream`, `--brand-brown`, `--text` — the older brand-* token family, not `--color-*`/`--espresso`). `avatar` field defined but never rendered. Uses `ScrollReveal`.
- **Newsletter** (`NewsletterSection`, `:391-407`) — generic "Stay Connected" box with `NewsletterForm`. `--bg`/`--brand-brown` tokens (already current-ish). No entrance animation.
- **Health Hub** (`HealthHubSection`, `:409-549`) — CMS/API-driven (`vlogs` prop). **Out of scope for Phase 4** — not touched.
- **Nutrition** — does not exist as a homepage section. The only nutrition content anywhere is a per-product table on the PDP (`src/app/(public)/product/[slug]/page.tsx:166-180`, reads `product.nutritionalInfo`, styled with old raw hex) — unrelated, not touched by this phase.
- **Marquee** — does not exist as a wired, functional component. `src/components/home/HeritageMarquee.tsx` is one of the 9 known foreign/untracked files from this session's earlier phases (unrelated work-in-progress by someone else) — **do not read, reference, or reuse its content**; its `animate-marquee` CSS class isn't even defined anywhere, so it wouldn't work if used. Build fresh under a different name/location, exactly as Phase 3 did for `IngredientGallerySection`/`GrainToBlendStorySection` when they collided with foreign `IngredientShowcaseSection.tsx`/`ProductStorytellingSection.tsx`.
- **Footer** — inline JSX in `page.tsx:91-151`, not a component, not a CMS section (renders unconditionally after the section map, no switch case, no `sectionId`). Uses emoji (📍📞✉️🕐) for contact rows. No social links.

**CMS sections data model** (verified, `server/` repo):
- `server/models/websiteSections.js` — `{ sectionId: String (unique, free-text, not enum), name: String, isVisible: Boolean (default true), displayOrder: Number (default 0), timestamps }`.
- `server/controller/websiteSections.js` — `getSections()` returns visible sections sorted by `displayOrder`, **auto-seeding a `DEFAULT_SECTIONS` array only if the collection is empty** (the exact bug class Phase 2 found with `heritage_intro` — a section only in a fallback array never renders against real, already-populated data).
- `server/controller/homepage.js` has its own separate `DEFAULT_SECTIONS` array (duplicated, not shared) used for its own fallback.
- `server/routes/websiteSections.js` — public `GET /api/sections`; admin `PUT /api/admin/sections` reorders/toggles **existing** documents only. **There is no create/delete endpoint.**
- Live seeded `sectionId`s (both `DEFAULT_SECTIONS` arrays, same list): `hero, trust_badges, categories, featured_products, why_us, brand_story, achievements, testimonials, health_hub, newsletter`.

**Implication:** `nutrition` and `marquee` cannot be added by only editing code-level `DEFAULT_SECTIONS` arrays/`DEFAULT_LAYOUT` — the real, already-populated `websitesections` collection needs new documents, or the two sections will never render against live data (same class of bug as Phase 2's `heritage_intro`, this time confirmed and designed around up front instead of discovered after shipping).

## Decisions from brainstorming

1. **Testimonials → backend-driven.** New `server/` resource mirroring the `ingredients`/`achievements` pattern: Mongoose model, single-class controller (public + admin methods), public+admin route split, mounted in `app.js`, included in `controller/homepage.js`'s `Promise.all` aggregate, migrated into `HomePageData`/`getHomePageData()` on the client. A seed script upserts the 3 existing hardcoded testimonials (verbatim content, so nothing user-facing regresses) as the initial live data.
2. **Nutrition → general wellness/nutrition editorial section**, not tied to per-product data. Curated static copy (3-4 stat/claim cards), same content-authoring model as Why-Us (hardcoded array in the component, not backend-driven — no new data-plumbing beyond the section itself existing).
3. **Marquee → scrolling heritage-value phrases.** Purely typographic, static curated copy (e.g. "Stone-Ground · Small-Batch · Rooted in Tradition · No Preservatives"), infinite horizontal scroll.
4. **Final CTA → redesign Newsletter in place**, not a new section. One closing band before the footer, not two. `sectionId` stays `"newsletter"` — only its component's internal design and copy change.
5. **Footer → extracted to `src/components/partials/Footer.tsx`**, emoji replaced with hand-coded SVG icons (matching the existing illustration system's conventions: `currentColor` stroke, `vectorEffect="non-scaling-stroke"`, same primitive style as `IndianBorder.tsx`/`HeroBotanicals.tsx`/`IngredientIcons.tsx`), plus a new Instagram + Facebook social row using placeholder `href="#"` links (real URLs to be swapped in later by the user).
6. **Nutrition and Marquee become real, first-class, admin-toggleable CMS sections** (not a Phase-3-style switch-case injection). Rationale: unlike `hero`/`heritage_intro` (must always render, position-locked, genuinely un-configurable) or Phase 3's ingredient sections (needed a specific position relative to a CMS toggle that could vanish), Nutrition and Marquee are ordinary optional content exactly like Why-Us/Testimonials/Achievements — forcing them through the switch-injection workaround a third time would compound architectural debt Phase 3's own final review already flagged twice as straining. Implementation: a `server/` migration script inserts two new `WebsiteSection` documents (`nutrition`, `marquee`) into the **live** collection via `findOneAndUpdate` upsert (same idempotent-upsert pattern as `seed-ingredients.js`), at `displayOrder` values computed as the midpoint between their intended neighbors' *live* `displayOrder` values (read at migration-run time, not hardcoded) — so no existing document's `displayOrder` needs to change. Both `DEFAULT_SECTIONS` arrays (`websiteSections.js` and `homepage.js`) also get the two new entries added at the same relative position, so a fresh/empty database auto-seeds correctly too.
7. **Animation migration.** `ScrollReveal` usages in Why-Us, Brand Story, and Testimonials are replaced with the Phase 2/3 Motion system (`RevealText`, `FadeUp`, `StaggerGroup`/`StaggerItem` from `src/components/motion/`). `ScrollReveal.tsx` itself is not deleted (no repo-wide audit of who else might use it is in scope for this phase) — only these three sections stop using it. Reduced-motion handling is inherited automatically from the site-wide `<MotionConfig reducedMotion="user">` (Phase 2) — no new reduced-motion work needed for Motion-based sections. Nutrition and Marquee are built directly on Motion/GSAP from the start (no legacy pattern to migrate).

## Section order after Phase 4

```
hero (fixed) → heritage_intro (fixed) → trust_badges → categories →
featured_products (+ ingredient_gallery + grain_to_blend, unchanged from Phase 3) →
why_us → nutrition (NEW) → brand_story → achievements → testimonials →
marquee (NEW) → health_hub → newsletter (redesigned as Final CTA) → footer (extracted component)
```

Narrative logic: Why-Us and Nutrition both make trust/quality claims (kept adjacent), Brand Story tells the origin, Achievements gives external validation, Testimonials gives social proof, Marquee is a typographic rhythm-break before the denser Health Hub content, Newsletter/Final-CTA closes, Footer ends the page.

## Server design (`server/`)

### New resource: `testimonials`

Mirrors `models/achievements.js` / `models/ingredients.js` exactly:

```javascript
// models/testimonials.js
const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  quote: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  avatarInitial: { type: String, required: true },
  displayOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });
```

- `controller/testimonials.js` — `TestimonialController` class (singleton export): `getAllActiveTestimonials`, `getAllAdminTestimonials`, `postAddTestimonial`, `putUpdateTestimonial` (with `runValidators: true`, learned from Phase 3's review finding), `deleteTestimonial`.
- `routes/testimonials.js` (public `GET /testimonials`), `routes/adminTestimonials.js` (admin CRUD: `loginCheck` + `isAdmin` on all three write routes, `loginCheck`-only on the admin read route — matching Phase 3's corrected pattern, not its original mistake).
- `app.js` — 4 lines (2 requires, 2 mounts) near the `ingredients`/`achievements` pair.
- `controller/homepage.js` — `testimonialModel` added to the `Promise.all` aggregate at the correct positional index (the plan must show the corrected snippet inline, verified against the actual current file — Phase 3's plan had a real destructuring-order bug here that the implementer had to catch and fix; this plan must not repeat it).
- `seed-testimonials.js` — one-off script, upserts these 3 exact testimonials (verbatim from the current hardcoded `TESTIMONIALS` array, so live content doesn't regress), `displayOrder` 0/1/2:

```javascript
[
  { name: "Priya Sharma", location: "Bengaluru", quote: "The health mix is absolutely fantastic — my kids love it! No added sugar and I can actually taste the quality of real ingredients.", rating: 5, avatarInitial: "P", displayOrder: 0 },
  { name: "Anitha Rao", location: "Mysuru", quote: "Finally a homemade brand that delivers what it promises. The turmeric latte mix is pure gold.", rating: 5, avatarInitial: "A", displayOrder: 1 },
  { name: "Deepak Nair", location: "Chennai", quote: "Roshini's ragi malt has replaced my morning oats entirely. Rich taste, filling, and I feel genuinely energised.", rating: 5, avatarInitial: "D", displayOrder: 2 },
]
```

### Sections migration: `nutrition` + `marquee`

`server/migrate-add-phase4-sections.js` (one-off script, same `process.env.DATABASE` connection pattern as `seed-ingredients.js`/`seedCoupons.js`):
1. Query the live `WebsiteSection` collection for the current `displayOrder` of `why_us`, `brand_story`, `testimonials`, `health_hub`.
2. Upsert (`findOneAndUpdate` keyed on `sectionId`, idempotent) two new documents:
   - `{ sectionId: "nutrition", name: "Nutrition", isVisible: true, displayOrder: midpoint(why_us.displayOrder, brand_story.displayOrder) }`
   - `{ sectionId: "marquee", name: "Marquee", isVisible: true, displayOrder: midpoint(testimonials.displayOrder, health_hub.displayOrder) }`
3. If any anchor `sectionId` is missing from the live collection (shouldn't happen per the verified DEFAULT_SECTIONS list, but the script must not silently corrupt order if it does), the script aborts with a clear error rather than guessing a `displayOrder`.
4. Run against the real dev database and verify via `GET /api/sections` that all 12 sections now return, correctly ordered, before the client plan's final verification pass depends on it (same "already seeded and confirmed live" precondition Phase 3 established for `ingredients`).

Also update both `DEFAULT_SECTIONS` arrays (`websiteSections.js`, `homepage.js`) to include `nutrition`/`marquee` at the same relative position, so a fresh/empty database's auto-seed produces the same order.

## Client design (`client-next/`)

### 1. Why-Us (restyle + animation only)
File: `HomeSections.tsx` (`WhyUsSection`). Wrap the card grid in `StaggerGroup`/`StaggerItem` (replacing the current CSS-only hover, entrance is new). Add a small heritage illustration accent near the heading (reuse an existing botanical primitive from `HeroBotanicals.tsx` or a minimal `IndianBorder` variant — implementer's call, consistent with the established illustration system). No content/copy changes (the `WHY_US` array stays as-is — already good copy, already correct tokens).

### 2. Nutrition (new)
New file: `src/components/home/NutritionSection.tsx`. Curated array of 3-4 items (e.g. "Naturally High in Fiber", "Slow-Release Energy", "No Refined Sugar", "Stone-Ground, Not Processed" — exact copy finalized in the plan), card layout consistent with Why-Us's visual weight but visually distinct enough not to feel duplicated (e.g. a horizontal stat-forward layout vs. Why-Us's icon-card grid — implementer's call within the plan's spec). `StaggerGroup` entrance. Full heritage token set from the start (no legacy tokens to migrate).

### 3. Brand Story (restyle + animation)
File: `HomeSections.tsx` (`BrandStorySection`). Replace every raw hex value with heritage tokens: `#5D310E`/`#3D1E08` gradient → `--color-espresso`-family tokens (exact mapping decided in the plan by reading `globals.css`'s current dark-brown token set), `#C28B36` accent → the closest existing accent token (likely `--color-terracotta` or a gold/accent token if one exists — plan must verify against `globals.css`, not guess), `#F3E8DC`/`#DCC8AE`/`#D9AE7A` → `--color-ivory`-family tokens. Replace `ScrollReveal` usage with `RevealText` (headline) and `StaggerGroup`/`StaggerItem` (the 3 beats). Content (`BRAND_STORY_BEATS`) unchanged.

### 4. Testimonials (backend-driven + restyle + animation)
File: `HomeSections.tsx` (`TestimonialsSection`) — signature changes from no-props to `{ testimonials }: { testimonials: Testimonial[] }`, sourced from `getHomePageData()`'s new `testimonials` field (mirrors how `IngredientGallerySection` consumes `ingredients` in Phase 3). Add `getTestimonials()` + `Testimonial` interface to `api.ts` (exact mirror of Phase 3's `getIngredients()`/`Ingredient` — `fetchPublicWithTimeout`, `revalidate: 600`, graceful empty-array fallback). Replace the older `--brand-*` token family with `--color-*`/`--espresso` tokens matching the rest of the redesign. Replace `ScrollReveal` with `RevealText`/`StaggerGroup`. **Finally render the avatar initial** (`avatarInitial` field, defined-but-unused in the current code) as a small circular badge — a real, if minor, functional improvement alongside the visual redesign.

### 5. Marquee (new)
New file: `src/components/home/HeritageMarquee.tsx` is the foreign file's name — **do not use this filename**, per the established "build fresh under different names" instruction. Use `src/components/home/ValuesMarqueeSection.tsx` instead. Infinite horizontal scroll implemented via GSAP (`gsap.to` with a repeating/wrapping x-tween, or CSS `@keyframes` + `animation: marquee ... infinite linear` if simpler and equally smooth — plan's implementer call, but must be defined in `globals.css` this time, unlike the foreign file's dangling undefined class). Curated phrase list, botanical divider glyphs between phrases (reuse an existing small SVG primitive, not a new illustration system). Must respect `prefers-reduced-motion`/the site's reduced-motion gate — an infinite marquee is exactly the kind of motion that must stop or become very slow under reduced motion, not merely "not accelerate."

### 6. Newsletter → Final CTA (redesign in place)
File: `HomeSections.tsx` (`NewsletterSection`) — same component, same `sectionId` (`"newsletter"`), same `NewsletterForm` integration, redesigned as a full-width heritage-styled closing band: a stronger heritage statement/headline merged with the email capture (not a generic "Stay Connected" box). `FadeUp`/`RevealText` entrance. Exact copy/layout finalized in the plan.

### 7. Footer (extract + restyle + icons + social)
New file: `src/components/partials/Footer.tsx` (matching where `Header.tsx` lives — the partials convention). Content structure unchanged (brand mark, Shop/Account/Contact columns, bottom bar with copyright + policy links) but:
- Emoji (📍📞✉️🕐) replaced with hand-coded SVG icons (`currentColor`, `vectorEffect="non-scaling-stroke"`, matching the established illustration primitive style).
- New social row: Instagram + Facebook icon links, `href="#"` placeholders, clearly identifiable in the code (e.g. a `// TODO: replace with real URLs` comment is explicitly NOT this codebase's style per CLAUDE.md's no-comments default — instead, the plan should extract the URLs to a small `SOCIAL_LINKS` constant at the top of the file, so replacing them later is a one-line-per-platform edit, self-evidently a placeholder from the `"#"` value itself).
- `page.tsx` shrinks: the entire inline `<footer>` JSX (lines 91-151) is deleted and replaced with `<Footer />`.
- `IndianBorder variant="minimal" position="top"` (currently sitting between the section map and the footer JSX) — the plan should decide whether this becomes part of `Footer.tsx` itself (self-contained component) or stays in `page.tsx` immediately before `<Footer />` (implementer's call, but must not be dropped).

### `page.tsx` wiring

- `DEFAULT_LAYOUT` gets two new entries (`{ sectionId: "nutrition" }`, `{ sectionId: "marquee" }`) inserted at the positions shown in "Section order after Phase 4" above.
- The switch statement gets two new `case`s (`"nutrition"` → `<NutritionSection />`, `"marquee"` → `<ValuesMarqueeSection />`) — **ordinary cases, not `FIXED_SECTIONS` entries and not injected into a neighboring case** (per decision #6 above — these are real, independently CMS-toggleable sections once the server migration lands).
- `getHomePageData()` in `api.ts` gains `testimonials: Testimonial[]` on `HomePageData` and in the `Promise.all` fallback path, mirroring Phase 3's `ingredients` addition exactly (including the destructuring-order care Phase 3 required).
- `HomePage()`'s destructure of `getHomePageData()`'s return gains `testimonials`, passed into `<TestimonialsSection testimonials={testimonials} />`.

## Global Constraints

- Never `git add .` / `git add -A` in either repo — both have hazards (client-next's 9 known foreign untracked files; verify server/ doesn't have analogous surprises via `git status` before the first commit of each task).
- Do not read, reference, or import from `src/components/home/HeritageMarquee.tsx` (foreign file) — build the real marquee as `ValuesMarqueeSection.tsx`.
- All new/touched sections use the heritage token set (`--color-*`, `--espresso`, `--ivory` families) from `globals.css` — no new raw hex values introduced, and existing raw hex in Brand Story must be eliminated, not just left alongside new tokens.
- All new entrance animation goes through the Phase 2/3 Motion system (`RevealText`/`FadeUp`/`StaggerGroup`/`StaggerItem`) or GSAP with `matchMedia`/reduced-motion gating (for the Marquee's continuous scroll) — no new ad-hoc animation approach, and no continued use of `ScrollReveal` in the three sections being migrated.
- `package.json` version-field churn on every commit (both repos) is the pre-commit hook auto-bumping — never flag as scope creep.
- Server admin write routes require both `loginCheck` and `isAdmin` (Phase 3's corrected pattern) — get this right the first time, don't repeat Phase 3's initial mistake.
- `runValidators: true` on all Mongoose `findByIdAndUpdate`/`findOneAndUpdate` calls in new controllers (Phase 3's corrected pattern).
- The sections migration script (`migrate-add-phase4-sections.js`) must read live `displayOrder` values at run time, not hardcode assumed values, and must abort cleanly (not corrupt existing order) if an expected anchor section is missing.

## Testing / verification expectations

- Server: full verification pass (Task-6-style) confirming `GET /api/sections` returns 12 correctly-ordered sections and `GET /api/testimonials` returns 3 testimonials, against the real seeded dev database, before the client plan's final task depends on that data.
- Client: live Playwright verification against the real backend (not just graceful-degradation/empty-state checks) for: correct section order end-to-end, Testimonials rendering real backend data (not the old hardcoded array), Marquee's reduced-motion behavior, Footer's new icons/social row rendering, no regressions to Phases 1-3's sections.
- `npm run lint` baseline check in both repos (client-next's known baseline: 234/146/88 problems, unchanged by this phase's work).
- `npm run build` in client-next is expected to still fail on the known, pre-existing, unrelated foreign-file `"kasuti"` `IndianBorder` variant issue — not a regression, not this phase's to fix, do not attempt to fix it.
