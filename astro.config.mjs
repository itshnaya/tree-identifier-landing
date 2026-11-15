import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

if (process.env.QUIZ_PREVIEW_UNVERIFIED === '1' && process.argv.includes('build')) {
  throw new Error('QUIZ_PREVIEW_UNVERIFIED is for local preview only and is refused during build.');
}

// SITE_ORIGIN / SITE_BASE: only for previews hosted in a sub-folder (e.g. GitHub Pages).
export default defineConfig({
  site: process.env.SITE_ORIGIN || undefined,
  base: process.env.SITE_BASE || '/',
  build: { inlineStylesheets: 'always', format: 'directory' },
  vite: { plugins: [tailwindcss()] },
  devToolbar: { enabled: false },
});
