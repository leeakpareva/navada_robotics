import { vi } from 'vitest'
import '@testing-library/jest-dom/vitest'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
  usePathname: () => '',
  useParams: () => ({ courseId: '1' }),
}))

// Mock next-auth/react
vi.mock('next-auth/react', () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
  useSession: () => ({
    data: null,
    status: 'loading'
  }),
  getSession: () => Promise.resolve(null),
  signIn: vi.fn(),
  signOut: vi.fn(),
}))

// Mock Prisma Client
vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => ({
    user: {
      findMany: vi.fn(() => Promise.resolve([])),
      findUnique: vi.fn(() => Promise.resolve(null)),
      create: vi.fn(() => Promise.resolve({})),
      update: vi.fn(() => Promise.resolve({})),
      delete: vi.fn(() => Promise.resolve({})),
    },
    stripeActivity: {
      findMany: vi.fn(() => Promise.resolve([])),
      findUnique: vi.fn(() => Promise.resolve(null)),
      create: vi.fn(() => Promise.resolve({})),
      update: vi.fn(() => Promise.resolve({})),
      delete: vi.fn(() => Promise.resolve({})),
      count: vi.fn(() => Promise.resolve(0)),
    },
    $disconnect: vi.fn(() => Promise.resolve()),
    $connect: vi.fn(() => Promise.resolve()),
  })),
}))

// Mock Stripe
vi.mock('stripe', () => ({
  default: vi.fn(() => ({
    checkout: {
      sessions: {
        create: vi.fn(() => Promise.resolve({ url: 'https://checkout.stripe.com/test' })),
      },
    },
    prices: {
      list: vi.fn(() => Promise.resolve({ data: [{ id: 'price_test' }] })),
    },
  })),
}))

// Mock sonner (toast notifications)
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}))

// Mock global fetch
global.fetch = vi.fn((url) =>
  Promise.resolve({
    ok: true,
    json: () => {
      if (url.includes('/api/learning/courses/')) {
        return Promise.resolve({ course: { title: 'Test Course', lessons: [] }, userProgress: {} });
      }
      if (url.includes('/api/stripe/')) {
        return Promise.resolve({ url: 'https://checkout.stripe.com/test' });
      }
      return Promise.resolve({ courses: [], data: [] });
    }
  })
) as any

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn()

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    assign: vi.fn(),
    reload: vi.fn(),
  },
  writable: true,
})
