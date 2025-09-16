// Import necessary functions from vitest and testing-library
import { describe, it, expect } from 'vitest'
import { render, screen, act } from '@testing-library/react'
// Import the component to be tested
import AnalyticsPage from './page'

// Group tests for the AnalyticsPage component
describe('AnalyticsPage', () => {
  // Test case: Check if the main heading is rendered
  it('should render the main heading', async () => {
    // Render the component
    await act(async () => {
      render(<AnalyticsPage />)
    })
    // Find the heading element by its role and name
    const heading = screen.getByRole('heading', { name: /Analytics Dashboard/i, level: 2 })
    // Assert that the heading is in the document
    expect(heading).toBeInTheDocument()
  })
})