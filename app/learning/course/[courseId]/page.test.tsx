
// Import necessary functions and components
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CoursePage from './page'
import { SessionProvider } from 'next-auth/react'

// Group tests for the CoursePage component
describe('CoursePage', () => {
  // Test case: Check if the main heading is rendered
  it('should render the main heading', async () => {
    // Render the component with a mock session and params
    render(
      <SessionProvider session={{ user: { email: 'a', name: 'a', image: 'a' }, expires: '1' }}>
        <CoursePage params={{ courseId: '1' }} />
      </SessionProvider>
    )
    // Find the heading element
    const heading = await screen.findByRole('heading', { name: /Test Course/i, level: 1 })
    // Assert that the heading is in the document
    expect(heading).toBeInTheDocument()
  })
})
