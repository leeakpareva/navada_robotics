// Import necessary functions from vitest and testing-library
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
// Import the component to be tested
import MCPDashboardPage from './page'

// Group tests for the MCPDashboardPage component
describe('MCPDashboardPage', () => {
  // Test case: Check if the main heading is rendered
  it('should render the main heading', () => {
    // Render the component
    render(<MCPDashboardPage />)
    // Find the heading element by its role and name
    const heading = screen.getByRole('heading', { name: /MCP Server Dashboard/i, level: 2 })
    // Assert that the heading is in the document
    expect(heading).toBeInTheDocument()
  })
})