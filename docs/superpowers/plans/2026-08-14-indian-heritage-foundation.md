# Indian Heritage Redesign — Phase 1 (Foundation) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-skin Roshini's `client-next` frontend with the premium Indian-heritage palette, tune the typographic scale, introduce the first piece of an original hand-drawn illustration system (`IndianBorder`), add a barely-perceptible texture layer, and redesign the navigation to a minimal-luxury layout — all without touching cart/checkout/payment, product data, auth, or SEO.

**Architecture:** Almost entirely a token-and-markup re-skin of existing files, not new architecture. Two CSS custom-property systems (`globals.css`'s `--primary-brown` family and `CustomizationContext.tsx`'s runtime-injected `--brand-*` family) both get their values updated so every existing consumer re-skins without individual edits. One new component (`IndianBorder`) is added. `Header.tsx` gets four independent, sequentially-applied behavior changes (link set, search, language control, transparent-hero state).

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind v4 (`@theme inline` token registration), plain CSS custom properties — no new npm dependency.

**Spec:** `client-next/docs/superpowers/specs/2026-08-14-indian-heritage-foundation-design.md`

## Global Constraints

- No new npm dependency — `motion`/`gsap` already installed but **not used** in this phase (Phase 1 is static CSS-transition-only; no `motion`/`gsap` code).
- `client-next` has **no configured test runner** (per root `CLAUDE.md`) — every task's verification is `npm run lint`, a production-relevant type/build check, and a manual `npm run dev` visual check. There are no unit tests to write.
- Never touch: `src/lib/cart.ts`, any payment/checkout code, product data/API layer, `src/lib/AuthContext.tsx`/`useAuth`, SEO metadata in `layout.tsx`, `server/` (backend repo).
- The `quantitiy` spelling and all cart/checkout payload shapes are out of scope and must not be touched.
- **Line numbers in Tasks 8-11 (all of which edit `src/components/partials/Header.tsx`) are anchored to the file's state as read at plan-writing time, before any of this plan's own edits.** Because Tasks 8, 9, and 10 each add/remove lines earlier in the file, by the time a later task runs, its stated line numbers will be off by however many lines the prior tasks shifted. Every step also quotes the actual existing code being replaced (or names a distinctive comment/className to search for) — locate the target by that content, not by trusting the line number literally. Read the current file first in each task.
- Work happens on branch `redesign/indian-heritage-foundation` (already created from clean `main`; the unrelated stashed motion-plan work — `git stash list` entry "wip: motion-interaction-plan (pre Indian heritage redesign)" — must remain untouched and unpopped).
- **Scope refinement vs. the spec's narrative section 3:** the spec's own "Files touched" list never included `HeroSlider.tsx`; only the narrative mentioned a hero border. Resolved here: `IndianBorder` is applied to the **footer only** in this phase. Hero decoration is deferred to Phase 2, which rebuilds the hero wholesale — touching `HeroSlider.tsx` twice (once for a border now, again for the full Phase 2 rework) would be wasted, conflict-prone effort.
- **Known caveat, not a defect to "fix" in this phase:** the CMS-driven hero (`hero-overlay`, dark gradient, light `--color-ivory` text) and the no-CMS fallback hero (`hero-fallback`, light linen/ivory gradient) have opposite brightness. Task 11's transparent-nav treatment is tuned for the CMS-driven hero (the real merchant-configured state) using light/ivory nav text. Over the fallback hero this will read low-contrast — that inconsistency belongs to Phase 2 (which owns the hero rebuild), not this phase. Verification step 11 explicitly checks and notes both states rather than silently claiming both look right.

---

### Task 1: Palette tokens — light-mode remap (`globals.css` `:root`)

**Files:**
- Modify: `src/app/globals.css:13-104` (primary brand colors, legacy aliases, brown/green ramps, background/cream tokens, text tokens, accent-terracotta)

**Interfaces:**
- Produces: the hex values every other task and every existing component (buttons, cards, badges, `ProductCard`, `Header`) visually depends on. No later task changes these values again except Task 2 (dark mode) and Task 4 (typography, non-color tokens only).

- [ ] **Step 1: Replace the primary brand color block**

In `src/app/globals.css`, replace lines 12-27 (`/* ── Primary Brand Colors ── */` through `--charcoal: #2D2D2D;`) with:

```css
  /* ── Primary Brand Colors ───────────────────────────────────── */
  --primary-brown:    #4A2618;
  --secondary-brown:  #A95636;
  --premium-gold:     #C88A3D;
  --organic-green:    #53634A;
  --indigo-accent:    #24384A;

  /* Legacy re-mapped brand aliases */
  --espresso:         #4A2618;
  --espresso-dark:    #2C170E;
  --walnut:           #A95636;
  --walnut-dark:      #86452C;
  --terracotta:       #A95636;
  --terracotta-dark:  #86452C;
  --sage:             #53634A;
  --sage-dark:        #364130;
  --charcoal:         #1C1917;
```

