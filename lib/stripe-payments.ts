import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

export interface PaymentResult {
  success: boolean
  paymentId?: string
  error?: string
}

/**
 * Process a Stripe payment for a survey submission
 */
export async function processStripePayment(surveyId: string): Promise<PaymentResult> {
  try {
    // Get survey submission details
    const survey = await prisma.surveySubmission.findUnique({
      where: { id: surveyId },
      include: {
        _count: {
          select: {
            id: true
          }
        }
      }
    })

    if (!survey) {
      throw new Error('Survey submission not found')
    }

    if (survey.paymentStatus === 'completed') {
      return { success: true, paymentId: survey.paymentId || undefined }
    }

    // Update payment log attempt count
    await prisma.paymentLog.updateMany({
      where: { surveyId },
      data: {
        attemptCount: {
          increment: 1
        }
      }
    })

    // For now, we'll simulate payment processing since Stripe Connect requires more setup
    // In production, you would use Stripe transfers or payouts
    const simulatedPayment = await simulateStripePayment({
      email: survey.stripeEmail,
      amount: Number(survey.rewardAmount),
      currency: 'usd',
      description: `NAVADA Survey Reward - ${survey.surveyType} survey`
    })

    if (simulatedPayment.success) {
      // Update survey submission
      await prisma.surveySubmission.update({
        where: { id: surveyId },
        data: {
          paymentStatus: 'completed',
          paymentId: simulatedPayment.paymentId,
          paidAt: new Date(),
          processedAt: new Date()
        }
      })

      // Update payment log
      await prisma.paymentLog.updateMany({
        where: { surveyId },
        data: {
          status: 'completed',
          stripePaymentId: simulatedPayment.paymentId
        }
      })

      // TODO: Send confirmation email to participant

      return simulatedPayment
    } else {
      throw new Error(simulatedPayment.error || 'Payment processing failed')
    }

  } catch (error) {
    console.error('Stripe payment processing error:', error)

    // Update payment status to failed
    await prisma.surveySubmission.update({
      where: { id: surveyId },
      data: {
        paymentStatus: 'failed'
      }
    }).catch(console.error)

    await prisma.paymentLog.updateMany({
      where: { surveyId },
      data: {
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      }
    }).catch(console.error)

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment processing failed'
    }
  }
}

/**
 * Simulate Stripe payment for development/testing
 * In production, replace with actual Stripe API calls
 */
async function simulateStripePayment({
  email,
  amount,
  currency,
  description
}: {
  email: string
  amount: number
  currency: string
  description: string
}): Promise<PaymentResult> {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // In development, always succeed
    if (process.env.NODE_ENV === 'development') {
      const mockPaymentId = `pi_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      console.log(`[SIMULATED] Stripe payment processed:
        Email: ${email}
        Amount: $${amount} ${currency.toUpperCase()}
        Description: ${description}
        Payment ID: ${mockPaymentId}
      `)

      return {
        success: true,
        paymentId: mockPaymentId
      }
    }

    // For production, implement actual Stripe payment logic
    // Example using Stripe transfers or payouts:

    // 1. Create or get Stripe customer
    let customer: Stripe.Customer
    try {
      const existingCustomers = await stripe.customers.list({
        email: email,
        limit: 1
      })

      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0]
      } else {
        customer = await stripe.customers.create({
          email: email,
          description: 'NAVADA Survey Participant'
        })
      }
    } catch (error) {
      throw new Error(`Failed to create/find customer: ${error}`)
    }

    // 2. For actual payments, you would typically use:
    // - Stripe Connect for marketplace payments
    // - Stripe Transfers for connected accounts
    // - Third-party services like PayPal or bank transfers

    // For now, create a payment intent as a placeholder
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency,
      customer: customer.id,
      description: description,
      metadata: {
        type: 'survey_reward',
        participant_email: email
      }
    })

    return {
      success: true,
      paymentId: paymentIntent.id
    }

  } catch (error) {
    console.error('Payment simulation error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment failed'
    }
  }
}

/**
 * Get payment status for a survey
 */
export async function getPaymentStatus(surveyId: string) {
  try {
    const survey = await prisma.surveySubmission.findUnique({
      where: { id: surveyId },
      select: {
        paymentStatus: true,
        paymentId: true,
        paidAt: true,
        rewardAmount: true
      }
    })

    const paymentLogs = await prisma.paymentLog.findMany({
      where: { surveyId },
      orderBy: { createdAt: 'desc' }
    })

    return {
      survey,
      paymentLogs
    }
  } catch (error) {
    console.error('Get payment status error:', error)
    throw error
  }
}

/**
 * Retry failed payments
 */
export async function retryFailedPayments(maxRetries: number = 3) {
  try {
    const failedPayments = await prisma.surveySubmission.findMany({
      where: {
        paymentStatus: 'failed',
        // Only retry submissions from the last 7 days
        submittedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
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

    const results = []

    for (const submission of failedPayments) {
      const paymentLog = await prisma.paymentLog.findFirst({
        where: { surveyId: submission.id },
        orderBy: { createdAt: 'desc' }
      })

      if (!paymentLog || paymentLog.attemptCount < maxRetries) {
        console.log(`Retrying payment for survey ${submission.id}`)
        const result = await processStripePayment(submission.id)
        results.push({
          surveyId: submission.id,
          result
        })

        // Add delay between retries to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }

    return results
  } catch (error) {
    console.error('Retry failed payments error:', error)
    throw error
  }
}

export { stripe }