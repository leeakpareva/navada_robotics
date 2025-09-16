// Import necessary functions from vitest and testing-library
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
// Import the component to be tested
import EducationalRoboticsPage from './page'

// Group tests for the EducationalRoboticsPage component
describe('EducationalRoboticsPage', () => {
  // Test case: Check if the main heading is rendered
  it('should render the main heading', () => {
    // Render the component
    render(<EducationalRoboticsPage />)
    // Find the heading element by its role and name
    const heading = screen.getByRole('heading', { name: /Educational Robotics/i, level: 1 })
    // Assert that the heading is in the document
    expect(heading).toBeInTheDocument()
  })
})