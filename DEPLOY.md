# Deploying the registry

This repo is both the showcase app and a custom shadcn registry. Deploying it
serves the registry items at `/r/*.json` over HTTPS so other repos can install
components with `npx shadcn add`.

## Host: Vercel

Vercel is the native Next.js host. `vercel.json` sets the build command to
`npm run registry:build && next build`, so the registry JSON in `public/r/`
is **regenerated from source on every deploy** — it never drifts from the
components.

### One-time setup

1. Go to <https://vercel.com/new> and sign in with GitHub.
2. Import `pauljgehrig/courtchat-design-system`.
3. Framework preset auto-detects **Next.js**. Leave everything default —
   `vercel.json` already supplies the build command. Click **Deploy**.
4. After the first deploy you get a URL like
   `https://courtchat-design-system.vercel.app`. The registry items are then at
   `https://courtchat-design-system.vercel.app/r/<name>.json`.

### CLI alternative

From this repo:

```bash
npx vercel        # first run: log in + link the project (interactive)
npx vercel --prod # production deploy
```

### Custom domain (recommended)

The consume URL gets hard-coded into every consuming repo, so a stable domain
beats a `*.vercel.app` subdomain. In Vercel → Project → Settings → Domains, add
e.g. `design.unbail.org`. Then update `homepage` in `registry.json` and the URLs
in `README.md` / below to match, and redeploy.

### Updating

Push to `main` → Vercel auto-redeploys and rebuilds the registry. To rebuild
locally after changing a component: `npm run registry:build`.

## Consuming the registry in another repo

The consumer needs shadcn + Tailwind v4 already set up.

### Option A — direct URL

```bash
# 1. Adopt brand tokens FIRST, with --overwrite (required — see note below).
npx shadcn@latest add https://courtchat-design-system.vercel.app/r/theme.json --overwrite -y

# 2. Then add components.
npx shadcn@latest add https://courtchat-design-system.vercel.app/r/button.json -y
```

The `theme` item merges brand tokens into the consumer's `globals.css` via
`cssVars`. **You must pass `--overwrite` on the theme step.** shadcn's default
merge only *adds* tokens it doesn't already see — it will not replace a
consumer's existing `--primary`/`--background`/etc. (which `shadcn init` seeds).
Without `--overwrite` you get a half-applied brand: the additions (`--success`,
`--warning`, fonts) land, but the signature purple `--primary` never takes
effect. `--overwrite` updates the values in place and preserves the consumer's
`@import "tailwindcss"`, `.dark` block, and other content.

Components declare the theme as a `registryDependency`, but a dependency is
fetched *without* `--overwrite`, so always run the theme step (1) explicitly.

### Option B — namespace (nicer DX)

Register the namespace once in the consumer's `components.json`:

```json
{
  "registries": {
    "@courtchat": "https://courtchat-design-system.vercel.app/r/{name}.json"
  }
}
```

Then (same `--overwrite` rule applies to the theme step):

```bash
npx shadcn@latest add @courtchat/theme --overwrite -y
npx shadcn@latest add @courtchat/button -y
```

Consumers receive **source** they own and can customize. Re-running `add`
re-pulls updated source; there is no runtime npm dependency.
