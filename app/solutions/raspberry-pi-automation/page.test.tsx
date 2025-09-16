// Import necessary functions from vitest and testing-library
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
// Import the component to be tested
import RaspberryPiAutomationPage from './page'

// Group tests for the RaspberryPiAutomationPage component
describe('RaspberryPiAutomationPage', () => {
  // Test case: Check if the main heading is rendered
  it('should render the main heading', () => {
    // Render the component
    render(<RaspberryPiAutomationPage />)
    // Find the heading element by its role and name
    const heading = screen.getByRole('heading', { name: /Raspberry Pi Automation/i, level: 1 })
    // Assert that the heading is in the document
    expect(heading).toBeInTheDocument()
  })
})