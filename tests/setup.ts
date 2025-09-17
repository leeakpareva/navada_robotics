import { vi } from 'vitest'
import '@testing-library/jest-dom'

// Mock environment variables
vi.mock('process', () => ({
  env: {
    OPENAI_API_KEY: 'test_openai_key',
    ANTHROPIC_API_KEY: 'test_anthropic_key',
    MISTRAL_API_KEY: 'test_mistral_key',
    BRAVE_SEARCH_API_KEY: 'test_brave_key',
    GITHUB_API_KEY: 'test_github_key',
    STRIPE_SECRET_KEY: 'sk_test_123',
    STRIPE_WEBHOOK_SECRET: 'whsec_test_123',
    DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
    NEXTAUTH_SECRET: 'test_secret',
    NEXTAUTH_URL: 'http://localhost:3000'
  }
}))

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn()
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/test'
}))

// Mock Next.js headers
vi.mock('next/headers', () => ({
  headers: () => new Map([
    ['content-type', 'application/json']
  ]),
  cookies: () => ({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn()
  })
}))

// Global fetch mock
global.fetch = vi.fn()

// Mock console methods to reduce noise in tests
console.warn = vi.fn()
console.error = vi.fn()

// Setup DOM environment
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock performance.mark
global.performance.mark = vi.fn()
global.performance.measure = vi.fn()

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks()
})