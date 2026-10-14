// SIRAJ Digital & Project Experience v1.0 — Astro configuration.
// The site consumes the frozen SIRAJ Brand System v1.0 straight from the repository (design-system/, motion-system/,
// 01-Logos/, 06-SIRAJ-Silk/, 14-Property-Marketing/…). Nothing from the brand is copied into src/; images are
// imported from their canonical paths and optimised at build time (AVIF/WebP, responsive widths).
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));

export default defineConfig({
  site: 'https://www.sirajproperties.net',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  compressHTML: true,
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
  image: { responsiveStyles: false },
  vite: {
    server: { fs: { allow: [repoRoot] } },
    build: { assetsInlineLimit: 2048 },
  },
});
