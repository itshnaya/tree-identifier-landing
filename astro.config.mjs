import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

if (process.env.QUIZ_PREVIEW_UNVERIFIED === '1' && process.argv.includes('build')) {
  throw new Error('QUIZ_PREVIEW_UNVERIFIED is for local preview only and is refused during build.');
}

export default defineConfig({
  build: { inlineStylesheets: 'always', format: 'directory' },
  vite: { plugins: [tailwindcss()] },
  devToolbar: { enabled: false },
});
