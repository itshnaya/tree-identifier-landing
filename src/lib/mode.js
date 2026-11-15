// Show [À CONFIRMER] badges and proposals only in development and previews.
// Production build (no flag) hides them until Claire confirms.
//   npm run dev                    → shown
//   npm run deploy:preview         → shown (PREVIEW_NOINDEX=1, noindex)
//   npm run build                  → hidden (production)
export const showTBC =
  Boolean(import.meta.env.DEV) || process.env.PREVIEW_NOINDEX === '1' || process.env.SHOW_TBC === '1';