- [ ] **Step 2: Replace the Earthy Brown Scale**

Replace lines 29-39 (`/* ── Earthy Brown Scale ── */` block) with:

```css
  /* ── Earthy Brown Scale ─────────────────────────────────────── */
  --brown-50:   #FBF4F2;
  --brown-100:  #F5E6E0;
  --brown-200:  #EAC9BD;
  --brown-300:  #DBA691;
  --brown-400:  #CC8062;
  --brown-500:  #A95636;
  --brown-600:  #86452C;
  --brown-700:  #673521;
  --brown-800:  #4A2618;
  --brown-900:  #2C170E;
```

- [ ] **Step 3: Replace the Natural Green Scale**

Replace lines 41-51 (`/* ── Natural Green Scale ── */` block) with:

```css
  /* ── Natural Green Scale ────────────────────────────────────── */
  --green-50:   #F4F6F3;
  --green-100:  #E3E8E1;
  --green-200:  #C4CEBE;
  --green-300:  #9FB095;
  --green-400:  #748B68;
  --green-500:  #53634A;
  --green-600:  #44523D;
  --green-700:  #364130;
  --green-800:  #283024;
  --green-900:  #1B2018;
```

- [ ] **Step 4: Replace the Cream & Background Colors**

Replace lines 53-68 (`/* ── Cream & Background Colors ── */` block) with:

```css
  /* ── Cream & Background Colors ──────────────────────────────── */
  --bg-main:    #F7F0E4;
  --bg-cream:   #FBF6EC;
  --bg-card:    #FFFFFF;
  --bg-alt:     #F2E9D9;
  --bg-beige:   #EBDFC8;

  --bg:         #F7F0E4;
  --bg-warm:    #FBF6EC;
  --surface:    #FFFFFF;
  --surface-2:  #FBF6EC;
  --surface-3:  #F2E9D9;
  --surface-4:  #EBDFC8;
  --ivory:      #F7F0E4;
  --linen:      #FBF6EC;
  --warm-white: #FFFFFF;
```

- [ ] **Step 5: Update text-color tokens and `--accent-terracotta`**

In the `/* ── Text Colors ── */` block (lines 84-96), replace `--text-heading-primary`, `--text-heading-secondary`, `--text-primary`, `--text-secondary`:

```css
  --text-heading-primary:   #2C170E;
  --text-heading-secondary: #4A2618;
```
```css
  --text-primary:     #2C170E;
  --text-secondary:   #4A2618;
```

(Leave `--text-body`, `--text-muted-custom`, `--text-light-custom`, `--text-white`, `--text`, `--text-muted`, `--text-light` unchanged — they're greys, not brand hues, and out of this phase's scope.)

In the `/* ── Accent Colors ── */` block (lines 98-104), update only `--accent-terracotta` and `--accent`:

```css
  --accent-terracotta: #A95636;
  --accent:            #A95636;
```

