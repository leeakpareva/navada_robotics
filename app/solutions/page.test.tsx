// Import necessary functions from vitest and testing-library
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
// Import the component to be tested
import SolutionsPage from './page'

// Group tests for the SolutionsPage component
describe('SolutionsPage', () => {
  // Test case: Check if the main heading is rendered
  it('should render the main heading', () => {
    // Render the component
    render(<SolutionsPage />)
    // Find the heading element by its role and name
    const heading = screen.getByRole('heading', { name: /My Research Areas/i, level: 2 })
    // Assert that the heading is in the document
    expect(heading).toBeInTheDocument()
  })
})