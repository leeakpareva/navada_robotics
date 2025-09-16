
// Import necessary functions from vitest and testing-library
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
// Import the component to be tested
import ContactPage from './page'

// Group tests for the ContactPage component
describe('ContactPage', () => {
  // Test case: Check if the main heading is rendered
  it('should render the main heading', () => {
    // Render the component
    render(<ContactPage />)
    // Find the heading element by its role and name
    const heading = screen.getByRole('heading', { name: /Get In Touch/i, level: 2 })
    // Assert that the heading is in the document
    expect(heading).toBeInTheDocument()
  })

  it('should render the phone number', () => {
    render(<ContactPage />)
    const phoneNumber = screen.getByText(/\+44 7953 523704/i)
    expect(phoneNumber).toBeInTheDocument()
  })

  it('should render the email address', () => {
    render(<ContactPage />)
    const emailAddress = screen.getByText(/leekapareva@gmail.com/i)
    expect(emailAddress).toBeInTheDocument()
  })

  it('should render the location', () => {
    render(<ContactPage />)
    const location = screen.getByText(/London, UK/i)
    expect(location).toBeInTheDocument()
  })

  it('should render the FAQ section', () => {
    render(<ContactPage />)
    const faqHeading = screen.getByRole('heading', { name: /Frequently Asked Questions/i, level: 3 })
    expect(faqHeading).toBeInTheDocument()
  })
})