(Leave `--accent-turmeric`, `--accent-ragi`, `--accent-cinnamon`, `--accent-leafgreen` untouched — out of scope, brief doesn't dictate them.)

- [ ] **Step 6: Verify — lint**

Run: `cd client-next && npm run lint`
Expected: no new errors (CSS isn't linted by ESLint, so this mainly guards against any accidental JS/TS edits — there should be none in this step).

- [ ] **Step 7: Verify — visual smoke check**

Run: `npm run dev`, open `http://localhost:3001` (or the port the dev server reports). Confirm:
- Page background reads as warm ivory (not the old off-white)
- Header, buttons, product card prices/badges read as the new deep-brown/terracotta
- No console errors about invalid CSS

- [ ] **Step 8: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: remap light-mode palette to Indian heritage design tokens"
```

---

### Task 2: Palette tokens — dark-mode sync (`globals.css` `html.dark`)

**Files:**
- Modify: `src/app/globals.css:286-364` (`html.dark, html[data-theme="dark"]` block)

**Interfaces:**
- Consumes: the new light-mode hex anchors from Task 1 (used here only as a hue reference for choosing dark-appropriate values — the dark block defines its own separate, lighter-on-dark values, it does not reference the light tokens directly, matching the existing pattern in this file).

- [ ] **Step 1: Update the Primary Brand section of the dark block**

Replace lines 288-299 in `src/app/globals.css`:

```css
  /* ── Primary Brand ────────────────────────────────────────── */
  --espresso: #B98266;
  --walnut: #C99A78;
  --terracotta: #C99A78;

  --espresso-dark: #3B2418;
  --espresso-light: #C99A78;
  --walnut-dark: #5B3A29;
  --walnut-light: #DAB89A;
  --terracotta-dark: #86452C;
  --terracotta-light: #DAB89A;
  --terracotta-lighter: #EDD9C4;
```

- [ ] **Step 2: Update Background section**

Replace lines 301-308:

```css
  /* ── Background ───────────────────────────────────────────── */
  --ivory: #1A140F;
  --linen: #241C15;
  --warm-white: #2C2219;

  --ivory-dark: #0F0B08;
  --linen-dark: #1A140F;
  --warm-white-dark: #241C15;
```

- [ ] **Step 3: Update Supporting section**

Replace lines 310-316:

```css
  /* ── Supporting ───────────────────────────────────────────── */
  --sage: #93A088;
  --charcoal: #E5E1DC;

  --sage-dark: #6D7864;
  --sage-light: #ADBBA0;
  --charcoal-light: #F2EEE9;
```

- [ ] **Step 4: Update Accent section**

Replace line 334:

```css
  --accent: #C99A78;
```

- [ ] **Step 5: Verify — visual smoke check**

Run: `npm run dev`, toggle to dark mode (via the existing `ThemeManager`/`html.dark` mechanism — check `src/lib/ThemeProvider.tsx` for how the app triggers it, e.g. a theme toggle button, or add `class="dark"` to `<html>` via devtools if no UI toggle exists). Confirm text/background remain legible and use the new warm-brown hue family rather than the old one, with no console errors.

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: sync dark-mode palette with Indian heritage design tokens"
```

---

### Task 3: `CustomizationContext` default palette

**Files:**
- Modify: `src/lib/CustomizationContext.tsx:24-33`

**Interfaces:**
- Produces: the `defaultSettings` fallback object consumed by `useCustomization()` throughout the app (`ProductCard.tsx`, `HomeSections.tsx`, `page.tsx`, `ProductInteractiveDetails.tsx`, auth pages) via `--brand-brown`/`--brand-cream` CSS variables. Admin overrides via `/api/customize/get-settings` still take precedence at runtime — this task only changes the pre-admin-customization default.

- [ ] **Step 1: Update `defaultSettings`**

In `src/lib/CustomizationContext.tsx`, replace lines 24-33:

```typescript
const defaultSettings: CustomizationSettings = {
  logoImage: null,
  shopName: "Roshini's",
  shopSubtitle: "Pure Ingredients, Zero Compromises",
  themePrimaryColor: "#4A2618",
  themePrimaryColorDark: "#2C170E",
  themePrimaryColorLight: "#A95636",
  themeCreamColor: "#F7F0E4",
  themeCreamColorDark: "#F2E9D9",
};
```

- [ ] **Step 2: Verify — lint**

Run: `cd client-next && npm run lint`
Expected: no errors.

- [ ] **Step 3: Verify — visual smoke check**

Run: `npm run dev`. Before the `/api/customize/get-settings` fetch resolves (or with the backend not running), confirm the page still renders with the new deep-brown/ivory defaults rather than the old ones or a flash of unstyled content. If the backend **is** running with existing admin-configured settings, confirm those still override correctly (open `/admin` → branding settings, change a color, save, reload homepage, confirm the change appears) — this proves the admin override path is untouched.

- [ ] **Step 4: Commit**

```bash
git add src/lib/CustomizationContext.tsx
git commit -m "feat: update CustomizationContext defaults to Indian heritage palette"
```

---

### Task 4: Typography scale tuning

**Files:**
- Modify: `src/app/globals.css:176-205` (font-size and letter-spacing tokens)

**Interfaces:**
- Consumes: nothing new (pure token value changes on the existing typography scale defined in Task-1-adjacent lines, untouched by Task 1).
- Produces: nothing new consumed by later tasks — this is a leaf visual tuning change.

- [ ] **Step 1: Bump the top of the font-size scale**

In `src/app/globals.css`, replace lines 184-187:

```css
  --font-size-4xl:    3rem;
  --font-size-5xl:    4rem;
  --font-size-6xl:    5.25rem;
  --font-size-7xl:    7.5rem;
```

(This changes only `5xl`/`6xl`/`7xl` from their old values of `3.75rem`/`4.5rem`/`6rem`. `4xl` is listed unchanged for context — do not modify it.)

- [ ] **Step 2: Widen the label/eyebrow letter-spacing tokens**

Replace lines 203-205:

```css
  --letter-spacing-wide:    0.06em;
  --letter-spacing-wider:   0.13em;
  --letter-spacing-widest:  0.24em;
```

- [ ] **Step 3: Verify — visual smoke check**

Run: `npm run dev`. Confirm the hero headline (uses `text-4xl md:text-6xl lg:text-7xl` per `HeroSlider.tsx:178`) reads noticeably larger/more editorial at desktop width, and that uppercase label text (category labels, nav-adjacent small text using `letter-spacing-wide`/`wider` at `globals.css:774,802,937,964,1594`) reads slightly more spaced-out without wrapping awkwardly or overflowing its container. Check at both desktop and mobile widths — the `--font-size-7xl` bump in particular should not cause horizontal overflow on the hero at mobile (verify the hero's responsive classes, e.g. `text-4xl` at the base breakpoint, are unaffected since only 6xl/7xl changed).

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: tune typography scale for editorial heading proportions"
```

---

### Task 5: `IndianBorder` illustration component

**Files:**
- Create: `src/components/decorative/IndianBorder.tsx`

**Interfaces:**
- Produces: `export default function IndianBorder({ variant, position, className }: IndianBorderProps)` where `IndianBorderProps = { variant: "botanical" | "geometric" | "minimal"; position?: "top" | "bottom" | "full"; className?: string }`. Task 7 imports this as `import IndianBorder from "@/components/decorative/IndianBorder";` and renders `<IndianBorder variant="minimal" position="top" />`.

- [ ] **Step 1: Create the component**

Create `src/components/decorative/IndianBorder.tsx`:

```tsx
import React from "react";

export type IndianBorderVariant = "botanical" | "geometric" | "minimal";

interface IndianBorderProps {
  variant: IndianBorderVariant;
  position?: "top" | "bottom" | "full";
  className?: string;
}

const STROKE_WIDTH = 1.25;

function BotanicalMotif() {
  const stems = [40, 120, 200, 280, 360];
  return (
    <svg
      viewBox="0 0 400 40"
      preserveAspectRatio="none"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE_WIDTH}
      strokeLinecap="round"
      className="w-full h-full"
    >
      <path d="M0 20 C 40 20 40 8 80 8 C 120 8 120 20 160 20 C 200 20 200 8 240 8 C 280 8 280 20 320 20 C 360 20 360 8 400 8" />
      {stems.map((cx) => (
        <g key={cx} transform={`translate(${cx} 14)`}>
          <path d="M0 0 C -4 -6 -10 -6 -10 0 C -10 6 -4 6 0 0 Z" />
          <path d="M0 0 C 4 -6 10 -6 10 0 C 10 6 4 6 0 0 Z" />
        </g>
      ))}
    </svg>
  );
}

function GeometricMotif() {
  const triangles = Array.from({ length: 20 }, (_, i) => i * 20);
  return (
    <svg
      viewBox="0 0 400 24"
      preserveAspectRatio="none"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE_WIDTH}
      className="w-full h-full"
    >
      <line x1="0" y1="20" x2="400" y2="20" />
      {triangles.map((x) => (
        <g key={x}>
          <path d={`M${x + 4} 20 L${x + 10} 8 L${x + 16} 20`} />
          <circle cx={x + 10} cy={4} r="1.5" fill="currentColor" stroke="none" />
        </g>
      ))}
    </svg>
  );
}

function MinimalMotif() {
  return (
    <svg
      viewBox="0 0 400 20"
      preserveAspectRatio="none"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE_WIDTH}
      className="w-full h-full"
    >
      <line x1="0" y1="10" x2="176" y2="10" />
      <g transform="translate(200 10)">
        <path d="M0 -6 C -5 -6 -5 0 0 0 C 5 0 5 -6 0 -6 Z" />
        <path d="M0 6 L0 0" />
      </g>
      <line x1="224" y1="10" x2="400" y2="10" />
    </svg>
  );
}

