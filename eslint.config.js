import js from '@eslint/js'
import nextConfig from 'eslint-config-next'

export default [
  js.configs.recommended,
  ...nextConfig,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/ban-ts-comment': 'off',
      'react/no-unescaped-entities': 'error',
      'jsx-a11y/alt-text': 'warn',
      '@next/next/no-img-element': 'warn',
      'react-hooks/exhaustive-deps': 'warn'
    },
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'build/**',
      'dist/**'
    ]
  }
]