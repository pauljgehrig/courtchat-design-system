# Fonts

Inter loads automatically (Google Fonts via next/font). No action needed.

## Neue Haas Grotesk Display (drop-in)

Two variants are needed — Display for headings, Text for body:

### Headings (`--font-neue-haas`)
1. Add `NeueHaasGroteskDisplay-Medium.woff2` (weight 600) and `NeueHaasGroteskDisplay-Bold.woff2` (weight 700).
2. Uncomment the `neueHaas` localFont block in `app/layout.tsx` and add `neueHaas.variable` to `<html className>`.
Headings switch from Inter to NHGD Display automatically via `--font-display`.

### Body text (`--font-neue-haas-text`)
1. Add `NeueHaasGroteskText-Regular.woff2` (weight 400) and `NeueHaasGroteskText-Medium.woff2` (weight 500).
2. Uncomment the `neueHaasText` localFont block in `app/layout.tsx` and add `neueHaasText.variable` to `<html className>`.
Body copy switches from Inter to NHGD Text automatically via `--font-sans`.

Both variants fall back to Inter if the `.woff2` files are absent — the CSS var fallback is hardened so an undefined `--font-neue-haas-text` resolves to Inter rather than breaking the font-family.
