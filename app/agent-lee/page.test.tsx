// Import necessary functions and components from vitest, testing-library, and next-auth
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import AgentLeePage from './page'

// Mock next-auth to simulate loading state
vi.mock('next-auth/react', () => ({
  useSession: () => ({ status: 'loading' }),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
  signOut: vi.fn(),
}))

// Group tests for the AgentLeePage component
describe('AgentLeePage', () => {
  // Test case: Check if the loading state is rendered
  it('should render loading state', () => {
    // Render the component
    render(<AgentLeePage />)
    // Find the loading text
    const loadingText = screen.getByText(/Loading Agent Lee/i)
    // Assert that the loading text is in the document
    expect(loadingText).toBeInTheDocument()
  })
})