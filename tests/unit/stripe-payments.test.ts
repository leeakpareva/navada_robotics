import { describe, it, expect, beforeEach, vi } from 'vitest'
import { processStripePayment, getPaymentStatus, retryFailedPayments } from '@/lib/stripe-payments'
import { prisma } from '@/lib/prisma'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    surveySubmission: {
      findUnique: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn()
    },
    paymentLog: {
      updateMany: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn()
    }
  }
}))

// Mock Stripe
vi.mock('stripe', () => {
  const MockStripe = vi.fn().mockImplementation(() => ({
    customers: {
      list: vi.fn(),
      create: vi.fn()
    },
    paymentIntents: {
      create: vi.fn()
    }
  }))
  return { default: MockStripe }
})

describe('Stripe Payments', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Set development environment for simulated payments
    process.env.NODE_ENV = 'development'
  })

  describe('processStripePayment', () => {
    const mockSurvey = {
      id: 'survey_123',
      surveyType: 'individual',
      stripeEmail: 'user@example.com',
      rewardAmount: 5.00,
      paymentStatus: 'pending',
      paymentId: null
    }

    it('processes payment successfully for new survey', async () => {
      ;(prisma.surveySubmission.findUnique as any).mockResolvedValue(mockSurvey)
      ;(prisma.paymentLog.updateMany as any).mockResolvedValue({})
      ;(prisma.surveySubmission.update as any).mockResolvedValue({
        ...mockSurvey,
        paymentStatus: 'completed',
        paymentId: 'pi_mock_123'
      })

      const result = await processStripePayment('survey_123')

      expect(result.success).toBe(true)
      expect(result.paymentId).toMatch(/^pi_mock_/)

      // Verify database updates
      expect(prisma.surveySubmission.update).toHaveBeenCalledWith({
        where: { id: 'survey_123' },
        data: {
          paymentStatus: 'completed',
          paymentId: expect.stringMatching(/^pi_mock_/),
          paidAt: expect.any(Date),
          processedAt: expect.any(Date)
        }
      })

      expect(prisma.paymentLog.updateMany).toHaveBeenCalledWith({
        where: { surveyId: 'survey_123' },
        data: {
          status: 'completed',
          stripePaymentId: expect.stringMatching(/^pi_mock_/)
        }
      })
    })

    it('returns existing payment if already completed', async () => {
      const completedSurvey = {
        ...mockSurvey,
        paymentStatus: 'completed',
        paymentId: 'pi_existing_123'
      }

      ;(prisma.surveySubmission.findUnique as any).mockResolvedValue(completedSurvey)

      const result = await processStripePayment('survey_123')

      expect(result.success).toBe(true)
      expect(result.paymentId).toBe('pi_existing_123')

      // Should not update database for already completed payments
      expect(prisma.surveySubmission.update).not.toHaveBeenCalled()
    })

    it('handles survey not found', async () => {
      ;(prisma.surveySubmission.findUnique as any).mockResolvedValue(null)

      const result = await processStripePayment('nonexistent_survey')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Survey submission not found')
    })

    it('handles payment processing errors', async () => {
      ;(prisma.surveySubmission.findUnique as any).mockResolvedValue(mockSurvey)
      ;(prisma.paymentLog.updateMany as any).mockRejectedValue(new Error('Database error'))
      ;(prisma.surveySubmission.update as any).mockResolvedValue({})

      const result = await processStripePayment('survey_123')

      expect(result.success).toBe(false)
      expect(result.error).toContain('Database error')

      // Should update payment status to failed
      expect(prisma.surveySubmission.update).toHaveBeenCalledWith({
        where: { id: 'survey_123' },
        data: { paymentStatus: 'failed' }
      })
    })

    it('increments payment attempt count', async () => {
      ;(prisma.surveySubmission.findUnique as any).mockResolvedValue(mockSurvey)
      ;(prisma.paymentLog.updateMany as any).mockResolvedValue({})
      ;(prisma.surveySubmission.update as any).mockResolvedValue({
        ...mockSurvey,
        paymentStatus: 'completed'
      })

      await processStripePayment('survey_123')

      expect(prisma.paymentLog.updateMany).toHaveBeenCalledWith({
        where: { surveyId: 'survey_123' },
        data: {
          attemptCount: {
            increment: 1
          }
        }
      })
    })
  })

  describe('getPaymentStatus', () => {
    it('returns payment status and logs', async () => {
      const mockSurvey = {
        paymentStatus: 'completed',
        paymentId: 'pi_123',
        paidAt: new Date(),
        rewardAmount: 5.00
      }

      const mockPaymentLogs = [
        {
          id: 'log_1',
          status: 'completed',
          attemptCount: 1,
          createdAt: new Date()
        }
      ]

      ;(prisma.surveySubmission.findUnique as any).mockResolvedValue(mockSurvey)
      ;(prisma.paymentLog.findMany as any).mockResolvedValue(mockPaymentLogs)

      const result = await getPaymentStatus('survey_123')

      expect(result.survey).toEqual(mockSurvey)
      expect(result.paymentLogs).toEqual(mockPaymentLogs)

      expect(prisma.surveySubmission.findUnique).toHaveBeenCalledWith({
        where: { id: 'survey_123' },
        select: {
          paymentStatus: true,
          paymentId: true,
          paidAt: true,
          rewardAmount: true
        }
      })

      expect(prisma.paymentLog.findMany).toHaveBeenCalledWith({
        where: { surveyId: 'survey_123' },
        orderBy: { createdAt: 'desc' }
      })
    })
  })

  describe('retryFailedPayments', () => {
    it('retries failed payments within retry limit', async () => {
      const failedSubmissions = [
        {
          id: 'survey_failed_1',
          paymentStatus: 'failed',
          stripeEmail: 'user1@example.com',
          rewardAmount: 5.00,
          submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
        },
        {
          id: 'survey_failed_2',
          paymentStatus: 'failed',
          stripeEmail: 'user2@example.com',
          rewardAmount: 15.00,
          submittedAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
        }
      ]

      const mockPaymentLog = {
        surveyId: 'survey_failed_1',
        attemptCount: 1
      }

      ;(prisma.surveySubmission.findMany as any).mockResolvedValue(failedSubmissions)
      ;(prisma.paymentLog.findFirst as any).mockResolvedValue(mockPaymentLog)
      ;(prisma.surveySubmission.findUnique as any)
        .mockResolvedValueOnce(failedSubmissions[0])
        .mockResolvedValueOnce(failedSubmissions[1])
      ;(prisma.paymentLog.updateMany as any).mockResolvedValue({})
      ;(prisma.surveySubmission.update as any).mockResolvedValue({})

      const results = await retryFailedPayments(3)

      expect(results).toHaveLength(2)
      expect(results[0].surveyId).toBe('survey_failed_1')
      expect(results[1].surveyId).toBe('survey_failed_2')

      // Verify it only retries submissions from last 7 days
      expect(prisma.surveySubmission.findMany).toHaveBeenCalledWith({
        where: {
          paymentStatus: 'failed',
          submittedAt: {
            gte: expect.any(Date)
          }
        },
        include: {
          _count: {
            select: {
              id: true
            }
          }
        }
      })
    })

    it('skips retries when max attempts reached', async () => {
      const failedSubmission = {
        id: 'survey_failed_1',
        paymentStatus: 'failed',
        submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
      }

      const mockPaymentLog = {
        surveyId: 'survey_failed_1',
        attemptCount: 3 // Already at max retries
      }

      ;(prisma.surveySubmission.findMany as any).mockResolvedValue([failedSubmission])
      ;(prisma.paymentLog.findFirst as any).mockResolvedValue(mockPaymentLog)

      const results = await retryFailedPayments(3)

      expect(results).toHaveLength(0)
      expect(prisma.surveySubmission.findUnique).not.toHaveBeenCalled()
    })

    it('handles errors during retry gracefully', async () => {
      ;(prisma.surveySubmission.findMany as any).mockRejectedValue(new Error('Database error'))

      await expect(retryFailedPayments()).rejects.toThrow('Database error')
    })
  })

  describe('Production vs Development', () => {
    it('uses simulation in development environment', async () => {
      process.env.NODE_ENV = 'development'

      const mockSurvey = {
        id: 'survey_123',
        stripeEmail: 'user@example.com',
        rewardAmount: 5.00,
        paymentStatus: 'pending'
      }

      ;(prisma.surveySubmission.findUnique as any).mockResolvedValue(mockSurvey)
      ;(prisma.paymentLog.updateMany as any).mockResolvedValue({})
      ;(prisma.surveySubmission.update as any).mockResolvedValue({})

      const result = await processStripePayment('survey_123')

      expect(result.success).toBe(true)
      expect(result.paymentId).toMatch(/^pi_mock_/)
    })

    it('would use real Stripe in production', async () => {
      process.env.NODE_ENV = 'production'

      const mockSurvey = {
        id: 'survey_123',
        stripeEmail: 'user@example.com',
        rewardAmount: 5.00,
        paymentStatus: 'pending'
      }

      ;(prisma.surveySubmission.findUnique as any).mockResolvedValue(mockSurvey)
      ;(prisma.paymentLog.updateMany as any).mockResolvedValue({})
      ;(prisma.surveySubmission.update as any).mockResolvedValue({})

      // In production, it would create actual Stripe customers and payment intents
      // This is mocked here, but the structure shows how it would work
      const result = await processStripePayment('survey_123')

      expect(result.success).toBe(true)
    })
  })
})