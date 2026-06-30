# CourtChat Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a shadcn/ui-based design system customized to the CourtChat purple brand, delivered as a runnable Next.js showcase that doubles as a custom shadcn registry other repos consume.

**Architecture:** A single Next.js 15 (App Router) + Tailwind v4 app. A semantic OKLCH token layer in `app/globals.css` maps the brand onto shadcn's CSS variables. Tier-1 components in `components/ui/` are customized to a soft-shell/compact-core shape language. A `registry.json` manifest plus `npx shadcn build` emits `public/r/*.json` so other repos pull source via `npx shadcn add <url>`. The showcase `app/page.tsx` is living documentation.

**Tech Stack:** Next.js 15 (App Router, TypeScript), Tailwind CSS v4 (CSS-first `@theme inline`), shadcn/ui (new-york style), Radix primitives, `tw-animate-css`, Inter (live) + Neue Haas Grotesk Display (drop-in), `culori` (build-time contrast verification only).

## Global Constraints

- **Color anchor:** documented purple brand — Primary `#6938DF`, Secondary `#615B71`, Background `#FFFBFF`, Text `#1C1B1D`. All color values authored in **OKLCH**.
- **Tailwind v4 CSS-first:** theme configured in `app/globals.css` via `@theme inline`. **No `tailwind.config.ts`** (v4 does not require it).
- **Components reference semantic tokens only** — never raw ramp steps or hex literals — so a `.dark` block is purely additive later.
- **Typography:** `--font-display` = `"Neue Haas Grotesk Display", Inter, system-ui, sans-serif`; `--font-sans` = `Inter, system-ui, sans-serif`. Inter renders live; Neue Haas is drop-in. No light font weights (400/500/600/700 only).
- **Shape:** `--radius: 0.75rem` shell; compact-core (tables/menus) use smaller radii. Soft 2-step shadows. Motion 150–200ms ease-out, honor `prefers-reduced-motion`.
- **Accessibility (WCAG 2.1 AA):** AA contrast on every text/UI pair (4.5:1 body, 3:1 large/UI); rem type, 16px reading floor; visible `--ring` focus on every interactive element; error states never color-only.
- **Light mode only now; dark-ready** — author a commented `.dark` stub but no dark values.
- **Commit after every task.** End commit messages with `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.

---

### Task 1: Scaffold Next.js + Tailwind v4 + shadcn

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `app/layout.tsx`, `app/globals.css`, `components.json`, `lib/utils.ts` (via scaffolding tools)
- Note: project root already contains `.git/`, `.gitignore`, `docs/`. Scaffold **in place**.

**Interfaces:**
- Produces: a runnable Next.js app (`npm run dev`), shadcn configured for Tailwind v4 / new-york style, `cn()` helper at `lib/utils.ts`.

- [ ] **Step 1: Scaffold Next.js into the existing directory**

```bash
cd /Users/paul/code/courtchat-design-system
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias "@/*" --no-turbopack --use-npm
```
When prompted that the directory is not empty, choose to continue (it preserves `.git`, `docs/`, `.gitignore`).

- [ ] **Step 2: Verify dev server boots**

Run: `npm run dev` then in another shell `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000`
Expected: `200`. Stop the dev server (Ctrl-C) after confirming.

- [ ] **Step 3: Initialize shadcn (new-york, Tailwind v4)**

```bash
npx shadcn@latest init -d
```
`-d` accepts defaults (new-york style, neutral base, CSS variables). This writes `components.json` and `lib/utils.ts`, and installs `clsx`, `tailwind-merge`, `class-variance-authority`, `tw-animate-css`, `lucide-react`.

- [ ] **Step 4: Verify shadcn wiring**

Run: `test -f components.json && test -f lib/utils.ts && grep -q "tailwindcss" app/globals.css && echo OK`
Expected: `OK`

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js 15 + Tailwind v4 + shadcn

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Brand token layer + contrast verification

**Files:**
- Modify: `app/globals.css` (replace shadcn default `:root` vars + `@theme inline`)
- Create: `scripts/check-contrast.mjs` (build-time AA verification)
- Create: `package.json` script `"check:contrast"`

**Interfaces:**
- Produces: semantic CSS variables — `--background --foreground --card --popover --primary --primary-foreground --secondary --secondary-foreground --muted --muted-foreground --accent --accent-foreground --destructive --destructive-foreground --border --input --ring --radius` plus extras `--success --success-foreground --warning --warning-foreground --info --info-foreground` and `*-bg` light fills; `@theme inline` maps each to a Tailwind `--color-*` utility. Values per spec §3.

- [ ] **Step 1: Write the contrast-check script (the failing test)**

Create `scripts/check-contrast.mjs`:
```js
import { wcagContrast, parse } from "culori";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
// Extract :root { ... } (first occurrence = light theme)
const root = css.match(/:root\s*{([^}]*)}/s)?.[1] ?? "";
const vars = {};
for (const m of root.matchAll(/--([\w-]+):\s*([^;]+);/g)) vars[m[1]] = m[2].trim();

