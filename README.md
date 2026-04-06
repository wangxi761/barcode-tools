# Barcode Toolkit

Barcode Toolkit is a mobile-first React app for barcode-related tools.
It uses Vite for development and build output, and the production `dist/` directory can be
served directly by Nginx as static files.

The current visual scaffold follows the reference outputs under `stitch/`, especially the
minimal home grid and scan screen prototypes.

## Structure

- `index.html`: Vite HTML entry
- `src/main.jsx`: React bootstrap
- `src/App.jsx`: app shell and hash-route switching
- `src/pages/`: page-level React components
- `src/components/`: shared UI components
- `src/features/barcode-matcher/store.js`: local batch storage and barcode helpers
- `src/styles.css`: shared visual system and responsive layout

## Run locally

1. Run `npm install`
2. Run `npm run dev`

## Deploy with Nginx

1. Run `npm run build`
2. Deploy the generated `dist/` directory to your Nginx web root

The app uses hash routing, so no extra Nginx rewrite rules are required for the current pages.

## Next suggested steps

1. Connect the matcher scan page to a real decoding engine.
2. Add a second React tool page under `src/pages/`.
3. Extend the shared tool registry so the home page grows automatically.
