# CourtChat Design System — Design Spec

**Date:** 2026-06-30
**Owner:** Paul Gehrig (Product & Design, unBail Labs)
**Status:** Approved design → ready for implementation plan

A shadcn/ui-based design system customizing components to the unBail / CourtChat
brand. General-purpose foundation (tokens + components) intended to be themed
per-surface (admin dashboard, defendant-facing app, marketing) later.

---

## 1. Goals & non-goals

**Goals**
- A reusable token + component layer that any shadcn project can adopt.
- Faithful to the documented CourtChat brand (purple), tuned for a calm + human
  baseline that can flex toward "credible" for court/funder-facing surfaces.
- Accessible by default (WCAG 2.1 AA): rem-based type, 16px reading floor,
  visible focus, reduced-motion support, AA contrast on all text/UI pairs.
- Drop-in ready: works today with Inter; Neue Haas renders once licensed files
  are added, with no other changes.

**Non-goals (YAGNI for now)**
- Dark-mode *values* — token structure is dark-ready, but no `.dark` palette is
  authored yet.
- Style Dictionary / multi-platform token pipeline.
- Figma sync.
- Pre-built per-surface theme files — documented as a pattern, not shipped.

---

## 2. Foundational decisions (locked)

| Decision | Choice |
|---|---|
| Color anchor | Documented purple brand guidelines (not live-site teal) |
| Target surface | General-purpose kit, themed per-surface later |
| Tone | Balanced — calm + human baseline, flexes credible |
| Typography | Neue Haas Grotesk Display (headings) + Inter (body/UI) |
| Modes | Light now, token structure dark-ready |
| Shape/density | Soft shell (rounded ~12px) + compact core (dense data areas) |
| Stack/format | shadcn + Tailwind v4, OKLCH CSS variables + `@theme` |
| Delivery | Theme + customized component showcase + concise usage doc |

**Brand source values (from CourtChat brand guidelines):**
Primary `#6938DF` · Secondary `#615B71` · Background `#FFFBFF` · Text `#1C1B1D` ·
Type: Neue Haas Grotesk Display, Inter backup.

---

## 3. Color system

shadcn theming is **semantic** (`--primary`, `--muted`, `--destructive`…). We map
brand values onto those roles and derive supporting ramps. All values are OKLCH.

### 3.1 Brand → ramps

**Purple ramp** (hue ≈ 288.5°, derived from `#6938DF`):

| Step | OKLCH | Use |
|---|---|---|
| 50  | `oklch(0.971 0.014 288.5)` | softest tint / accent bg |
| 100 | `oklch(0.943 0.030 288.5)` | accent, selected bg |
| 200 | `oklch(0.893 0.060 288.5)` | hover tint |
| 300 | `oklch(0.823 0.105 288.5)` | borders on purple surfaces |
| 400 | `oklch(0.690 0.175 288.5)` | secondary accent |
| 500 | `oklch(0.585 0.215 288.5)` | hover for primary |
| **600** | **`oklch(0.508 0.234 288.5)`** | **brand primary (`#6938DF`)** |
| 700 | `oklch(0.445 0.215 288.5)` | active/pressed, accent-foreground |
| 800 | `oklch(0.382 0.175 288.5)` | text on light tints |
| 900 | `oklch(0.318 0.120 288.5)` | deep purple text |
| 950 | `oklch(0.242 0.080 288.5)` | darkest |

**Neutral ramp** (hue ≈ 300°, low chroma — *slightly purple-tinted*, not pure gray,
derived from `#615B71`):

