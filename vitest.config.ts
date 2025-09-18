import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    projects: [
      {
        name: 'navada-robotics',
        root: './',
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
          'app/**/*.test.tsx',
          '**/*.e2e.{test,spec}.{js,ts,jsx,tsx}',
          '**/*.playwright.{test,spec}.{js,ts,jsx,tsx}'
        ],
        testTimeout: 30000,
        hookTimeout: 30000
      }
    ],
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
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@/components': path.resolve(__dirname, './components'),
      '@/lib': path.resolve(__dirname, './lib'),
      '@/app': path.resolve(__dirname, './app'),
      '@/styles': path.resolve(__dirname, './styles'),
      '@/hooks': path.resolve(__dirname, './hooks'),
      '@/types': path.resolve(__dirname, './types')
    }
  }
})