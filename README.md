# CourtChat Design System

A component library and token layer for CourtChat products, built on Next.js, Tailwind v4, and shadcn new-york/Radix. It ships an OKLCH purple token scale, Inter body type with a Neue Haas Grotesk Display drop-in, customized Tier-1 components with compact-core density on data surfaces, and a custom shadcn registry at `public/r/` so any consuming repo can pull source components directly via `npx shadcn add`.

---

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000 — showcase + token reference
npm run build      # production build
```

Other scripts:

```bash
npm run check:contrast    # AA contrast gate — verify semantic token pairs
npm run registry:build    # rebuild public/r/*.json from components/ui/
```

---

## Foundations

> **Foundational decisions:** [design spec](docs/superpowers/specs/2026-06-30-courtchat-design-system-design.md)

### Semantic tokens (`app/globals.css` `:root`)

| Token | Purpose |
|---|---|
| `--background` / `--foreground` | Page surface and body text |
| `--card` / `--card-foreground` | Card surface and text |
| `--popover` / `--popover-foreground` | Popover/dropdown surface and text |
| `--primary` / `--primary-foreground` | Brand purple CTAs and labels |
| `--secondary` / `--secondary-foreground` | Subdued interactive surface |
| `--muted` / `--muted-foreground` | De-emphasized surface and metadata text |
| `--accent` / `--accent-foreground` | Hover highlight and selection tint |
| `--destructive` / `--destructive-foreground` | Error/danger actions |
| `--success` / `--success-foreground` | Confirmed/resolved states |
| `--warning` / `--warning-foreground` | Caution states |
| `--info` / `--info-foreground` | Informational states |
| `--border` | Default border color |
| `--input` | Input field border |
| `--ring` | Focus ring (matches `--primary`) |

#### `*-bg` fill tokens — not mapped to Tailwind utilities

`--success-bg`, `--warning-bg`, `--info-bg`, and `--destructive-bg` are intentionally excluded from the `@theme inline` block. They exist as CSS custom properties only. Components reach them via `var(--success-bg)` directly. Do not expect `bg-success-bg` to work — it doesn't resolve.

### Radius, shadow, motion

- **Radius:** `--radius: 0.75rem` (12px shell). Derived scale: `--radius-sm` (8px), `--radius-md` (10px), `--radius-lg` (12px), `--radius-xl` (16px).
- **Shadow:** Soft 2-step — subtle lift on cards, stronger on popovers/dialogs.
- **Motion:** 150–200ms ease-out on interactive transitions. `prefers-reduced-motion` collapses all animations to 0.01ms globally (`app/globals.css`).

---

## Components

### Tier 1 — customized

These components have CourtChat-specific variants, density, or visual treatment beyond the shadcn new-york baseline:

- **button** — primary/secondary/outline/ghost/link/destructive; purple primary token; `size` prop (sm/default/lg/icon)
- **input** — focus ring matches `--ring`; error state = destructive border + destructive focus ring + `aria-invalid` (exposed to assistive tech). Pair the field with a visible error message so sighted low-vision users aren't relying on the color shift alone.
- **textarea** — same token treatment as input
- **label** — required indicator; pairs with input/textarea
- **select** — styled trigger/content matching input height
- **card** — shell radius (`--radius-lg`), soft shadow
- **badge** — default/secondary/outline/destructive/success/warning/info variants
- **alert** — default/destructive/success/warning/info; icon + text, not color-only
- **table** — compact-core density; sticky header variant; zebra striping token

### Tier 2 — inherit tokens, standard behavior

These use shadcn new-york baseline but automatically pick up CourtChat tokens (radius, ring, colors):

- **tabs** — `--primary` active indicator
- **dialog** — `--popover` surface, `--ring` focus
- **tooltip** — `--popover` surface
- **checkbox** — `--primary` checked state, `--ring` focus

---

## Use in another repo

The registry is hosted at `https://courtchat-design-system.vercel.app` (the showcase app). Update this URL if the project deploys elsewhere.

In a repo that already has shadcn + Tailwind v4 configured:

