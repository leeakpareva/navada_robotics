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

// Mock global fetch
global.fetch = vi.fn((url) =>
  Promise.resolve({
    ok: true,
    json: () => {
      if (url.includes('/api/learning/courses/')) {
        return Promise.resolve({ course: { title: 'Test Course', lessons: [] }, userProgress: {} });
      }
      return Promise.resolve({ courses: [] });
    }
  })
) as any

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn()
