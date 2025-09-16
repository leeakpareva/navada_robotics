// Import necessary functions from vitest and testing-library
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
// Import the component to be tested
import RoboticsPage from './page'

// Group tests for the RoboticsPage component
describe('RoboticsPage', () => {
  // Test case: Check if the main heading is rendered
  it('should render the main heading', { timeout: 10000 }, () => {
    // Render the component
    render(<RoboticsPage />)
    // Find the heading element by its role and name
    const heading = screen.getByRole('heading', { name: /Robotics Innovation/i, level: 1 })
    // Assert that the heading is in the document
    expect(heading).toBeInTheDocument()
  })
})