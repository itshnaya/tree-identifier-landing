// Base-aware paths: works at the domain root (production) and in a sub-folder
// (GitHub Pages preview: /tree-identifier-landing/). Set with SITE_BASE at build time.
export function withBase(path) {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  return base + (path.startsWith('/') ? path : `/${path}`);
}