| Step | OKLCH | Use |
|---|---|---|
| 50  | `oklch(0.985 0.004 300)` | subtle fill |
| 100 | `oklch(0.967 0.006 300)` | muted/secondary bg |
| 200 | `oklch(0.928 0.010 300)` | border / input |
| 300 | `oklch(0.872 0.015 300)` | stronger border |
| 400 | `oklch(0.715 0.022 300)` | disabled text |
| 500 | `oklch(0.575 0.030 300)` | muted-foreground |
| **600** | **`oklch(0.485 0.035 300)`** | **secondary (`#615B71`)** |
| 700 | `oklch(0.405 0.030 300)` | secondary-foreground |
| 800 | `oklch(0.310 0.022 300)` | strong text |
| 900 | `oklch(0.245 0.014 300)` | near-fg |
| 950 | `oklch(0.180 0.010 300)` | darkest neutral |

### 3.2 Semantic state colors

Brand only supplies purple; success/warning/error/info are **derived to harmonize**
(similar lightness/chroma, distinct hue) so they don't clash with the purple.

| State | Base | Foreground (on base) | Light bg |
|---|---|---|---|
| success | `oklch(0.62 0.14 155)` | `oklch(0.99 0 0)` | `oklch(0.96 0.03 155)` |
| warning | `oklch(0.75 0.15 75)`  | `oklch(0.24 0.04 75)` | `oklch(0.96 0.04 75)` |
| error / destructive | `oklch(0.58 0.20 18)` | `oklch(0.99 0 0)` | `oklch(0.96 0.03 18)` |
| info | `oklch(0.60 0.16 260)` | `oklch(0.99 0 0)` | `oklch(0.96 0.03 260)` |

### 3.3 shadcn semantic token map (light `:root`)

| Token | Value |
|---|---|
| `--background` | `oklch(0.994 0.003 325)` (warm white `#FFFBFF`) |
| `--foreground` | `oklch(0.22 0.005 300)` (`#1C1B1D`) |
| `--card` / `--popover` | `oklch(0.994 0.003 325)` |
| `--card-foreground` / `--popover-foreground` | `var(--foreground)` |
| `--primary` | `oklch(0.508 0.234 288.5)` |
| `--primary-foreground` | `oklch(0.99 0.005 320)` |
| `--secondary` | neutral-100 `oklch(0.967 0.006 300)` |
| `--secondary-foreground` | neutral-700 `oklch(0.405 0.030 300)` |
| `--muted` | neutral-100 |
| `--muted-foreground` | neutral-500 `oklch(0.575 0.030 300)` |
| `--accent` | purple-100 `oklch(0.943 0.030 288.5)` |
| `--accent-foreground` | purple-700 `oklch(0.445 0.215 288.5)` |
| `--destructive` | `oklch(0.58 0.20 18)` |
| `--destructive-foreground` | `oklch(0.99 0 0)` |
| `--border` / `--input` | neutral-200 `oklch(0.928 0.010 300)` |
| `--ring` | `var(--primary)` |
| `--radius` | `0.75rem` |
| `--chart-1..5` | purple-600, info, success, warning, purple-300 |

Extra (non-shadcn-core) tokens exposed for app use: `--success`, `--success-foreground`,
`--warning`, `--warning-foreground`, `--info`, `--info-foreground`, plus the
`--success-bg` / `--warning-bg` / etc. light backgrounds.

> **Note:** exact OKLCH values are starting points; each text/UI pairing is
> verified against AA contrast during implementation and nudged if it falls short.

### 3.4 Dark-readiness

All component styles reference semantic tokens only (never raw ramp steps or hexes),
so authoring a `.dark` block later is purely additive — no component changes.

---

## 4. Typography

**Font stacks (CSS variables):**
- `--font-display`: `"Neue Haas Grotesk Display", Inter, system-ui, sans-serif`
- `--font-sans`: `Inter, system-ui, sans-serif`

Inter is live immediately; Neue Haas renders once `.woff2` files (weights 600, 700)
are dropped in and wired to `--font-display`. No other change needed.

**Type scale** (rem-based, ~1.25 ratio):

| Token | Size | Use |
|---|---|---|
| `xs` | 12px | captions, metadata |
| `sm` | 14px | UI default, table cells, helper text |
| `base` | 16px | body copy (reading floor — never smaller) |
| `lg`–`xl` | 18–20px | lead paragraphs, card titles |
| `2xl`–`4xl` | 24–36px | section + page headings |
| `5xl`+ | 48px+ | marketing hero (display font, tight tracking) |