// pairs: [foreground token, background token, min ratio, label]
const PAIRS = [
  ["foreground", "background", 4.5, "body text"],
  ["primary-foreground", "primary", 4.5, "primary button"],
  ["secondary-foreground", "secondary", 4.5, "secondary button"],
  ["muted-foreground", "muted", 4.5, "muted text"],
  ["accent-foreground", "accent", 4.5, "accent"],
  ["destructive-foreground", "destructive", 4.5, "destructive button"],
  ["success-foreground", "success", 4.5, "success"],
  ["warning-foreground", "warning", 4.5, "warning"],
  ["info-foreground", "info", 4.5, "info"],
];
let failed = false;
for (const [fg, bg, min, label] of PAIRS) {
  if (!vars[fg] || !vars[bg]) { console.error(`MISSING token for ${label}: --${fg}/--${bg}`); failed = true; continue; }
  const ratio = wcagContrast(parse(vars[fg]), parse(vars[bg]));
  const ok = ratio >= min;
  console.log(`${ok ? "PASS" : "FAIL"} ${label}: ${ratio.toFixed(2)} (min ${min})`);
  if (!ok) failed = true;
}
process.exit(failed ? 1 : 0);
```

- [ ] **Step 2: Install culori and add the npm script, run to verify it FAILS**

```bash
npm install -D culori
npm pkg set scripts.check:contrast="node scripts/check-contrast.mjs"
npm run check:contrast
```
Expected: FAIL — default shadcn tokens lack `--success`/`--warning`/`--info`, so the script reports MISSING and exits non-zero.

- [ ] **Step 3: Write the brand token layer**

Replace the `:root` block and `@theme inline` block in `app/globals.css` with (keep the existing `@import "tailwindcss";`, `@import "tw-animate-css";`, and `@custom-variant dark (&:is(.dark *));` lines at the top):
```css
:root {
  --radius: 0.75rem;

  --background: oklch(0.994 0.003 325);
  --foreground: oklch(0.22 0.005 300);
  --card: oklch(0.994 0.003 325);
  --card-foreground: oklch(0.22 0.005 300);
  --popover: oklch(0.994 0.003 325);
  --popover-foreground: oklch(0.22 0.005 300);

  --primary: oklch(0.508 0.234 288.5);
  --primary-foreground: oklch(0.99 0.005 320);

  --secondary: oklch(0.967 0.006 300);
  --secondary-foreground: oklch(0.405 0.030 300);

  --muted: oklch(0.967 0.006 300);
  --muted-foreground: oklch(0.575 0.030 300);

  --accent: oklch(0.943 0.030 288.5);
  --accent-foreground: oklch(0.445 0.215 288.5);

  --destructive: oklch(0.58 0.20 18);
  --destructive-foreground: oklch(0.99 0 0);

  --success: oklch(0.62 0.14 155);
  --success-foreground: oklch(0.99 0 0);
  --warning: oklch(0.75 0.15 75);
  --warning-foreground: oklch(0.24 0.04 75);
  --info: oklch(0.60 0.16 260);
  --info-foreground: oklch(0.99 0 0);

  --success-bg: oklch(0.96 0.03 155);
  --warning-bg: oklch(0.96 0.04 75);
  --info-bg: oklch(0.96 0.03 260);
  --destructive-bg: oklch(0.96 0.03 18);

  --border: oklch(0.928 0.010 300);
  --input: oklch(0.928 0.010 300);
  --ring: oklch(0.508 0.234 288.5);

  --chart-1: oklch(0.508 0.234 288.5);
  --chart-2: oklch(0.60 0.16 260);
  --chart-3: oklch(0.62 0.14 155);
  --chart-4: oklch(0.75 0.15 75);
  --chart-5: oklch(0.823 0.105 288.5);
}

