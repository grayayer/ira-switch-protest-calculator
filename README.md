# IRA Switch Protest Calculator

A tax calculator that helps people understand the financial cost (or savings) of recharacterizing a Roth IRA contribution to a Traditional IRA as a form of tax protest — and puts those dollar figures in the context of what the federal government spends that money on.

---

## Running locally

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (comes with Node)

Check your versions:

```bash
node -v
npm -v
```

---

### Option 1 — Dev server (recommended for active development)

The dev server gives you **hot module replacement**: the browser updates instantly as you save changes to any file.

```bash
cd "/Users/gray/Local Sites/ira-switch-protest-calculator"
npm install        # only needed the first time, or after pulling new changes
npm run dev
```

Open your browser to: **http://localhost:5173/ira-switch-protest-calculator/**

> Note: the `/ira-switch-protest-calculator/` path prefix is required because `vite.config.ts` sets `base: '/ira-switch-protest-calculator/'` to match the GitHub Pages URL. Without it you'll get a blank page.

Stop the server with `Ctrl + C`.

---

### Option 2 — Preview the production build

This runs the same built output that GitHub Pages will serve — useful for a final check before pushing.

```bash
npm run build      # compiles TypeScript and outputs to /dist
npm run preview    # serves /dist locally
```

Open your browser to: **http://localhost:4173/ira-switch-protest-calculator/**

This is the closest approximation to what users will see on GitHub Pages. Run this any time you want to verify the build behaves the same as development.

---

## Deploying to GitHub Pages

Deployment is automated. Any push to the `main` branch triggers the GitHub Actions workflow (`.github/workflows/deploy.yml`), which:

1. Installs dependencies
2. Runs `npm run build`
3. Uploads the `/dist` folder to the `gh-pages` branch
4. GitHub Pages serves the live site from that branch

**To deploy:**

```bash
git add .
git commit -m "your message"
git push origin main
```

**To monitor the deployment:**

1. Go to: `https://github.com/grayayer/ira-switch-protest-calculator/actions`
2. Click the most recent workflow run
3. Green checkmark = live; red X = check the logs for errors

The live site will be available at:
**https://grayayer.github.io/ira-switch-protest-calculator/**

---

## Project structure

```
src/
  components/
    InputForm/          # Left panel — all user inputs
    ResultPanel/        # Right panel — calculated outputs
    SpendingComparisons/ # "Your savings equal…" context block
    TaxBracketBadge/    # Displays the user's marginal rate visually
    Tooltip/            # Reusable info tooltip
  lib/
    calculator.ts       # Core tax and projection math
    taxBrackets.ts      # 2026 federal tax brackets
    types.ts            # Shared TypeScript interfaces
  App.tsx               # Root layout
  main.tsx              # Entry point
```

---

## Quick test checklist

After making changes, run through these in the browser before pushing:

- [ ] Enter all five fields — results panel populates correctly
- [ ] "Tax savings this year" row shows a green dollar amount
- [ ] The spending comparison callout appears below it with a dynamic headline
- [ ] "See 8 more government spending comparisons" toggle opens and closes
- [ ] All source links in the expanded list open in a new tab
- [ ] Change income or contribution amount — headline updates to match
- [ ] Resize to mobile width (~375px) — layout stacks vertically, text is readable
