import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { POST, GET } from '@/app/api/data/submit-survey/route'
import { prisma } from '@/lib/prisma'
import { processStripePayment } from '@/lib/stripe-payments'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    surveySubmission: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
      groupBy: vi.fn(),
      findMany: vi.fn()
    },
    surveyAnalytics: {
      createMany: vi.fn()
    },
    paymentLog: {
      create: vi.fn(),
      updateMany: vi.fn()
    }
  }
}))

// Mock Stripe payments
vi.mock('@/lib/stripe-payments', () => ({
  processStripePayment: vi.fn()
}))

// Mock headers
vi.mock('next/headers', () => ({
  headers: () => ({
    get: vi.fn((header: string) => {
      if (header === 'x-forwarded-for') return '192.168.1.1'
      if (header === 'user-agent') return 'test-agent'
      return null
    })
  })
}))

describe('Survey Submission API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('POST /api/data/submit-survey', () => {
    const validIndividualSurvey = {
      group: 'individual',
      formData: {
        age_group: '25-34',
        location: 'Nigeria',
        ai_familiarity: 'Somewhat familiar'
      },
      contactInfo: {
        name: 'John Doe',
        email: 'john@example.com',
        stripeEmail: 'john.payment@example.com',
        country: 'Nigeria',
        age: '18+'
      },
      timestamp: new Date().toISOString()
    }

    const validBusinessSurvey = {
      group: 'business',
      formData: {
        company_size: '11-50 employees',
        industry: 'Technology',
        ai_adoption_stage: 'Exploring AI possibilities'
      },
      contactInfo: {
        name: 'Jane Smith',
        email: 'jane@company.com',
        stripeEmail: 'jane.payment@company.com',
        country: 'Ghana',
        age: '18+'
      },
      timestamp: new Date().toISOString()
    }

    it('successfully submits individual survey', async () => {
      // Mock no existing submission
      ;(prisma.surveySubmission.findFirst as any).mockResolvedValue(null)

      // Mock successful creation
      const mockSubmission = {
        id: 'survey_123',
        surveyType: 'individual',
        ...validIndividualSurvey.contactInfo,
        responses: validIndividualSurvey.formData,
        rewardAmount: 5.00,
        status: 'submitted',
        paymentStatus: 'pending'
      }
      ;(prisma.surveySubmission.create as any).mockResolvedValue(mockSubmission)
      ;(prisma.surveyAnalytics.createMany as any).mockResolvedValue({ count: 3 })
      ;(prisma.paymentLog.create as any).mockResolvedValue({})
      ;(processStripePayment as any).mockResolvedValue({ success: true })

      const request = new NextRequest('http://localhost:3000/api/data/submit-survey', {
        method: 'POST',
        body: JSON.stringify(validIndividualSurvey),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.submissionId).toBe('survey_123')
      expect(data.rewardAmount).toBe('$5 USD')

      // Verify database calls
      expect(prisma.surveySubmission.create).toHaveBeenCalledWith({
        data: {
          surveyType: 'individual',
          responses: validIndividualSurvey.formData,
          contactName: 'John Doe',
          contactEmail: 'john@example.com',
          stripeEmail: 'john.payment@example.com',
          country: 'Nigeria',
          ageConfirmed: true,
          ipAddress: '192.168.1.1',
          userAgent: 'test-agent',
          rewardAmount: 5.00,
          status: 'submitted',
          paymentStatus: 'pending'
        }
      })

      expect(prisma.surveyAnalytics.createMany).toHaveBeenCalled()
      expect(prisma.paymentLog.create).toHaveBeenCalled()
    })

    it('successfully submits business survey with higher reward', async () => {
      ;(prisma.surveySubmission.findFirst as any).mockResolvedValue(null)

      const mockSubmission = {
        id: 'survey_456',
        surveyType: 'business',
        ...validBusinessSurvey.contactInfo,
        responses: validBusinessSurvey.formData,
        rewardAmount: 15.00,
        status: 'submitted',
        paymentStatus: 'pending'
      }
      ;(prisma.surveySubmission.create as any).mockResolvedValue(mockSubmission)
      ;(prisma.surveyAnalytics.createMany as any).mockResolvedValue({ count: 3 })
      ;(prisma.paymentLog.create as any).mockResolvedValue({})

      const request = new NextRequest('http://localhost:3000/api/data/submit-survey', {
        method: 'POST',
        body: JSON.stringify(validBusinessSurvey),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.rewardAmount).toBe('$15 USD')

      expect(prisma.surveySubmission.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          surveyType: 'business',
          rewardAmount: 15.00
        })
      })
    })

    it('prevents duplicate submissions', async () => {
      // Mock existing submission
      ;(prisma.surveySubmission.findFirst as any).mockResolvedValue({
        id: 'existing_survey',
        contactEmail: 'john@example.com',
        surveyType: 'individual'
      })

      const request = new NextRequest('http://localhost:3000/api/data/submit-survey', {
        method: 'POST',
        body: JSON.stringify(validIndividualSurvey),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('already submitted')
      expect(data.code).toBe('DUPLICATE_SUBMISSION')
      expect(prisma.surveySubmission.create).not.toHaveBeenCalled()
    })

    it('validates required fields', async () => {
      const invalidSurvey = {
        group: 'individual',
        formData: {},
        contactInfo: {
          name: '',
          email: 'invalid-email',
          stripeEmail: 'invalid-stripe-email',
          country: '',
          age: ''
        },
        timestamp: new Date().toISOString()
      }

      const request = new NextRequest('http://localhost:3000/api/data/submit-survey', {
        method: 'POST',
        body: JSON.stringify(invalidSurvey),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid form data')
      expect(data.details).toContain('contactInfo.email: Invalid email address')
    })

    it('handles invalid survey group', async () => {
      const invalidGroupSurvey = {
        ...validIndividualSurvey,
        group: 'invalid-group'
      }

      const request = new NextRequest('http://localhost:3000/api/data/submit-survey', {
        method: 'POST',
        body: JSON.stringify(invalidGroupSurvey),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid form data')
    })

    it('handles database errors gracefully', async () => {
      ;(prisma.surveySubmission.findFirst as any).mockRejectedValue(new Error('Database error'))

      const request = new NextRequest('http://localhost:3000/api/data/submit-survey', {
        method: 'POST',
        body: JSON.stringify(validIndividualSurvey),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to submit survey. Please try again.')
    })

    it('creates analytics entries for each question', async () => {
      ;(prisma.surveySubmission.findFirst as any).mockResolvedValue(null)

      const mockSubmission = {
        id: 'survey_123',
        surveyType: 'individual'
      }
      ;(prisma.surveySubmission.create as any).mockResolvedValue(mockSubmission)
      ;(prisma.surveyAnalytics.createMany as any).mockResolvedValue({ count: 3 })
      ;(prisma.paymentLog.create as any).mockResolvedValue({})

      const request = new NextRequest('http://localhost:3000/api/data/submit-survey', {
        method: 'POST',
        body: JSON.stringify(validIndividualSurvey),
        headers: { 'Content-Type': 'application/json' }
      })

      await POST(request)

      expect(prisma.surveyAnalytics.createMany).toHaveBeenCalledWith({
        data: [
          {
            surveyType: 'individual',
            questionId: 'age_group',
            selectedOption: '25-34',
            participantId: 'survey_123',
            country: 'Nigeria'
          },
          {
            surveyType: 'individual',
            questionId: 'location',
            selectedOption: 'Nigeria',
            participantId: 'survey_123',
            country: 'Nigeria'
          },
          {
            surveyType: 'individual',
            questionId: 'ai_familiarity',
            selectedOption: 'Somewhat familiar',
            participantId: 'survey_123',
            country: 'Nigeria'
          }
        ]
      })
    })
  })

  describe('GET /api/data/submit-survey', () => {
    it('returns survey statistics', async () => {
      const mockStats = [
        { surveyType: 'individual', paymentStatus: 'pending', _count: { id: 5 } },
        { surveyType: 'individual', paymentStatus: 'completed', _count: { id: 3 } },
        { surveyType: 'business', paymentStatus: 'pending', _count: { id: 2 } },
        { surveyType: 'business', paymentStatus: 'completed', _count: { id: 1 } }
      ]

      const mockRecentSubmissions = [
        {
          id: 'survey_1',
          surveyType: 'individual',
          country: 'Nigeria',
          paymentStatus: 'completed',
          submittedAt: new Date(),
          rewardAmount: 5.00
        }
      ]

      ;(prisma.surveySubmission.groupBy as any).mockResolvedValue(mockStats)
      ;(prisma.surveySubmission.count as any)
        .mockResolvedValueOnce(11) // total submissions
        .mockResolvedValueOnce(4) // total paid
      ;(prisma.surveySubmission.findMany as any).mockResolvedValue(mockRecentSubmissions)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.stats).toEqual(mockStats)
      expect(data.totalSubmissions).toBe(11)
      expect(data.totalPaid).toBe(4)
      expect(data.recentSubmissions).toEqual(mockRecentSubmissions)
    })

    it('handles errors in statistics retrieval', async () => {
      ;(prisma.surveySubmission.groupBy as any).mockRejectedValue(new Error('Database error'))

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to fetch survey statistics')
    })
  })
})