**Weights:** Inter 400 / 500 / 600; Neue Haas Display 600–700 for headings.
No light weights (read thin/uncertain, undercut trust).

**Defaults:** body line-height 1.6; headings 1.15 + slightly tight tracking;
`max-w-prose` (~65ch) guidance for long-form explainer text.

---

## 5. Shape, spacing, elevation, motion

**Radius** (`--radius: 0.75rem` base):
- Shell (12px): cards, dialogs, popovers, primary buttons, inputs.
- `sm` 8px: badges, small controls, nested elements.
- `lg` 16px: large surfaces. `full`: pills, avatars.
- **Compact-core exception:** table rows, menu items, list rows use smaller radii.

**Spacing:** Tailwind 4px base scale with roomy component defaults — buttons
`h-10`/`px-4`, inputs `h-10`, cards `p-6`, generous section gaps. Compact-core
areas (tables, menus) tighten to `py-2`. Density delivered as a **`compact`
variant on data components**, not a global toggle (no fragile global state).

**Elevation:** soft, low-contrast shadows. 2-step: `shadow-sm` (resting cards),
`shadow-md` (overlays). Borders carry structure; shadow signals layering only.

**Motion:** 150–200ms ease-out, no spring/bounce. Honors `prefers-reduced-motion`
(drops transforms/large transitions, keeps opacity).

---

## 6. Components

**Tier 1 — fully customized (carry the brand):**
- **Button** — 12px radius; variants `default` (purple), `secondary`, `outline`,
  `ghost`, `link`, `destructive`; sizes `sm/default/lg` + icon; roomy padding,
  500-weight label.
- **Input / Textarea / Select / Label** — `h-10`, 12px radius, purple focus ring,
  error state wired to semantic `error`.
- **Card** — `p-6`, soft shell, `shadow-sm`.
- **Alert / Callout** — four semantic tones (info/success/warning/error).
- **Badge / Tag** — `sm` radius, tint backgrounds.
- **Table** — compact-core: tight rows, tinted header, hover row highlight;
  ships a `compact` density treatment.

**Tier 2 — themed but standard (inherit tokens; documented, not bespoke):**
Dialog, Dropdown/Popover, Tabs, Checkbox/Radio/Switch, Tooltip, Breadcrumb,
Avatar, Skeleton.

---

## 7. Deliverable structure

```
courtchat-design-system/
├── globals.css            # OKLCH token layer (:root + .dark stub) + @theme
├── tailwind.config.ts     # font vars, radius, shadow, animation extensions
├── components.json        # shadcn config
├── lib/utils.ts           # cn() helper
├── components/ui/         # Tier 1 customized components
├── app/
│   ├── layout.tsx         # font wiring (Inter live, Neue Haas drop-in)
│   └── page.tsx           # showcase page rendering all components
├── docs/
│   └── superpowers/specs/ # this spec
└── README.md              # usage doc: tokens, theming per-surface, do/don'ts
```

The showcase `page.tsx` doubles as living documentation: open it, see the whole
system. Target host: **Next.js** (CourtChat frontend is React).

---

## 8. Accessibility checklist (verified at build)

- All text/UI color pairs meet AA (4.5:1 body, 3:1 large/UI).
- Type in rem; 16px reading floor; respects user zoom.
- Visible, on-brand focus ring (`--ring`) on every interactive element.
- `prefers-reduced-motion` honored.
- Form inputs always have associated `<label>`; error states not color-only
  (icon/text too).

---

## 9. Open items (carry into implementation)

- Confirm Next.js as host (assumed). If Vite/CRA, font wiring + showcase shell differ.
- Tune exact OKLCH values against AA contrast during build.
- Neue Haas license/files: not needed now; spec stays Inter-live / Neue-Haas-ready.
