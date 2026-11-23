// Show [À CONFIRMER] badges and proposals only on Claire's computer.
// Every published build (Cloudflare, GitHub Pages) hides them until Claire confirms:
// visitors coming from TikTok must never see work-in-progress labels.
//   npm run dev                         → shown
//   SHOW_TBC=1 npm run build            → shown (local review only, never deployed)
//   npm run deploy:cloudflare / build   → hidden
export const showTBC = Boolean(import.meta.env.DEV) || process.env.SHOW_TBC === '1';
