
// Import necessary functions and components
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import CoursePage from './page'
import { SessionProvider } from 'next-auth/react'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useParams: () => ({ courseId: '1' }),
  useRouter: () => ({ push: vi.fn() }),
}))

// Mock next-auth
vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: null }),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}))

// Group tests for the CoursePage component
describe('CoursePage', () => {
  // Test case: Check if the loading state is rendered
  it('should render loading state', () => {
    // Render the component
    render(<CoursePage params={{ courseId: '1' }} />)
    // Find the loading text
    const loadingText = screen.getByText(/Loading course content/i)
    // Assert that the loading text is in the document
    expect(loadingText).toBeInTheDocument()
  })
})
