# Scripts Guide

This folder contains small utility scripts used during development to generate assets and data for the PokéCheck app.

## Requirements
- Node.js 18+ (for `fetch` in ESM and modern APIs)
- npm installed
- Dev dependency (already added): `favicons` for favicon generation

If you ever need to (re)install the dev dependency:

```bash
npm i -D favicons
```

---

## 1) Generate favicon.ico
File: `scripts/generate-favicon.js`

Purpose:
- Converts the SVG logo into a classic `favicon.ico` used by some browsers and platforms.

Inputs/Outputs:
- Input: `public/pokecheck-favicon.svg`
- Output: `src/app/favicon.ico`

Run:
```bash
node scripts/generate-favicon.js
```

When to use:
- Any time you update the SVG favicon or want to regenerate the ICO file.

Notes:
- The app also uses the SVG favicon directly for crisp rendering; the `.ico` is kept for legacy compatibility.

---

## 2) Create Open Graph preview template (for `og-image.png`)
File: `scripts/generate-og-image.js`

Purpose:
- Writes a styled HTML file to `public/og-preview.html` that you can screenshot at 1200×630 to create an OG image (`og-image.png`).

Run:
```bash
node scripts/generate-og-image.js
```

After running:
1. Open `public/og-preview.html` in a browser
2. Take a full-page screenshot at exactly 1200×630
3. Save as `public/og-image.png`

Optional:
- If you replace the current OG image, update references (e.g., in `src/app/layout.tsx` metadata) to point to `/og-image.png`.
- You can automate this with Puppeteer if desired.

---

## 3) Prepare Pokédex backup JSON
File: `scripts/prepare-pokedex-backup.mjs`

Purpose:
- Downloads the full Pokédex JSON from a public source, sorts it by `dexNr`, and writes a local backup used by the app as a fallback.

Run:
```bash
node scripts/prepare-pokedex-backup.mjs
```

Inputs/Outputs:
- Downloads from: `https://pokemon-go-api.github.io/pokemon-go-api/api/pokedex.json`
- Output: `public/data/pokedex.backup.json`

Notes:
- Sorting ensures predictable order and can improve compression.
- Re-run this if the upstream dataset changes or you want to refresh the backup.

---

## Troubleshooting
- If `generate-favicon.js` fails, ensure `favicons` is installed (`npm i -D favicons`).
- Use Node 18+ to run these scripts.
- If a script path changes, adjust inputs/outputs in the script or commands accordingly.

