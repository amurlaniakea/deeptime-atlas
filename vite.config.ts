// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Pedro Sordo Martínez <amurlaniakea@gmail.com>
import type { Plugin } from 'vite';
import { defineConfig } from 'vitest/config';

// Strict CSP only for the production build (dev server needs inline HMR scripts).
const csp: Plugin = {
  name: 'deeptime-csp',
  apply: 'build',
  transformIndexHtml() {
    return [
      {
        tag: 'meta',
        attrs: {
          'http-equiv': 'Content-Security-Policy',
          content:
            "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; base-uri 'none'; form-action 'none'",
        },
        injectTo: 'head-prepend',
      },
    ];
  },
};

export default defineConfig({
  base: './',
  plugins: [csp],
  build: { target: 'es2022', sourcemap: false },
  test: { environment: 'node', include: ['tests/**/*.test.ts'] },
});
