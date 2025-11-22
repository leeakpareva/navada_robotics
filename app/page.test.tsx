// Import necessary functions and components from vitest, testing-library, and next-auth
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import HomePage from './page'
import { SessionProvider } from 'next-auth/react'

// Mock the Vortex component to prevent rendering issues in the test environment
vi.mock('@/components/ui/vortex', () => ({
  Vortex: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

// Group tests for the HomePage component
describe('HomePage', () => {
  // Test case: Check if the main heading is rendered asynchronously
  it('should render the main heading', async () => {
    // Render the component within a SessionProvider
    render(
      <SessionProvider>
        <HomePage />
      </SessionProvider>
    )
    // Asynchronously find the heading element by its role and name
    const heading = await screen.findByRole('heading', { name: /Navigating Artistic Vision with Advanced Digital Assistance/i, level: 2 })
    // Assert that the heading is in the document
    expect(heading).toBeInTheDocument()
  })

  it('should render the Innovation Showcase section', () => {
    render(
      <SessionProvider>
        <HomePage />
      </SessionProvider>
    )
    const innovationShowcaseHeading = screen.getByRole('heading', { name: /Innovation Showcase/i, level: 3 })
    expect(innovationShowcaseHeading).toBeInTheDocument()
  })

  it('should render the Active Projects section', () => {
    render(
      <SessionProvider>
        <HomePage />
      </SessionProvider>
    )
    const activeProjectsHeading = screen.getByRole('heading', { name: /Active Projects/i, level: 3 })
    expect(activeProjectsHeading).toBeInTheDocument()
  })

  it('should render the navigation links', () => {
    render(
      <SessionProvider>
        <HomePage />
      </SessionProvider>
    )
    const solutionsLinks = screen.getAllByRole('link', { name: /Solutions/i })
    const aboutLinks = screen.getAllByRole('link', { name: /About/i })
    const contactLinks = screen.getAllByRole('link', { name: /Contact/i })

    expect(solutionsLinks.length).toBeGreaterThan(0)
    expect(aboutLinks.length).toBeGreaterThan(0)
    expect(contactLinks.length).toBeGreaterThan(0)
  })

  it('should render the footer', () => {
    render(
      <SessionProvider>
        <HomePage />
      </SessionProvider>
    )
    const footerText = screen.getByText(/© 2024 NAVADA. All rights reserved./i)
    expect(footerText).toBeInTheDocument()
  })
})