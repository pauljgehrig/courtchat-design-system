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
  ["success", "success-bg", 4.5, "success tint text"],
  ["warning-foreground", "warning-bg", 4.5, "warning tint text"],
  ["info", "info-bg", 4.5, "info tint text"],
  ["destructive", "destructive-bg", 4.5, "destructive tint text"],
  ["body-text", "background", 4.5, "body text"],
  ["container-foreground", "container", 4.5, "on-container text"],
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
