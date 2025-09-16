// Import necessary functions and components from vitest, testing-library, and next-auth
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AgentLeePage from './page'
import { SessionProvider } from 'next-auth/react'

// Group tests for the AgentLeePage component
describe('AgentLeePage', () => {
  // Test case: Check if the main heading is rendered
  it('should render the main heading', () => {
    // Render the component within a SessionProvider
    render(
      <SessionProvider session={{ expires: '1', user: { email: 'a', name: 'a', image: 'a' } }}>
        <AgentLeePage />
      </SessionProvider>
    )
    // Find the heading element by its role and name
    const heading = screen.getByRole('heading', { name: /Agent Lee/i, level: 2 })
    // Assert that the heading is in the document
    expect(heading).toBeInTheDocument()
  })
})