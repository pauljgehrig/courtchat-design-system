# Fonts

Inter loads automatically (Google Fonts via next/font). No action needed.

## Neue Haas Grotesk Display (drop-in)
1. Add licensed files here: `NeueHaasGroteskDisplay-Medium.woff2` (600), `NeueHaasGroteskDisplay-Bold.woff2` (700).
2. Uncomment the `localFont` block in `app/layout.tsx` and add `neueHaas.variable` to `<html className>`.
Headings switch from Inter to Neue Haas automatically via `--font-display`.