```bash
# 1. Adopt the brand tokens FIRST, with --overwrite.
#    --overwrite is required: shadcn's default merge only ADDS new tokens and
#    will NOT replace your existing --primary/--background/etc. Without it you
#    get a half-applied brand (purple primary never takes effect).
npx shadcn@latest add https://courtchat-design-system.vercel.app/r/theme.json --overwrite -y

# 2. Then add components.
npx shadcn@latest add https://courtchat-design-system.vercel.app/r/button.json -y
npx shadcn@latest add https://courtchat-design-system.vercel.app/r/alert.json -y
npx shadcn@latest add https://courtchat-design-system.vercel.app/r/table.json -y
# etc. — one command per component
```

`--overwrite` is non-destructive to structure: it updates the brand token
*values* in `:root` but preserves your `@import "tailwindcss"`, your `.dark`
block, and any tokens it doesn't define. Components declare the theme as a
dependency, but a dependency is pulled *without* `--overwrite`, so always run
the theme step yourself (step 1) to actually adopt the brand colors.

**What you get:**

- You receive **source files** — you own and customize them. This is not an npm package.
- Re-run `add` to pull an updated version from the registry.
- **No runtime npm dependency** on this repo.
- Each component's `registryDependencies` and `dependencies` fields declare what they need, so shadcn installs those automatically (the theme item, Radix primitives, `class-variance-authority`).

---

## Theming per surface

Copy the `:root` block into a surface-scoped selector and override the tokens you want to adjust. The simplest lever is `--primary` — how boldly brand purple appears varies by surface (calm reading context vs. credible action context).

```css
/* In the consuming app's globals.css */

/* Calm reading surface — soften primary slightly */
.surface-reading {
  --primary: oklch(0.56 0.20 288.5);          /* lighter purple */
  --accent: oklch(0.96 0.02 288.5);            /* near-white tint */
}

/* Credible action surface — richer primary */
[data-surface="action"] {
  --primary: oklch(0.46 0.25 288.5);          /* deeper purple */
  --ring: oklch(0.46 0.25 288.5);
}
```

Apply the class or attribute to a wrapper element. All components inside inherit the overridden tokens — no per-component changes needed.

---

## Do / Don't

**Do:**
- Reference semantic tokens (`--primary`, `var(--success-bg)`, `text-muted-foreground`) — never raw oklch/hex values.
- Keep body copy at or above 16px (1rem). The system sets this as the base; don't shrink it.
- Run `npm run check:contrast` after any token edit. All semantic pairs must pass AA (4.5:1 normal text, 3:1 large/UI).
- Use icon + text (or label) alongside color in error and status states — never color alone.

**Don't:**
- Hardcode hex, rgb, or oklch literals in component styles. If a token doesn't exist, add one.
- Use font-weight below 400 in UI copy; 500+ for interactive labels.
- Rely on `bg-success-bg` or any `*-bg` Tailwind class — they are not mapped. Use `var(--success-bg)` in CSS.
- Suppress the focus ring (`outline: none` without a replacement) — `--ring` must remain visible.

---

## Accessibility

- **Contrast:** All semantic foreground/background pairs are AA-verified (4.5:1 body, 3:1 large text and UI). The `npm run check:contrast` gate enforces this.
- **Typography:** Base font size is 16px (1rem). Type scale uses rem throughout so user browser preferences are respected.
- **Focus:** `--ring` (purple, matches `--primary`) is applied globally via `@layer base`. Every interactive element has a visible focus indicator without custom CSS.
- **Motion:** `prefers-reduced-motion: reduce` collapses all animation and transition durations to 0.01ms at the `@layer base` level — no per-component opt-in required.
- **Error states:** Alert, Input, and Badge components combine icon + text with color. Color is never the sole differentiator.
- **Dark mode:** Token structure is dark-ready. A `.dark { }` stub exists in `globals.css`. Fill in the token values to enable — no component changes needed.

---

## Neue Haas Grotesk Display (drop-in)

See `app/fonts/README.md` for the two-step process: add licensed `.woff2` files and uncomment the `localFont` block in `app/layout.tsx`. Headings switch from Inter to Neue Haas automatically via `--font-display` once the files are present.
