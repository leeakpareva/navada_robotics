// Import necessary functions and components
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SignUp from './page'

// Group tests for the SignUp component
describe('SignUp', () => {
  // Test case: Check if the sign-up heading is rendered
  it('should render the sign-up heading', () => {
    // Render the component
    render(<SignUp />)
    // Find the heading element
    const heading = screen.getByRole('heading', { name: /Create Account/i, level: 2 })
    // Assert that the heading is in the document
    expect(heading).toBeInTheDocument()
  })
})