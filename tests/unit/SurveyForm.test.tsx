import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { SurveyForm } from '@/components/data/SurveyForm'
import { getSurveyQuestions } from '@/lib/surveyQuestions'

// Mock the survey questions
vi.mock('@/lib/surveyQuestions', () => ({
  getSurveyQuestions: vi.fn()
}))

// Mock fetch
global.fetch = vi.fn()

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

const mockIndividualQuestions = [
  {
    id: 'age_group',
    text: 'What is your age group?',
    options: ['18-24', '25-34', '35-44'],
    required: true
  },
  {
    id: 'location',
    text: 'Which country are you currently based in?',
    options: ['Nigeria', 'Ghana', 'Kenya'],
    required: true
  }
]

const mockBusinessQuestions = [
  {
    id: 'company_size',
    text: 'What is the size of your organization?',
    options: ['1-10 employees', '11-50 employees', '51-200 employees'],
    required: true
  }
]

describe('SurveyForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(fetch as any).mockClear()
    ;(getSurveyQuestions as any).mockImplementation((group: string) => {
      return group === 'individual' ? mockIndividualQuestions : mockBusinessQuestions
    })
  })

  describe('Individual Survey', () => {
    it('renders individual survey form correctly', () => {
      render(<SurveyForm group="individual" />)

      expect(screen.getByText('Individual Survey')).toBeInTheDocument()
      expect(screen.getByText('$5 USD')).toBeInTheDocument()
      expect(screen.getByText('What is your age group?')).toBeInTheDocument()
      expect(screen.getByText('Which country are you currently based in?')).toBeInTheDocument()
    })

    it('shows progress as questions are answered', async () => {
      render(<SurveyForm group="individual" />)

      // Initially 0 of 2 questions answered
      expect(screen.getByText('0 of 2 questions')).toBeInTheDocument()

      // Answer first question
      const ageOption = screen.getByLabelText('18-24')
      fireEvent.click(ageOption)

      await waitFor(() => {
        expect(screen.getByText('1 of 2 questions')).toBeInTheDocument()
      })
    })

    it('prevents proceeding with incomplete survey', async () => {
      render(<SurveyForm group="individual" />)

      const continueButton = screen.getByText('Continue to Contact Information')
      fireEvent.click(continueButton)

      await waitFor(() => {
        expect(screen.getByText('Please complete all required questions before proceeding')).toBeInTheDocument()
      })
    })

    it('allows proceeding when all questions are answered', async () => {
      render(<SurveyForm group="individual" />)

      // Answer all questions
      fireEvent.click(screen.getByLabelText('18-24'))
      fireEvent.click(screen.getByLabelText('Nigeria'))

      const continueButton = screen.getByText('Continue to Contact Information')
      fireEvent.click(continueButton)

      await waitFor(() => {
        expect(screen.getByText('Contact Information for Payment')).toBeInTheDocument()
      })
    })
  })

  describe('Business Survey', () => {
    it('renders business survey form correctly', () => {
      render(<SurveyForm group="business" />)

      expect(screen.getByText('Business Survey')).toBeInTheDocument()
      expect(screen.getByText('$15 USD')).toBeInTheDocument()
      expect(screen.getByText('What is the size of your organization?')).toBeInTheDocument()
    })
  })

  describe('Contact Information', () => {
    beforeEach(async () => {
      render(<SurveyForm group="individual" />)

      // Complete survey first
      fireEvent.click(screen.getByLabelText('18-24'))
      fireEvent.click(screen.getByLabelText('Nigeria'))
      fireEvent.click(screen.getByText('Continue to Contact Information'))

      await waitFor(() => {
        expect(screen.getByText('Contact Information for Payment')).toBeInTheDocument()
      })
    })

    it('renders contact form fields', () => {
      expect(screen.getByPlaceholderText('Enter your full name')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('your.email@example.com')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('payment@example.com')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('e.g., Nigeria')).toBeInTheDocument()
      expect(screen.getByLabelText('I am 18 or older')).toBeInTheDocument()
    })

    it('validates required contact fields', async () => {
      const submitButton = screen.getByText('Submit Survey & Get $5 USD')
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Please fix the following:')).toBeInTheDocument()
        expect(screen.getByText('• Full name is required')).toBeInTheDocument()
        expect(screen.getByText('• Email address is required')).toBeInTheDocument()
      })
    })

    it('validates email format', async () => {
      fireEvent.change(screen.getByPlaceholderText('your.email@example.com'), {
        target: { value: 'invalid-email' }
      })

      const submitButton = screen.getByText('Submit Survey & Get $5 USD')
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('• Please enter a valid email address')).toBeInTheDocument()
      })
    })

    it('submits survey successfully', async () => {
      // Fill out contact form
      fireEvent.change(screen.getByPlaceholderText('Enter your full name'), {
        target: { value: 'John Doe' }
      })
      fireEvent.change(screen.getByPlaceholderText('your.email@example.com'), {
        target: { value: 'john@example.com' }
      })
      fireEvent.change(screen.getByPlaceholderText('payment@example.com'), {
        target: { value: 'john.payment@example.com' }
      })
      fireEvent.change(screen.getByPlaceholderText('e.g., Nigeria'), {
        target: { value: 'Nigeria' }
      })
      fireEvent.click(screen.getByLabelText('I am 18 or older'))

      // Mock successful API response
      ;(fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          submissionId: 'test-id',
          rewardAmount: '$5 USD'
        })
      })

      const submitButton = screen.getByText('Submit Survey & Get $5 USD')
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Survey Submitted Successfully!')).toBeInTheDocument()
        expect(screen.getByText('john.payment@example.com')).toBeInTheDocument()
      })

      // Verify API call
      expect(fetch).toHaveBeenCalledWith('/api/data/submit-survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          group: 'individual',
          formData: {
            age_group: '18-24',
            location: 'Nigeria'
          },
          contactInfo: {
            name: 'John Doe',
            email: 'john@example.com',
            stripeEmail: 'john.payment@example.com',
            country: 'Nigeria',
            age: '18+'
          },
          timestamp: expect.any(String)
        })
      })
    })

    it('handles API error gracefully', async () => {
      // Fill out contact form
      fireEvent.change(screen.getByPlaceholderText('Enter your full name'), {
        target: { value: 'John Doe' }
      })
      fireEvent.change(screen.getByPlaceholderText('your.email@example.com'), {
        target: { value: 'john@example.com' }
      })
      fireEvent.change(screen.getByPlaceholderText('payment@example.com'), {
        target: { value: 'john.payment@example.com' }
      })
      fireEvent.change(screen.getByPlaceholderText('e.g., Nigeria'), {
        target: { value: 'Nigeria' }
      })
      fireEvent.click(screen.getByLabelText('I am 18 or older'))

      // Mock API error
      ;(fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Server error' })
      })

      const submitButton = screen.getByText('Submit Survey & Get $5 USD')
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.queryByText('Survey Submitted Successfully!')).not.toBeInTheDocument()
      })
    })

    it('allows going back to survey', async () => {
      const backButton = screen.getByText('Back to Survey')
      fireEvent.click(backButton)

      await waitFor(() => {
        expect(screen.getByText('What is your age group?')).toBeInTheDocument()
      })
    })
  })

  describe('Success State', () => {
    it('shows success message with payment details', async () => {
      render(<SurveyForm group="individual" />)

      // Complete survey
      fireEvent.click(screen.getByLabelText('18-24'))
      fireEvent.click(screen.getByLabelText('Nigeria'))
      fireEvent.click(screen.getByText('Continue to Contact Information'))

      await waitFor(() => {
        expect(screen.getByText('Contact Information for Payment')).toBeInTheDocument()
      })

      // Fill contact form
      fireEvent.change(screen.getByPlaceholderText('Enter your full name'), {
        target: { value: 'John Doe' }
      })
      fireEvent.change(screen.getByPlaceholderText('your.email@example.com'), {
        target: { value: 'john@example.com' }
      })
      fireEvent.change(screen.getByPlaceholderText('payment@example.com'), {
        target: { value: 'john.payment@example.com' }
      })
      fireEvent.change(screen.getByPlaceholderText('e.g., Nigeria'), {
        target: { value: 'Nigeria' }
      })
      fireEvent.click(screen.getByLabelText('I am 18 or older'))

      // Mock successful submission
      ;(fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          submissionId: 'test-id',
          rewardAmount: '$5 USD'
        })
      })

      fireEvent.click(screen.getByText('Submit Survey & Get $5 USD'))

      await waitFor(() => {
        expect(screen.getByText('Survey Submitted Successfully!')).toBeInTheDocument()
        expect(screen.getByText(/Your survey responses have been securely recorded/)).toBeInTheDocument()
        expect(screen.getByText(/Our team will process your payment within 72 hours/)).toBeInTheDocument()
        expect(screen.getByText(/You'll receive \$5 USD via Stripe/)).toBeInTheDocument()
      })
    })
  })
})