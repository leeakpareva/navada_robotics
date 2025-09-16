// Import necessary functions from vitest and testing-library
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
// Import the component to be tested
import Dashboard from './page'

// Group tests for the Dashboard component
describe('Dashboard', () => {
  // Test case: Check if the main heading is rendered
  it('should render the main heading', () => {
    // Render the component
    render(<Dashboard />)
    // Find the heading element by its role and name
    const heading = screen.getByRole('heading', { name: /Dashboard/i, level: 1 })
    // Assert that the heading is in the document
    expect(heading).toBeInTheDocument()
  })
})