const MOTIFS: Record<IndianBorderVariant, () => React.JSX.Element> = {
  botanical: BotanicalMotif,
  geometric: GeometricMotif,
  minimal: MinimalMotif,
};

export default function IndianBorder({
  variant,
  position = "top",
  className = "",
}: IndianBorderProps) {
  const Motif = MOTIFS[variant];
  const positionClass =
    position === "top" ? "mb-0" : position === "bottom" ? "mt-0" : "";

  return (
    <div
      className={`indian-border indian-border-${variant} ${positionClass} ${className}`.trim()}
      style={{ color: "var(--color-secondary-brown)", opacity: 0.55, width: "100%", height: "auto", overflow: "hidden" }}
      aria-hidden="true"
    >
      <Motif />
    </div>
  );
}
```

- [ ] **Step 2: Verify — lint and type-check**

Run: `cd client-next && npm run lint`
Expected: no errors. This is a new, self-contained file with no external dependencies beyond React, so a type error here would indicate a typo in the JSX/TS above — fix directly if lint reports one.

- [ ] **Step 3: Commit**

```bash
git add src/components/decorative/IndianBorder.tsx
git commit -m "feat: add IndianBorder illustration component (botanical/geometric/minimal)"
```

(No visual verification yet — nothing renders this component until Task 7.)

---

### Task 6: Texture layer

**Files:**
- Modify: `src/app/globals.css` (add a rule to the existing `body` base style — search for the current `body` selector in the `@layer base`/base-styles section starting around line 509; if no bare `body { }` rule exists yet, add a new one immediately after the `@theme inline` block closes at line 507)

**Interfaces:**
- Consumes: `var(--bg)` from Task 1 (the texture sits on top of the new ivory background).
- Produces: nothing consumed by later tasks — a leaf visual addition.

- [ ] **Step 1: Read the current `body` rule**

Open `src/app/globals.css` and find the existing `body` selector (search for `^body\s*{` or similar in the Base Styles section starting at/after line 509). Note its current declarations so Step 2 adds to them rather than duplicating a second `body` rule.

- [ ] **Step 2: Add the grain background**

Add `background-image` and `background-repeat` declarations to the existing `body` rule (or, if `body` styling is currently handled entirely via Tailwind classes in `layout.tsx`'s `<body className="min-h-full flex flex-col">` with no CSS `body` rule in `globals.css`, add a new rule instead):

```css
body {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E");
  background-repeat: repeat;
}
```

If a `body` rule already exists with other declarations (background-color, color, etc.), add these two lines into it rather than creating a duplicate selector — CSS applies duplicate selectors additively but a single rule is clearer and avoids specificity confusion.

- [ ] **Step 3: Verify — visual smoke check**

Run: `npm run dev`. Zoom the browser to 300-400% on a plain ivory area (e.g. page background between sections) and confirm a faint grain texture is visible. At normal zoom/viewing distance it should be nearly imperceptible — "felt, not noticed" per the spec. If it reads as visible noise at normal zoom, reduce the `0.04` alpha value in the `feColorMatrix` (e.g. to `0.025`) and re-check.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add subtle paper-grain texture layer to body background"
```

---

### Task 7: Footer `IndianBorder` treatment + `#ingredients` anchor

**Files:**
- Modify: `src/app/page.tsx:1-15` (imports), `src/app/page.tsx:38-68` (homepage wrapper + footer opening)

**Interfaces:**
- Consumes: `IndianBorder` component from Task 5 (`import IndianBorder from "@/components/decorative/IndianBorder";`).

- [ ] **Step 1: Import `IndianBorder`**

In `src/app/page.tsx`, add to the imports (after line 3's `getHomePageData` import):

```typescript
import IndianBorder from "@/components/decorative/IndianBorder";
```

- [ ] **Step 2: Add the `#ingredients` anchor**

In `src/app/page.tsx`, replace line 39:

```tsx
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)", color: "var(--text)" }}>
```

with:

```tsx
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <div id="ingredients" aria-hidden="true" />
```

(This is an inert, empty anchor target — Phase 3 will replace it with the actual ingredient showcase section. It gives `/#ingredients` links a valid same-page target now instead of a dead link.)

- [ ] **Step 3: Add the border above the footer**

In `src/app/page.tsx`, replace line 68 (the `<footer ...>` opening tag) with:

```tsx
      <IndianBorder variant="minimal" position="top" className="px-4 sm:px-6 lg:px-8" />
      <footer className="pt-16 pb-8 px-4 sm:px-6 lg:px-8 mt-auto" style={{ background: "var(--brand-brown-dark, #3C2015)", color: "var(--brand-cream)" }}>
```

Note: `IndianBorder`'s default `color: var(--color-secondary-brown)` (a warm terracotta) reads fine against the ivory background immediately above the footer, where this component is placed (it sits between the last homepage section and the dark footer, not inside the dark footer itself).

- [ ] **Step 4: Verify — lint**

Run: `cd client-next && npm run lint`
Expected: no errors.

- [ ] **Step 5: Verify — visual smoke check**

Run: `npm run dev`, scroll to the bottom of the homepage. Confirm: a thin decorative line-with-flourish motif appears directly above the footer; navigating to `/#ingredients` (e.g. type it in the address bar) scrolls to the empty anchor point without a console error or visual glitch.

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: add footer IndianBorder treatment and #ingredients anchor"
```

---

### Task 8: Nav link set + Admin link de-emphasis

**Files:**
- Modify: `src/lib/LanguageContext.tsx:38-76` (English dictionary only)
- Modify: `src/components/partials/Header.tsx:156-178` (desktop nav array + Admin link), `src/components/partials/Header.tsx:412-429` (mobile drawer array)

**Interfaces:**
- Produces: two new translation keys, `nav.journal` and `nav.ingredients`, available to `t()` everywhere (non-English locales fall back to the English value automatically per `LanguageContext.tsx:342`'s `langDict[key] || DICTIONARY.English[key] || key` fallback chain — no other language block needs editing).

- [ ] **Step 1: Add the two new translation keys**

In `src/lib/LanguageContext.tsx`, in the `English` dictionary block, replace line 41:

```typescript
    "nav.blogs": "Blogs",
```

with:

```typescript
    "nav.blogs": "Blogs",
    "nav.journal": "Journal",
    "nav.ingredients": "Ingredients",
```

- [ ] **Step 2: Reorder and relabel the desktop nav links**

In `src/components/partials/Header.tsx`, replace lines 156-169 (the `<nav className="hidden md:flex ...">` block's link array and map):

```tsx
            <nav className="hidden md:flex items-center gap-4 lg:gap-6">
              {[
                { href: "/shop", label: t("nav.shop") },
                { href: "/#values", label: t("nav.story") },
                { href: "/#ingredients", label: t("nav.ingredients") },
                { href: "/blogs", label: t("nav.journal") },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="site-link px-3.5 py-2 text-sm font-semibold transition-all whitespace-nowrap hover:bg-black/5 rounded-lg"
                >
                  {item.label}
                </Link>
              ))}
```

(Leave the `{user?.role === 1 && (...)}` Admin block that follows in place structurally — it's edited in Step 3.)

- [ ] **Step 3: De-emphasize the Admin link**

In `src/components/partials/Header.tsx`, replace lines 170-177:

```tsx
              {user?.role === 1 && (
                <Link
                  href="/admin"
                  className="site-muted px-3 py-2 text-xs font-medium transition-colors hover:opacity-75 rounded-lg"
                >
                  {t("nav.admin")}
                </Link>
              )}
```

(Changed from `site-link ... text-sm font-bold ... hover:bg-black/5` to `site-muted ... text-xs font-medium ... hover:opacity-75` — smaller, muted color, no hover background, so it reads as a secondary/utility link rather than a primary nav item.)

- [ ] **Step 4: Reorder and relabel the mobile drawer links**

In `src/components/partials/Header.tsx`, replace lines 415-420:

```tsx
            {[
              { href: "/shop", label: "🛍️  Shop All" },
              { href: "/#values", label: "🏡  Our Story" },
              { href: "/#ingredients", label: "🌾  Ingredients" },
              { href: "/blogs", label: "📰  Journal" },
              { href: "/cart", label: `🛒  Cart (${cartCount})` },
            ].map((item) => (
```

- [ ] **Step 5: Verify — lint**

Run: `cd client-next && npm run lint`
Expected: no errors.

- [ ] **Step 6: Verify — visual smoke check**

Run: `npm run dev`. Confirm desktop nav shows, in order: Shop, Our Story, Ingredients, Journal (Journal navigates to `/blogs`, Ingredients scrolls to the Task 7 anchor). Log in as an admin user (`role === 1`) and confirm the Admin link renders visibly smaller/muted next to the four main links, not styled identically to them. Open the mobile drawer (narrow viewport) and confirm the same order plus Cart.

- [ ] **Step 7: Commit**

```bash
git add src/lib/LanguageContext.tsx src/components/partials/Header.tsx
git commit -m "feat: update nav link set to Shop/Our Story/Ingredients/Journal, de-emphasize Admin link"
```

---

### Task 9: Search — icon-triggered overlay

**Files:**
- Modify: `src/components/partials/Header.tsx` (remove desktop always-visible search block, unify with the existing mobile-toggle pattern)

**Interfaces:**
- Consumes: existing state (`searchQuery`, `allProducts`, `searchResults`, `showDropdown`, `searchContainerRef`, `handleSearchSubmit`, `filterList`) — all unchanged, only their trigger/visibility mechanism changes.
- Produces: renames `mobileSearchOpen` → `searchOpen` (used for all breakpoints now). No other task references this state name.

- [ ] **Step 1: Rename the state variable**

In `src/components/partials/Header.tsx`, replace line 27:

```typescript
  const [searchOpen, setSearchOpen] = useState(false);
```

- [ ] **Step 2: Update the other `setMobileSearchOpen` call site in `handleSearchSubmit`**

`mobileSearchOpen`/`setMobileSearchOpen` is referenced in four places in the original file — the declaration (Step 1, above), the toggle button (handled in Step 3 below), the search-overlay block (handled in Step 4 below), and one more that's easy to miss because it's in an unrelated function: inside `handleSearchSubmit` (lines 83-91), which runs on every search form submission regardless of which UI triggered it. Replace line 88:

```typescript
    setSearchOpen(false);
```

(This is the same line, just `setMobileSearchOpen(false)` → `setSearchOpen(false)` — it's listed as its own step because it's easy to miss when doing a mental find-and-replace scoped only to the search-UI blocks touched in Steps 3-4.)

- [ ] **Step 3: Delete the always-visible desktop search block**

Delete lines 180-255 in `src/components/partials/Header.tsx` — the entire `{/* Desktop Search Bar */}` `<div ref={searchContainerRef} className="hidden lg:block ...">...</div>` block, including its autocomplete dropdown.

- [ ] **Step 4: Make the search icon button visible at all breakpoints**

Replace what were lines 260-269 (the `{/* Mobile Search Toggle Icon */}` button — line numbers shift after Step 3's deletion, locate by the `aria-label="Search"` button just before the Cart `<Link>`):

```tsx
              {/* Search Toggle Icon */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="icon-action p-2 transition-colors"
                aria-label="Search"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
```

(Removed `lg:hidden` so this single button now covers all breakpoints.)

- [ ] **Step 5: Attach the outside-click ref to the search overlay, and make it universal**

Locate what was the `{/* Mobile Search Bar Expansion */}` block (originally lines 331-409, referencing `mobileSearchOpen`). Replace its opening condition and wrapper:

```tsx
          {searchOpen && (
            <div ref={searchContainerRef} className="pb-3 pt-1 relative border-t border-[var(--color-border)]">
```

(Removed `lg:hidden` so the overlay panel now works at all breakpoints; added `ref={searchContainerRef}` here since it no longer lives on the deleted desktop block from Step 3.)

Within that same block, replace the remaining reference to `setMobileSearchOpen(false)` with `setSearchOpen(false)` (there is one such call inside the search-result `onClick` handler, in the block being edited here).

- [ ] **Step 6: Update the outside-click handler**

In the `useEffect` at lines 30-51, the existing `handleClickOutside` already closes `showDropdown` when a click lands outside `searchContainerRef`. Extend it to also close the whole overlay — replace:

```typescript
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
```

with:

```typescript
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
        setSearchOpen(false);
      }
    };
```

- [ ] **Step 7: Verify — lint and type-check**

Run: `cd client-next && npm run lint`
Expected: no errors, and specifically no "unused variable" warnings for anything named `mobileSearchOpen`/`setMobileSearchOpen` (confirms Steps 1-6 fully renamed every usage — if lint flags a leftover reference, grep the file for `mobileSearchOpen` and fix it).

- [ ] **Step 8: Verify — visual smoke check**

Run: `npm run dev`. At both desktop and mobile widths: confirm no search field is visible by default; clicking the search icon expands the overlay with the input focused-looking and functional (type a product name substring, confirm the autocomplete dropdown appears); clicking outside the overlay closes it; submitting a search navigates to `/shop?search=...` as before.

- [ ] **Step 9: Commit**

```bash
git add src/components/partials/Header.tsx
git commit -m "feat: unify search into a single icon-triggered overlay for all breakpoints"
```

---

### Task 10: Language selector relocation

**Files:**
- Modify: `src/components/partials/Header.tsx:104-130` (announcement bar), `src/components/partials/Header.tsx` right-actions cluster (add relocated control)

**Interfaces:**
- Consumes: existing `language`, `setLanguage` from `useLanguage()` (unchanged).

- [ ] **Step 1: Strip the language selector out of the announcement bar**

In `src/components/partials/Header.tsx`, replace lines 104-130:

```tsx
      {/* Top announcement bar */}
      <div className="site-announcement flex items-center justify-center text-[11px] font-medium py-2 px-4 sm:px-8 tracking-wide text-center">
        {t("announcement")}
      </div>
```

- [ ] **Step 2: Add the relocated language control to the Right Actions cluster**

In `src/components/partials/Header.tsx`, inside the `{/* Right Actions */}` div (starts at what was line 258), insert this immediately before the Search Toggle Icon button from Task 9 Step 4:

```tsx
              {/* Language selector */}
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  aria-label="Select language"
                  className="icon-action appearance-none bg-transparent pl-6 pr-1.5 py-2 text-[11px] font-semibold rounded-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                >
                  <option value="English">English</option>
                  <option value="Hindi">हिंदी (Hindi)</option>
                  <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
                  <option value="Tamil">தமிழ் (Tamil)</option>
                  <option value="Telugu">తెలుగు (Telugu)</option>
                  <option value="Malayalam">മലയാളം (Malayalam)</option>
                  <option value="Marathi">मराठी (Marathi)</option>
                  <option value="Bengali">বাংলা (Bengali)</option>
                  <option value="Gujarati">ગુજરાતી (Gujarati)</option>
                  <option value="Spanish">Español (Spanish)</option>
                  <option value="French">Français (French)</option>
                </select>
                <span className="pointer-events-none absolute left-1.5 top-1/2 -translate-y-1/2 text-xs">🌐</span>
              </div>
```

- [ ] **Step 3: Update `.site-announcement` CSS for the simplified centered layout**

In `src/app/globals.css:1638`, the existing rule `.site-announcement { background: var(--color-espresso); color: var(--color-ivory); }` already works unchanged with the new centered-text markup from Step 1 (no color/background logic depended on the removed language-select children) — no CSS edit needed here. Confirm this by visual check in Step 4 rather than editing blindly.

- [ ] **Step 4: Verify — lint**

Run: `cd client-next && npm run lint`
Expected: no errors.

- [ ] **Step 5: Verify — visual smoke check**

Run: `npm run dev`. Confirm the top announcement bar shows only the centered promotional text (no globe icon/select inside it). Confirm a small globe-icon language dropdown now appears in the header's right-hand icon cluster, and that changing it still switches the visible language across the page (e.g. nav labels and `announcement` text) exactly as before the move.

- [ ] **Step 6: Commit**

```bash
git add src/components/partials/Header.tsx
git commit -m "feat: relocate language selector from announcement bar to header icon cluster"
```

---

### Task 11: Transparent-over-hero navigation (homepage only)

**Files:**
- Modify: `src/components/partials/Header.tsx` (add `usePathname`, transparent-state logic, apply to header `className` and logo)
- Modify: `src/app/globals.css` (add `.site-header.is-transparent` rules)

**Interfaces:**
- Consumes: `usePathname` from `next/navigation` (already imported for `useRouter` in this file — add `usePathname` to the same import).

- [ ] **Step 1: Import `usePathname` and compute the transparent state**

In `src/components/partials/Header.tsx`, replace line 5:

```typescript
import { useRouter, usePathname } from "next/navigation";
```

Then, after line 20 (`const [scrolled, setScrolled] = useState(false);`), add:

```typescript
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isTransparent = isHome && !scrolled;
```

- [ ] **Step 2: Apply the `is-transparent` class**

Replace lines 132-137 (the `<header className={...}>` opening):

```tsx
      <header
        className={`site-header sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "is-scrolled backdrop-blur-md" : ""
        } ${isTransparent ? "is-transparent" : ""}`}
      >
```

- [ ] **Step 3: Add `transition-colors` to the logo text so its color crossfades smoothly**

Replace line 146:

```tsx
                <div className="site-logo-name font-bold text-sm sm:text-lg tracking-tight truncate transition-colors">
```

- [ ] **Step 4: Add the transparent-state CSS**

In `src/app/globals.css`, immediately after line 1640 (`.site-header.is-scrolled { ... }`), add:

```css
.site-header.is-transparent { background: transparent; border-bottom-color: transparent; }
.site-header.is-transparent .site-link,
.site-header.is-transparent .site-logo-name,
.site-header.is-transparent .site-muted,
.site-header.is-transparent .icon-action {
  color: var(--color-ivory);
}
.site-header.is-transparent .site-link:hover,
.site-header.is-transparent .site-link:focus-visible {
  color: var(--color-ivory);
  background: color-mix(in srgb, var(--color-ivory) 15%, transparent);
}
```

- [ ] **Step 5: Verify — lint**

Run: `cd client-next && npm run lint`
Expected: no errors.

- [ ] **Step 6: Verify — visual smoke check (both hero states, per the Global Constraints caveat)**

Run: `npm run dev`. On the homepage (`/`) at the very top of the page (unscrolled):
- **If CMS hero sliders are configured** (the merchant-configured production state, dark `hero-overlay` background): confirm the header renders with a fully transparent background and light/ivory nav text/icons, legible against the dark hero overlay. Scroll down past the hero and confirm the header smoothly crossfades to the normal opaque ivory background with dark-brown text.
- **If no CMS sliders are configured** (the `hero-fallback` light-linen/ivory state): confirm whether the light nav text is legible against the light fallback background. If it is not (expected per the Global Constraints caveat), do not attempt to fix it in this task — note it in the task report as an open item for Phase 2, which owns the hero rebuild.
- Navigate to `/shop` or `/cart` and confirm the header is opaque from initial render (no transparent flash), matching pre-existing behavior.

- [ ] **Step 7: Commit**

```bash
git add src/components/partials/Header.tsx src/app/globals.css
git commit -m "feat: add transparent-over-hero header state on homepage, opaque elsewhere"
```

---

### Task 12: Full verification pass

**Files:** none (verification only)

**Interfaces:** none — this task consumes the combined output of Tasks 1-11 and produces no code.

- [ ] **Step 1: Install and lint**

Run: `cd client-next && npm install && npm run lint`
Expected: `npm install` reports no changes (no new dependency was added across this plan); lint passes with no errors.

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: build succeeds with no type errors. (This is the closest thing to a compile-time test this project has, per the Global Constraints note on the missing test runner — treat a failing build as a blocking failure requiring a fix, not a note-and-continue item.)

- [ ] **Step 3: Full manual walkthrough**

Run: `npm run dev` and, in a browser:
1. Homepage: hero transparent-nav-to-opaque crossfade (per Task 11's caveat about the two hero states), palette reads as ivory/deep-brown/terracotta/saffron throughout, footer shows the `IndianBorder` treatment, `/#ingredients` anchor is reachable.
2. Nav: Shop / Our Story / Ingredients / Journal in that order; search icon opens/closes the overlay and autocomplete still works; language dropdown switches language; Admin link (as an admin user) reads visually secondary.
3. `/shop`, `/cart`: header opaque from initial render, no transparent flash.
4. Toggle OS/browser dark mode (or the app's own dark-mode toggle) and confirm the dark palette from Task 2 applies without illegible text.
5. Resize to a mobile viewport width and confirm the mobile drawer shows the updated link order plus Cart, and the search/language controls remain usable.
6. Admin branding settings (`/admin` → customization) still successfully override the palette at runtime (re-verify the check from Task 3 Step 3 now that all other tasks have landed on top of it).

- [ ] **Step 4: Confirm workspace hygiene**

Run: `git status` in `client-next`. Expected: clean working tree (everything committed by Tasks 1-11), and `git stash list` still shows the untouched "wip: motion-interaction-plan (pre Indian heritage redesign)" entry from before this plan started.

- [ ] **Step 5: Report**

No commit for this task (verification-only) — record the walkthrough results (pass/fail per item above, and explicitly the fallback-hero legibility observation from Task 11) in the task report for the controller/reviewer to read.