/* Dark-ready: authored later. Structure only — components reference semantic
   tokens, so adding values here requires no component changes.
.dark {
  --background: ...;
}
*/

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
  --color-info: var(--info);
  --color-info-foreground: var(--info-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --font-sans: var(--font-inter), system-ui, sans-serif;
  --font-display: var(--font-neue-haas), var(--font-inter), system-ui, sans-serif;
}
```

- [ ] **Step 4: Run the contrast check, verify it PASSES**

Run: `npm run check:contrast`
Expected: all `PASS`, exit 0. If any pair FAILs, nudge that token's lightness (foreground toward `0.99`/`0.22`, or darken the base) and re-run until green. Record final values.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: brand OKLCH token layer with AA contrast verification

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Typography & font wiring

**Files:**
- Modify: `app/layout.tsx` (load Inter via `next/font/google`; set `--font-inter`; document Neue Haas drop-in)
- Modify: `app/globals.css` (base typography: body font/line-height, heading defaults)
- Create: `app/fonts/README.md` (where to drop Neue Haas `.woff2`)

**Interfaces:**
- Consumes: `--font-sans` / `--font-display` from Task 2's `@theme inline`.
- Produces: `--font-inter` CSS var on `<html>`; base body uses `font-sans`, line-height 1.6; headings use `font-display`.

- [ ] **Step 1: Wire Inter and the Neue Haas drop-in seam in `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Neue Haas drop-in: when licensed .woff2 files exist in app/fonts/, uncomment:
// import localFont from "next/font/local";
// const neueHaas = localFont({
//   variable: "--font-neue-haas",
//   src: [
//     { path: "./fonts/NeueHaasGroteskDisplay-Medium.woff2", weight: "600" },
//     { path: "./fonts/NeueHaasGroteskDisplay-Bold.woff2", weight: "700" },
//   ],
// });
// ...then add `neueHaas.variable` to the className below.

