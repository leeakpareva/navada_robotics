// Import necessary functions from vitest and testing-library
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
// Import the component to be tested
import NewsPage from './page'

// Group tests for the NewsPage component
describe('NewsPage', () => {
  // Test case: Check if the main heading is rendered
  it('should render the main heading', async () => {
    // Render the component
    render(await NewsPage({ searchParams: { page: '1' } }))
    // Find the heading element by its role and name
    const heading = screen.getByRole('heading', { name: /Tech News Hub/i, level: 1 })
    // Assert that the heading is in the document
    expect(heading).toBeInTheDocument()
  })
})