# unbail.org → Design System Parity Audit

**Date:** 2026-06-30
**Goal:** Map where the live unbail.org diverges from the CourtChat design system, with reconcile decisions, so all unBail sites can eventually run on the DS.
**Direction (decided):** Reconcile both ways — pull the live site's better intent into the DS where it's the stronger call; align the site elsewhere. Marketing-specific UI is added to the DS as **clearly-labeled marketing blocks**, separate from the app primitives.

## Headline

**unbail.org is already on-brand and close to parity.** It is a **Webflow** site whose `:root` CSS variables match the DS on the things that matter most:

| | DS | Live site | |
|---|---|---|---|
| Primary purple | `#6938DF` | `#6938df` | **exact match** |
| Page background | `#FFFBFF` | `#fffbff` | **exact match** |
| Heading near-black | `#1C1B1D` | `#1c1b1e` | 1 digit (negligible) |
| Heading font | Neue Haas Grotesk Display | NHGD | **match** |
| Button / card radius | 12px | 12px (`.75rem`) | **match** |

> Note: an early automated read mislabeled the site "teal." That was wrong — the actual Webflow CSS confirms `--primary: #6938df` (purple). There is no palette chasm; the gaps below are narrow and tractable.

Source: extracted from `unbail-labs.webflow.shared.*.min.css` (server-rendered, fully analyzable).

---

## 1. Token-level divergences & reconcile decisions

| # | Attribute | Live site | DS (current) | Decision | Direction |
|---|---|---|---|---|---|
| 1 | **Body font** | NHGD (`TEXT-NHGD` variant) | Inter | Body stack → `"Neue Haas Grotesk Display Text", Inter, system-ui`. NHGD when loaded, Inter fallback (same drop-in pattern as headings). | **DS adopts** |
| 2 | **Body text color** | `--body_text #48454e` (distinct, softer than headings) | single `--foreground` `#1C1B1D` for all text | Add a dedicated body-text token (~`oklch(0.42 0.012 300)` ≈ `#48454e`); keep `--foreground` for headings/high-emphasis. Contrast-gate it on `--background`. | **DS adopts** (site is better intent) |
| 3 | **Purple surface-tint scale** | `--container #e8ddff`, `--surface_5/8/11` (#6938df @ 5/8/11%), `--on_container #21005e`, `--container-lite #fdf8fd` | single `--accent` (purple-100 tint) | Add a graded purple surface scale (tint-5/8/11 + container + on-container) so tinted sections (callout chips, approach tiles, app panel) are reproducible. | **DS adopts** |
| 4 | **Secondary** | `#62597e` | `#615B71` (brand-guide value, oklch ≈ `0.485 0.035 300`) | Align DS secondary to the shipped `#62597e` (slightly more purple). Tiny shift. | **DS adopts** (low priority) |
| 5 | **Error / destructive** | `--error #ba1a1a` + `--error-container #ffdad6` + `--error-on_container #410002` (Material trio) | `--destructive oklch(0.50 0.20 18)` + `--destructive-bg` (AA-gated) | Keep the DS's AA-verified destructive (it passes the contrast gate); optionally nudge hue toward the site's `#ba1a1a`. Map site error-container/on-container → DS `--destructive-bg` / destructive text. | **Keep DS**, value-reconcile optional |
| 6 | **Heading near-black** | `#1c1b1e` | `#1C1B1D` | No action (1 digit). | n/a |
| 7 | **Button taxonomy** | "secondary" = transparent + 1px purple border (an outline) | DS `secondary` = tinted-neutral fill; DS `outline` = transparent + border | When rebuilding the site, map site **secondary → DS `outline`**. Document the mapping; no token change. | **Site adopts DS naming** |
| 8 | **Badge shape** | callout pill = `100px`/`10rem` (full pill) | DS badge = `sm` radius (8px) | Add a `pill` (rounded-full) variant to DS Badge to cover the callout chip. | **DS adds variant** |
| 9 | **Divider** | `--outline #dfdfdf`, 1px rule | DS `--border` (neutral) | Site `--outline` ≈ DS `--border`; reuse the border token. | aligned |

After token changes: **re-run `npm run check:contrast`** (extend pairs for the new body-text token on background) and **rebuild the registry** so `theme.json` ships the additions.

---

## 2. Component inventory: site → DS coverage

### Covered by existing DS primitives (app surface)
| Site element | DS component | Notes |
|---|---|---|
| CTA buttons (filled / outline / text) | `Button` (`default` / `outline` / `link`) | map "secondary"→`outline` |
| Contact / email form | `Input`, `Label`, (Textarea) | form is reCAPTCHA-gated; primitives cover the fields |
| Team / testimonial / pricing tiles | `Card` | confirm Card composes these; may need a media/avatar slot |
| Callout pill | `Badge` (+ new `pill` variant) | see token #8 |
| Line divider | `border` token / a thin `Separator` | trivial |

### Gaps — NOT in the DS yet (marketing layout)
These become **marketing blocks** in the registry — labeled distinctly from app primitives (proposed: `registry:block` items under a `marketing-` prefix, e.g. `marketing-nav`, so consumers and the showcase clearly separate "marketing layout" from "app UI primitives"):

- `marketing-nav` — sticky header: logo + nav links (4px purple underline hover) + CTA + mobile hamburger
- `marketing-hero` — 2-col headline/subtext/CTA + circular image
- `marketing-footer` — minimal centered logo + links
- `marketing-logo-grid` — partner/supporter logo row
- `marketing-testimonial-grid` — 2-col quote + circular client image
- `marketing-team-card` — image + name + title + email
- `marketing-pricing-tile` — bordered feature-checklist tile
- `marketing-quote` — left-bordered pull quote (`.text-style-quote`)
- `marketing-app-panel` — full-bleed purple panel w/ product mockup
- `marketing-approach-tile` — purple icon tile + text (uses surface-tint scale, token #3)

---

## 3. Sequenced parity roadmap

**Phase 1 — Token reconciles (cheap, high-value).** Decisions #1–#4, #8 above: NHGD body stack, body-text token, purple surface-tint scale, secondary alignment, Badge `pill` variant. Update `app/globals.css` + the `theme` registry item; extend and re-run the contrast gate; rebuild the registry. *Lowest effort, immediately tightens parity.*

**Phase 2 — Primitive parity.** Confirm `Card` composes the team/testimonial/pricing tiles (add an avatar/media slot if needed); document the button taxonomy mapping; reconcile the error trio mapping. *Small.*

**Phase 3 — Marketing blocks.** Build the `marketing-*` blocks (§2 gaps) from DS primitives + tokens, as `registry:block` items, clearly labeled. Add a "Marketing" section to the showcase. *The bulk of the work.*

**Phase 4 — Rebuild unbail.org on the DS.** Migrate the Webflow site (or a new build) onto the DS-consumed components/blocks via the registry, so the marketing site and app surfaces share one source of truth.

---

## Decisions captured
- **Body font:** NHGD body with Inter fallback (drop-in pattern). *(approved 2026-06-30)*
- **Reconcile direction:** both ways; site is the better intent for body-text color and surface tints. *(approved)*
- **Marketing components:** pulled into the DS as clearly-labeled marketing blocks, separate from app primitives. *(approved)*
