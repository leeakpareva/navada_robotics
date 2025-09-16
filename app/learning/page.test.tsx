
// Import necessary functions and components from vitest, testing-library, and next-auth
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import LearningPage from './page'
import { SessionProvider } from 'next-auth/react'

// Group tests for the LearningPage component
describe('LearningPage', () => {
  // Test case: Check if the main heading is rendered
  it('should render the main heading', () => {
    // Render the component within a SessionProvider to handle the useSession hook
    render(
      <SessionProvider>
        <LearningPage />
      </SessionProvider>
    )
    // Find the heading element by its role and name
    const heading = screen.getByRole('heading', { name: /NAVADA Learning Management System/i, level: 2 })
    // Assert that the heading is in the document
    expect(heading).toBeInTheDocument()
  }, 20000)
})
