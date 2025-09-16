// Import necessary functions and components
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import LMSAdminDashboard from './page'

// Group tests for the LMSAdminDashboard component
describe('LMSAdminDashboard', () => {
  // Test case: Check if the main heading is rendered
  it('should render the main heading', () => {
    // Render the component
    render(<LMSAdminDashboard />)
    // Find the heading element
    const heading = screen.getByRole('heading', { name: /LMS Admin Dashboard/i, level: 1 })
    // Assert that the heading is in the document
    expect(heading).toBeInTheDocument()
  })
})