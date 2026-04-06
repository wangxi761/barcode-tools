# AGENTS.md

## Project Overview

This repository is a mobile-first barcode tools application built with React and Vite.
The current primary workflow is `Barcode Matcher`, which is a two-step flow:

1. Prepare a batch of barcodes by manual input or file upload
2. Scan or manually enter codes and match them against that prepared batch

The final deploy target is static hosting behind Nginx. Production output is generated into `dist/`.

## Tech Stack

- React 19
- Vite 8
- Plain CSS in `src/styles.css`
- Hash-based routing in `src/App.jsx`
- Browser `localStorage` for temporary batch persistence

Use Node `20.19+` or a newer current version. The project has already been verified on Node `24.x`.

## Important Commands

- Install deps: `npm install`
- Start dev server: `npm run dev`
- Build production output: `npm run build`
- Preview build: `npm run preview`

## Source Of Truth

Only treat these as editable source files:

- `src/`
- `index.html`
- `manifest.webmanifest`
- `assets/favicon.svg`
- `README.md`
- `AGENTS.md`

Do not manually edit generated or dependency directories:

- `dist/`
- `node_modules/`

The `stitch/` directory is reference material only. It contains design prototypes and should not be treated as runtime app code.

## Current App Structure

- `src/main.jsx`
  React entry point
- `src/App.jsx`
  App shell and hash-route switching
- `src/pages/HomePage.jsx`
  Toolbox home screen
- `src/pages/MatcherSetupPage.jsx`
  Barcode Matcher setup flow
- `src/pages/MatcherScanPage.jsx`
  Barcode Matcher scanning/matching flow
- `src/components/AppHeader.jsx`
  Shared top header variants
- `src/components/BottomNav.jsx`
  Shared bottom navigation
- `src/data/tools.js`
  Home page tool registry
- `src/features/barcode-matcher/store.js`
  Barcode normalization, parsing, and localStorage persistence
- `src/styles.css`
  Shared visual system and page styles

## Routing Rules

Routing is hash-based and currently handled manually in `src/App.jsx`.

Current routes:

- `#/`
- `#/tools/barcode-matcher`
- `#/tools/barcode-matcher/scan`

If you add a new page or tool:

1. Add a page component under `src/pages/`
2. Register the route in `src/App.jsx`
3. Add or update the tool entry in `src/data/tools.js`

## Barcode Matcher Rules

The current feature intent is:

- Setup page accepts multiple barcodes via manual input or uploaded `.txt` / `.csv`
- Input is normalized to uppercase
- Duplicate entries are removed during parsing
- Batch data is persisted in `localStorage`
- Scan page marks matching items as success and colors them green in the list
- Unknown scans show `No Match`

The current storage key is:

- `barcode-matcher-batch`

If changing parsing behavior, preserve these expectations unless explicitly asked to change them:

- Split on newline, comma, semicolon, or tab
- Trim whitespace
- Normalize to uppercase
- Remove empty values
- Remove duplicates while preserving first-seen order

## UI And Styling Rules

The visual direction is based on the references in `stitch/`, especially the minimal grid and matcher flow prototypes.

Keep these principles:

- Mobile-first layout
- Minimal, high-contrast utility styling
- Shallow information density
- Large tap targets
- Consistent toolbar and bottom-nav behavior

For styling changes:

- Prefer editing `src/styles.css`
- Reuse existing class names and spacing patterns before introducing new variants
- Avoid adding a component library unless explicitly requested

## File And Feature Conventions

- Keep feature-specific logic near the feature
- Shared data helpers go under `src/features/<feature>/`
- Shared UI belongs in `src/components/`
- Page-level orchestration belongs in `src/pages/`
- Global app structure belongs in `src/App.jsx`

If a future tool becomes non-trivial, prefer this structure:

- `src/features/<tool-name>/`
- `src/pages/<ToolName>Page.jsx`

## Safe Change Boundaries

Safe to change:

- React components in `src/`
- CSS in `src/styles.css`
- Manifest metadata
- Tool registry in `src/data/tools.js`

Be careful when changing:

- Route strings in `src/App.jsx`
- `localStorage` schema in `src/features/barcode-matcher/store.js`
- Build config in `vite.config.js`

If changing the storage schema, add a backward-compatible fallback when possible.

## Verification Expectations

After meaningful UI or logic changes, do at least this:

1. Run `npm run build`
2. Confirm the intended route still renders
3. For Barcode Matcher, verify:
   - manual input creates preview items
   - file upload creates preview items
   - Start Scanning navigates correctly
   - matching an existing code marks the correct row green
   - unknown code shows `No Match`

## Notes For Future Agents

- Do not reintroduce the old plain HTML multi-page structure unless explicitly requested
- Do not edit `dist/` directly
- Do not assume server-side routing exists; this app intentionally uses hash routing for Nginx-safe static hosting
- Prefer incremental refactors over large architecture swaps unless the user asks for one
