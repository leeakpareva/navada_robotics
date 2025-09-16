
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AboutPage from './page'

describe('AboutPage', () => {
  it('should render the main heading', () => {
    render(<AboutPage />)
    const heading = screen.getByRole('heading', { name: /About NAVADA/i, level: 2 })
    expect(heading).toBeInTheDocument()
  })

  it("should render the founder's name", () => {
    render(<AboutPage />)
    const founderName = screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'p' && element.classList.contains('text-xl') && /Lee Akpareva MBA, MA/i.test(content)
    })
    expect(founderName).toBeInTheDocument()
  })

  it('should render the leadership section heading', () => {
    render(<AboutPage />)
    const leadershipHeading = screen.getByRole('heading', { name: /Leadership/i, level: 3 })
    expect(leadershipHeading).toBeInTheDocument()
  })

  it('should render the Connect on LinkedIn link', () => {
    render(<AboutPage />)
    const linkedInLink = screen.getByRole('link', { name: /Connect on LinkedIn/i })
    expect(linkedInLink).toBeInTheDocument()
  })
})
