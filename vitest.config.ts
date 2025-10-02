import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: [
      'tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'app/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
    ],
    exclude: [
      'node_modules/**',
      'dist/**',
      '.next/**',
      'coverage/**',
      'tests/e2e/**',
      'tests/payment/**',
      'tests/integration/**',
      'tests/api/learning.test.ts',
      'tests/api/agent-lee.test.ts',
      '**/*.e2e.{test,spec}.{js,ts,jsx,tsx}',
      '**/*.playwright.{test,spec}.{js,ts,jsx,tsx}',
      '**/*.disabled'
    ],
    testTimeout: 30000,
    hookTimeout: 30000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '*.config.*',
        '.next/',
        'coverage/'
      ]
    },
    reporters: ['default', 'html'],
    outputFile: {
      html: './test-results/index.html'
    }
  }
})