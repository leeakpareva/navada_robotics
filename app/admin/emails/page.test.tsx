// Import necessary functions and components
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import EmailAdminPage from './page'

// Group tests for the EmailAdminPage component
describe('EmailAdminPage', () => {
  // Test case: Check if the access page is rendered initially
  it('should render the admin access page initially', () => {
    // Render the component
    render(<EmailAdminPage />)
    // Find the heading element
    const heading = screen.getByText(/Email Admin Access/i)
    // Assert that the heading is in the document
    expect(heading).toBeInTheDocument()
  })
})