export const metadata: Metadata = {
  title: "CourtChat Design System",
  description: "shadcn-based design system for unBail / CourtChat",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-background text-foreground">{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Add base typography to `app/globals.css`**

Append after the `@theme inline` block:
```css
@layer base {
  * { @apply border-border; }
  body { line-height: 1.6; }
  h1, h2, h3, h4 { font-family: var(--font-display); line-height: 1.15; letter-spacing: -0.011em; font-weight: 600; }
  .prose-readable { max-width: 65ch; }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  }
}
```

- [ ] **Step 3: Document the font drop-in**

Create `app/fonts/README.md`:
```md
# Fonts

Inter loads automatically (Google Fonts via next/font). No action needed.

## Neue Haas Grotesk Display (drop-in)
1. Add licensed files here: `NeueHaasGroteskDisplay-Medium.woff2` (600), `NeueHaasGroteskDisplay-Bold.woff2` (700).
2. Uncomment the `localFont` block in `app/layout.tsx` and add `neueHaas.variable` to `<html className>`.
Headings switch from Inter to Neue Haas automatically via `--font-display`.
```

- [ ] **Step 4: Verify it builds and renders**

Run: `npm run dev` then `curl -s http://localhost:3000 | grep -q "__variable_" && echo OK` (Next injects the font variable class). Expected: `OK`. Stop the server.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: typography — Inter live, Neue Haas drop-in seam

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Button (soft-shell, brand variants)

**Files:**
- Create: `components/ui/button.tsx` (add via shadcn, then customize)
- Create: `app/(test)/button-check/page.tsx` (temporary render smoke test, removed in Task 8)

**Interfaces:**
- Produces: `Button` component + `buttonVariants({ variant, size })`. Variants: `default secondary outline ghost link destructive`; sizes: `sm default lg icon`. 12px radius, 500-weight label, `--ring` focus.

- [ ] **Step 1: Add the stock shadcn button**

```bash
npx shadcn@latest add button -y
```

- [ ] **Step 2: Customize `components/ui/button.tsx` variants**

Replace the `buttonVariants` cva definition with (keep the imports and the `Button` component body shadcn generated):
```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        sm: "h-9 rounded-md px-3",
        default: "h-10 px-4 py-2",
        lg: "h-11 rounded-lg px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);
```

- [ ] **Step 3: Write a render smoke test**

Create `app/(test)/button-check/page.tsx`:
```tsx
import { Button } from "@/components/ui/button";
export default function Page() {
  return (
    <div className="flex flex-wrap gap-3 p-8">
      {(["default","secondary","outline","ghost","link","destructive"] as const).map(v => (
        <Button key={v} variant={v}>{v}</Button>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Verify it renders the variants**

Run: `npm run dev` then `curl -s http://localhost:3000/button-check | grep -c "destructive"`. Expected: ≥ 1 (button renders). Stop the server.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: Button with brand variants and soft-shell shape

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Form controls (Input, Textarea, Label, Select)

**Files:**
- Create: `components/ui/input.tsx`, `components/ui/textarea.tsx`, `components/ui/label.tsx`, `components/ui/select.tsx` (add via shadcn, then customize Input/Textarea height/radius/ring)

**Interfaces:**
- Consumes: token layer (`--input`, `--ring`, `--background`).
- Produces: `Input`, `Textarea`, `Label`, `Select` (+ `SelectTrigger/Content/Item/Value`). Inputs `h-10`, 12px radius (`rounded-lg`), purple focus ring. Accepts `aria-invalid` → error border.

- [ ] **Step 1: Add stock components**

```bash
npx shadcn@latest add input textarea label select -y
```

- [ ] **Step 2: Customize `components/ui/input.tsx` className**

Replace the `className` string in the `Input` component with:
```tsx
"flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-base md:text-sm ring-offset-background transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive"
```

- [ ] **Step 3: Apply the same focus/error treatment to `components/ui/textarea.tsx`**

Replace the `className` string in `Textarea` with:
```tsx
"flex min-h-20 w-full rounded-lg border border-input bg-background px-3 py-2 text-base md:text-sm ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive"
```

- [ ] **Step 4: Verify all four typecheck**

Run: `npx tsc --noEmit`
Expected: no errors referencing `components/ui/input.tsx`, `textarea.tsx`, `label.tsx`, `select.tsx`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: form controls with purple focus ring and error states

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Presentational components (Card, Badge, Alert)

**Files:**
- Create: `components/ui/card.tsx`, `components/ui/badge.tsx`, `components/ui/alert.tsx` (add via shadcn, customize Badge tints + Alert semantic tones)

**Interfaces:**
- Produces: `Card` (+ `CardHeader/Title/Description/Content/Footer`), `Badge` + `badgeVariants`, `Alert` (+ `AlertTitle/AlertDescription`) + `alertVariants`. Badge variants `default secondary success warning info destructive` (tint bg). Alert variants `default info success warning destructive`.

- [ ] **Step 1: Add stock components**

```bash
npx shadcn@latest add card badge alert -y
```

- [ ] **Step 2: Customize `components/ui/badge.tsx` variants**

Replace `badgeVariants` cva variants with:
```tsx
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-accent text-accent-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        success: "border-transparent bg-[var(--success-bg)] text-[var(--success)]",
        warning: "border-transparent bg-[var(--warning-bg)] text-[var(--warning-foreground)]",
        info: "border-transparent bg-[var(--info-bg)] text-[var(--info)]",
        destructive: "border-transparent bg-[var(--destructive-bg)] text-destructive",
      },
    },
    defaultVariants: { variant: "default" },
  }
);
```

- [ ] **Step 3: Customize `components/ui/alert.tsx` semantic tones**

Replace `alertVariants` cva with:
```tsx
const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-3px] [&:has(svg)]:pl-11 [&>svg]:size-4",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground border-border",
        info: "border-transparent bg-[var(--info-bg)] text-[var(--info)] [&>svg]:text-[var(--info)]",
        success: "border-transparent bg-[var(--success-bg)] text-[var(--success)] [&>svg]:text-[var(--success)]",
        warning: "border-transparent bg-[var(--warning-bg)] text-[var(--warning-foreground)] [&>svg]:text-[var(--warning-foreground)]",
        destructive: "border-transparent bg-[var(--destructive-bg)] text-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: { variant: "default" },
  }
);
```

- [ ] **Step 4: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: no errors in `card.tsx`, `badge.tsx`, `alert.tsx`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: Card, Badge, Alert with semantic harmonized tones

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Table (compact-core)

**Files:**
- Create: `components/ui/table.tsx` (add via shadcn, customize header tint + compact density)

**Interfaces:**
- Produces: `Table` (+ `TableHeader/Body/Row/Head/Cell/Caption`). Tinted header (`bg-muted`), hover row highlight, compact-core padding (`py-2`).

- [ ] **Step 1: Add stock table**

```bash
npx shadcn@latest add table -y
```

- [ ] **Step 2: Apply compact-core treatment**

In `components/ui/table.tsx`: set `TableHeader` row to `bg-muted`; set `TableHead` className to `h-10 px-3 text-left align-middle font-medium text-muted-foreground`; set `TableCell` className to `px-3 py-2 align-middle`; ensure `TableRow` has `border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-accent`.

- [ ] **Step 3: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: no errors in `table.tsx`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: Table with compact-core density and tinted header

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: Showcase page (living documentation)

**Files:**
- Modify: `app/page.tsx` (replace default with full component showcase)
- Delete: `app/(test)/button-check/page.tsx` (temporary smoke test from Task 4)
- Add Tier-2 components used in showcase: `npx shadcn@latest add tabs dialog tooltip checkbox` (themed-but-standard; inherit tokens)

**Interfaces:**
- Consumes: every Tier-1 component (Button, Input, Textarea, Label, Select, Card, Badge, Alert, Table) and representative Tier-2 (Tabs, Dialog, Tooltip, Checkbox).
- Produces: a single-page showcase grouped by section (Colors, Typography, Buttons, Forms, Feedback, Data, Overlays) that renders the whole system.

- [ ] **Step 1: Add representative Tier-2 components**

```bash
npx shadcn@latest add tabs dialog tooltip checkbox -y
```

- [ ] **Step 2: Remove the temporary smoke test**

```bash
rm -rf "app/(test)"
```

- [ ] **Step 3: Write `app/page.tsx`**

Replace the file with a showcase that imports all components and renders, in `<section>` blocks with headings: (a) **Colors** — swatch divs for `bg-primary/secondary/muted/accent/success/warning/info/destructive` with labels; (b) **Typography** — h1–h4 + body + small + `.prose-readable` sample; (c) **Buttons** — all variants × sizes, plus disabled and icon; (d) **Forms** — Label+Input, Input with `aria-invalid`, Textarea, Select, Checkbox; (e) **Feedback** — all Badge variants, all Alert variants with a lucide icon; (f) **Data** — a 3-row Table; (g) **Overlays** — Tabs, a Dialog trigger, a Tooltip. Wrap content in `<main className="mx-auto max-w-5xl p-8 space-y-12">`.

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Info } from "lucide-react";

