# Phase 1 Token Reconcile — Report

**Date:** 2026-06-30
**Commit base:** 509a9c8

---

## Computed OKLCH values (culori, exact)

| Hex | OKLCH (rounded to 3dp) | Used as |
|---|---|---|
| `#48454e` | `oklch(0.397 0.015 300.9)` | `--body-text` |
| `#e8ddff` | `oklch(0.917 0.047 300.2)` | `--container` |
| `#21005e` | `oklch(0.243 0.141 285.7)` | `--container-foreground` |
| `#fdf8fd` | `oklch(0.984 0.008 325.6)` | `--container-lite` |
| `#62597e` | `oklch(0.487 0.059 295.3)` | (D — see below) |

---

## A. Font vars (final lines in `@theme inline`)

```css
--font-sans: var(--font-neue-haas-text, var(--font-inter)), system-ui, sans-serif;
--font-display: var(--font-neue-haas, var(--font-inter)), system-ui, sans-serif;
```

Grep confirms only these two references exist in `app/globals.css` and both carry the nested Inter fallback. An absent `--font-neue-haas-text` resolves to `var(--font-inter)` before the browser reaches `system-ui`.

`app/layout.tsx` comment block updated to document both the Text (body, 400/500) and Display (headings, 600/700) localFont blocks as a commented drop-in seam.

`app/fonts/README.md` updated to cover both variants.

---

## B. Body-text token

- `--body-text: oklch(0.397 0.015 300.9)` added to `:root`.
- `--color-body-text: var(--body-text)` added to `@theme inline`.
- `@layer base body` rule: removed `@apply text-foreground`, added `color: var(--body-text)`.
- `@layer base h1,h2,h3,h4` rule: added `color: var(--foreground)`.
- `app/layout.tsx` `<body>` className: `text-foreground` removed; `bg-background font-sans antialiased` kept.

---

## C. Purple surface-tint scale

Added to `:root`:
```css
--surface-5: oklch(0.508 0.234 288.5 / 0.05);
--surface-8: oklch(0.508 0.234 288.5 / 0.08);
--surface-11: oklch(0.508 0.234 288.5 / 0.11);
--container: oklch(0.917 0.047 300.2);
--container-foreground: oklch(0.243 0.141 285.7);
--container-lite: oklch(0.984 0.008 325.6);
```

All six mapped in `@theme inline` as `--color-surface-5/8/11`, `--color-container`, `--color-container-foreground`, `--color-container-lite` — so `bg-surface-8`, `bg-container`, `text-container-foreground` work as Tailwind utilities.

---

## D. Secondary nudge — LEFT UNCHANGED

Current `--secondary-foreground: oklch(0.405 0.030 300)` ≈ `#4b4657`, contrast on secondary bg = **8.27:1**.
Proposed new `#62597e` (`oklch(0.487 0.059 295.3)`) would drop to **5.87:1** — still above 4.5 AA minimum but a notable regression from 8.27. The divergence between the live site (`#62597e`) and the brand guide (`#615B71`) is a 1-digit delta; neither matches the current DS value. Per spec guidance ("if it risks the secondary-button contrast pair, LEAVE IT"), the token was not changed. The divergence is noted here for Phase 2.

---

## E. Badge `pill` shape variant

```ts
shape: {
  default: "rounded-md",
  pill: "rounded-full px-3",
},
defaultVariants: { variant: "default", shape: "default" },
```

The base class `rounded-md` was removed from the fixed string and moved into the `shape.default` variant so the pill variant can override it cleanly. All existing color variants unchanged.

---

## Registry.json sync

`cssVars.light` additions:
- `body-text`, `surface-5`, `surface-8`, `surface-11`, `container`, `container-foreground`, `container-lite`

`cssVars.theme` additions:
- `color-body-text`, `color-surface-5`, `color-surface-8`, `color-surface-11`, `color-container`, `color-container-foreground`, `color-container-lite`

`font-sans` and `font-display` updated to hardened nested-fallback form.

---

## Contrast gate output (15/15 PASS)

```
PASS body text: 17.02 (min 4.5)         ← foreground on background
PASS primary button: 6.31 (min 4.5)
PASS secondary button: 8.27 (min 4.5)
PASS muted text: 5.05 (min 4.5)
PASS accent: 7.14 (min 4.5)
PASS destructive button: 6.50 (min 4.5)
PASS success: 5.45 (min 4.5)
PASS warning: 7.26 (min 4.5)
PASS info: 5.96 (min 4.5)
PASS success tint text: 5.04 (min 4.5)
PASS warning tint text: 14.66 (min 4.5)
PASS info tint text: 5.47 (min 4.5)
PASS destructive tint text: 5.89 (min 4.5)
PASS body text: 9.21 (min 4.5)          ← new: --body-text on --background
PASS on-container text: 13.24 (min 4.5) ← new: --container-foreground on --container
```

---

## tsc + build

- `npx tsc --noEmit` — clean (no output)
- `npm run build` — succeeded (Next.js 16.2.9 Turbopack, 4 static pages)

---

## theme.json grep proof

```
"color-body-text": "var(--body-text)",
"color-container": "var(--container)",
"color-container-foreground": "var(--container-foreground)",
"color-container-lite": "var(--container-lite)",
"body-text": "oklch(0.397 0.015 300.9)",
"container": "oklch(0.917 0.047 300.2)",
"container-foreground": "oklch(0.243 0.141 285.7)",
"container-lite": "oklch(0.984 0.008 325.6)"
```

(`surface-5/8/11` also present in theme.json — omitted from excerpt for brevity.)

---

## Concerns / notes

- `--surface-5/8/11` are alpha tokens; not all compositing environments handle oklch alpha identically. Downstream consumers should test on their target browsers.
- The contrast gate script now has two pairs labeled "body text" (old `foreground/background` pair and new `body-text/background` pair). Labels are cosmetic only; both pass.
- Phase 2 should reconsider `--secondary-foreground` alignment once a brand-guide canonical value is confirmed.
