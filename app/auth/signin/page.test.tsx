// Import necessary functions and components
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SignIn from './page'

// Group tests for the SignIn component
describe('SignIn', () => {
  // Test case: Check if the sign-in heading is rendered
  it('should render the sign-in heading', () => {
    // Render the component
    render(<SignIn />)
    // Find the heading element
    const heading = screen.getByRole('heading', { name: /Welcome Back/i, level: 2 })
    // Assert that the heading is in the document
    expect(heading).toBeInTheDocument()
  })
})