export default function Page() {
  const swatches = ["primary","secondary","muted","accent","success","warning","info","destructive"];
  return (
    <main className="mx-auto max-w-5xl p-8 space-y-12">
      <header><h1 className="text-4xl">CourtChat Design System</h1>
        <p className="text-muted-foreground prose-readable">Purple brand · calm + human · soft shell, compact core.</p></header>

      <section className="space-y-3"><h2 className="text-2xl">Colors</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {swatches.map(s => (
            <div key={s} className={`bg-${s} rounded-lg h-16 flex items-end p-2`}>
              <span className="text-xs bg-background/80 rounded px-1">{s}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-2"><h2 className="text-2xl">Typography</h2>
        <h1 className="text-4xl">Heading 1</h1><h2 className="text-2xl">Heading 2</h2>
        <h3 className="text-xl">Heading 3</h3>
        <p className="prose-readable">Body copy at the 16px reading floor with line-height 1.6 for low reading effort.</p>
        <p className="text-sm text-muted-foreground">Small / metadata text.</p>
      </section>

      <section className="space-y-3"><h2 className="text-2xl">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          {(["default","secondary","outline","ghost","link","destructive"] as const).map(v =>
            <Button key={v} variant={v}>{v}</Button>)}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">sm</Button><Button>default</Button><Button size="lg">lg</Button>
          <Button disabled>disabled</Button>
        </div>
      </section>

      <section className="space-y-4 max-w-md"><h2 className="text-2xl">Forms</h2>
        <div className="space-y-1"><Label htmlFor="n">Name</Label><Input id="n" placeholder="Enrique" /></div>
        <div className="space-y-1"><Label htmlFor="e">Email (error)</Label>
          <Input id="e" aria-invalid defaultValue="bad@" /></div>
        <Textarea placeholder="Message" />
        <Select><SelectTrigger><SelectValue placeholder="Court" /></SelectTrigger>
          <SelectContent><SelectItem value="a">Cuyahoga</SelectItem><SelectItem value="b">Garfield Heights</SelectItem></SelectContent>
        </Select>
        <div className="flex items-center gap-2"><Checkbox id="c" /><Label htmlFor="c">Send me reminders</Label></div>
      </section>

      <section className="space-y-3"><h2 className="text-2xl">Feedback</h2>
        <div className="flex flex-wrap gap-2">
          {(["default","secondary","success","warning","info","destructive"] as const).map(v =>
            <Badge key={v} variant={v}>{v}</Badge>)}
        </div>
        {(["info","success","warning","destructive"] as const).map(v =>
          <Alert key={v} variant={v}><Info /><AlertTitle>{v}</AlertTitle>
            <AlertDescription>Harmonized semantic tone.</AlertDescription></Alert>)}
      </section>

      <section className="space-y-3"><h2 className="text-2xl">Data</h2>
        <Card><CardHeader><CardTitle>Cases</CardTitle><CardDescription>Compact-core table</CardDescription></CardHeader>
          <CardContent>
            <Table><TableHeader><TableRow><TableHead>Case</TableHead><TableHead>Next date</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>
                <TableRow><TableCell>CR-1024</TableCell><TableCell>Jul 12</TableCell><TableCell><Badge variant="success">on track</Badge></TableCell></TableRow>
                <TableRow><TableCell>CR-1099</TableCell><TableCell>Jul 18</TableCell><TableCell><Badge variant="warning">upcoming</Badge></TableCell></TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
```

- [ ] **Step 4: Verify build + render**

Run: `npm run build` then `npm run dev` and `curl -s http://localhost:3000 | grep -q "CourtChat Design System" && echo OK`. Expected: build succeeds, `OK`. Stop the server.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: showcase page as living documentation

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: Custom shadcn registry (manifest + build + verify)

**Files:**
- Create: `registry.json`
- Create: `registry/new-york/theme/globals.css` (the token layer extracted as a registry item)
- Modify: `package.json` (add `"registry:build": "shadcn build"`)
- Produces (built): `public/r/theme.json`, `public/r/<component>.json`

**Interfaces:**
- Produces: a buildable registry where `theme` is a `registry:style` item carrying the CSS vars, and each component is a `registry:ui` item declaring `registryDependencies: ["theme"]` so consumers get the brand foundation automatically.

- [ ] **Step 1: Extract the theme registry item**

Create `registry/new-york/theme/globals.css` containing **only** the `:root {…}`, the commented `.dark` stub, and the `@theme inline {…}` block from `app/globals.css` (the brand tokens — not the `@import` lines). This is the file the `theme` registry item ships.

- [ ] **Step 2: Write `registry.json`**

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "courtchat",
  "homepage": "https://courtchat-design-system.vercel.app",
  "items": [
    {
      "name": "theme",
      "type": "registry:style",
      "title": "CourtChat brand theme",
      "description": "Purple OKLCH token layer + @theme mapping.",
      "files": [{ "path": "registry/new-york/theme/globals.css", "type": "registry:file", "target": "app/globals.css" }]
    },
    { "name": "button", "type": "registry:ui", "registryDependencies": ["theme"], "files": [{ "path": "components/ui/button.tsx", "type": "registry:ui" }] },
    { "name": "input", "type": "registry:ui", "registryDependencies": ["theme"], "files": [{ "path": "components/ui/input.tsx", "type": "registry:ui" }] },
    { "name": "textarea", "type": "registry:ui", "registryDependencies": ["theme"], "files": [{ "path": "components/ui/textarea.tsx", "type": "registry:ui" }] },
    { "name": "label", "type": "registry:ui", "registryDependencies": ["theme"], "files": [{ "path": "components/ui/label.tsx", "type": "registry:ui" }] },
    { "name": "select", "type": "registry:ui", "registryDependencies": ["theme"], "files": [{ "path": "components/ui/select.tsx", "type": "registry:ui" }] },
    { "name": "card", "type": "registry:ui", "registryDependencies": ["theme"], "files": [{ "path": "components/ui/card.tsx", "type": "registry:ui" }] },
    { "name": "badge", "type": "registry:ui", "registryDependencies": ["theme"], "files": [{ "path": "components/ui/badge.tsx", "type": "registry:ui" }] },
    { "name": "alert", "type": "registry:ui", "registryDependencies": ["theme"], "files": [{ "path": "components/ui/alert.tsx", "type": "registry:ui" }] },
    { "name": "table", "type": "registry:ui", "registryDependencies": ["theme"], "files": [{ "path": "components/ui/table.tsx", "type": "registry:ui" }] }
  ]
}
```

- [ ] **Step 3: Add the build script and run it**

```bash
npm pkg set scripts.registry:build="shadcn build"
npx shadcn build
```
Expected: writes `public/r/theme.json`, `public/r/button.json`, etc.

- [ ] **Step 4: Verify the built registry files exist and are valid JSON**

Run: `ls public/r/*.json | wc -l` (expect ≥ 10) and `node -e "JSON.parse(require('fs').readFileSync('public/r/button.json','utf8')); console.log('valid')"`.
Expected: count ≥ 10, `valid`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: custom shadcn registry — manifest, theme item, build output

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 10: README (usage + cross-repo consumption)

**Files:**
- Create: `README.md`

**Interfaces:**
- Produces: documentation covering run, token reference, theming-per-surface pattern, do/don'ts, and the cross-repo `npx shadcn add` consume flow.

- [ ] **Step 1: Write `README.md`**

Cover, in order: (1) **What this is** — one-paragraph summary; (2) **Run locally** — `npm install && npm run dev`; (3) **Foundations** — link the spec, list the semantic tokens and the radius/shadow/motion rules; (4) **Components** — Tier 1 list (customized) + Tier 2 (inherit tokens); (5) **Consume in another repo:**
```md
## Use in another repo
In a repo that already has shadcn + Tailwind v4:

    npx shadcn@latest add https://<registry-url>/r/theme.json   # brand tokens
    npx shadcn@latest add https://<registry-url>/r/button.json  # any component (pulls theme automatically)

You receive the source — own it and customize per surface. Re-run `add` to re-pull updated source. No runtime dependency.
```
(6) **Theming per surface** — copy `:root` vars into a surface-scoped class/`data-surface` and adjust how boldly `--primary` is used; (7) **Do / Don't** — Do: reference semantic tokens, keep 16px reading floor, run `npm run check:contrast` after token edits. Don't: hardcode hex, use light font weights, use color-only error states; (8) **Accessibility** — restate the AA/contrast/reduced-motion guarantees; (9) **Neue Haas drop-in** — point to `app/fonts/README.md`.

- [ ] **Step 2: Verify the contrast gate still passes (doc references it)**

Run: `npm run check:contrast`
Expected: all PASS, exit 0.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "docs: README — usage, cross-repo consumption, theming, a11y

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Self-Review

**Spec coverage:**
- §2 foundational decisions → Tasks 1–9 (stack, tokens, type, shape, modes, registry). ✓
- §3 color system (ramps, semantic states, token map, dark-readiness) → Task 2 + commented `.dark` stub. ✓
- §4 typography → Task 3. ✓
- §5 shape/spacing/elevation/motion → radius tokens (Task 2), reduced-motion (Task 3), component shapes (Tasks 4–7). ✓
- §6 components (Tier 1 built / Tier 2 documented) → Tasks 4–8. ✓
- §7 deliverable structure + registry distribution → Tasks 1, 8, 9. ✓
- §8 accessibility → contrast script (Task 2), focus rings (Tasks 4–5), reduced-motion (Task 3), non-color error states (Task 5/6), README restate (Task 10). ✓
- §9 open items → Next.js host (Task 1), OKLCH tuning (Task 2 step 4), Neue Haas drop-in (Task 3), registry URL (Task 9/10). ✓

**Placeholder scan:** No TBD/TODO; every code step shows real code; contrast tuning has an explicit pass/fail gate rather than "handle appropriately." ✓

**Type consistency:** Component/variant names consistent across tasks and showcase (e.g. Badge/Alert variant sets match between Task 6 definitions and Task 8 usage; registry item names in Task 9 match `components/ui/*.tsx` filenames). ✓

**Deviation from spec noted:** Spec §7 listed `tailwind.config.ts`; Tailwind v4 is CSS-first so config lives in `globals.css` `@theme inline` and no `tailwind.config.ts` is created. Documented in Global Constraints.
