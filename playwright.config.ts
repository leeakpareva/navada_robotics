import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:3000', // Next.js dev server
    headless: true,
  },
  reporter: [['html', { outputFolder: 'playwright-report' }]],
});