// Import necessary functions and components
import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import AdminCoursesPage from './page'

// Mock the useSession hook
vi.mock('next-auth/react', () => ({
  useSession: () => ({
    data: { user: { email: 'leeakpareva@gmail.com' } },
    status: 'authenticated',
  }),
}));

// Group tests for the AdminCoursesPage component
describe('AdminCoursesPage', () => {
  // Test case: Check if the main heading is rendered for an admin user
  it('should render the main heading for admin', async () => {
    // Render the component with an admin session
    await act(async () => {
      render(<AdminCoursesPage />)
    })
    // Find the heading element
    const heading = screen.getByRole('heading', { name: /Course Administration/i, level: 1 })
    // Assert that the heading is in the document
    expect(heading).toBeInTheDocument()
  }, 20000)
})