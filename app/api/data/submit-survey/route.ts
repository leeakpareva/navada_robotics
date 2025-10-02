import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { isSurveySubmissionAllowed, getSurveyStatus } from '@/lib/surveyConfig'

// Validation schema
const submitSurveySchema = z.object({
  group: z.enum(['individual', 'business']),
  formData: z.record(z.string()),
  contactInfo: z.object({
    // User Authentication
    userEmail: z.string().email('Invalid login email address'),
    userPassword: z.string().min(6, 'Password must be at least 6 characters'),

    // Basic Contact Info
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid contact email address'),
    phoneNumber: z.string().min(1, 'Phone number is required'),
    stripeEmail: z.string().email('Invalid Stripe email address'),
    country: z.string().min(1, 'Country is required'),
    age: z.string().min(1, 'Age confirmation is required'),

    // Banking Info (Individual Survey)
    bankAccount: z.string().optional(),
    bankName: z.string().optional(),

    // Business Registration (Business Survey)
    businessName: z.string().optional(),
    businessRegNumber: z.string().optional(),
    businessEmail: z.string().email('Invalid business email address').optional(),
    businessPhone: z.string().optional(),
    businessAddress: z.string().optional(),
    businessType: z.string().optional()
  }),
  timestamp: z.string()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const validatedData = submitSurveySchema.parse(body)
    const { group, formData, contactInfo, timestamp } = validatedData

    // Check if survey submission window is open
    if (!isSurveySubmissionAllowed()) {
      const surveyStatus = getSurveyStatus()
      return NextResponse.json(
        {
          error: 'Survey submission window is closed',
          message: surveyStatus.message,
          status: surveyStatus.status
        },
        { status: 400 }
      )
    }

    // Get client information
    const headersList = headers()
    const ipAddress = headersList.get('x-forwarded-for') ||
                      headersList.get('x-real-ip') ||
                      request.ip ||
                      'unknown'
    const userAgent = headersList.get('user-agent') || 'unknown'

    // Check if user has already submitted this survey type
    const existingSurvey = await prisma.surveySubmission.findFirst({
      where: {
        userEmail: contactInfo.userEmail,
        surveyType: group
      }
    })

    if (existingSurvey) {
      return NextResponse.json(
        {
          error: 'You have already submitted this survey type. Each user can only submit once per survey type.',
          code: 'DUPLICATE_SUBMISSION'
        },
        { status: 400 }
      )
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(contactInfo.userPassword, 10)

    // Determine reward amount
    const rewardAmount = group === 'individual' ? 5.00 : 15.00

    // Create survey submission with all new fields
    const surveySubmission = await prisma.surveySubmission.create({
      data: {
        surveyType: group,
        responses: formData,

        // User Authentication
        userEmail: contactInfo.userEmail,
        userPassword: hashedPassword,

        // Basic Contact Info
        contactName: contactInfo.name,
        contactEmail: contactInfo.email,
        phoneNumber: contactInfo.phoneNumber,
        stripeEmail: contactInfo.stripeEmail,
        country: contactInfo.country,
        ageConfirmed: contactInfo.age === '18+',

        // Banking Info (Individual Survey)
        bankAccount: group === 'individual' ? contactInfo.bankAccount : null,
        bankName: group === 'individual' ? contactInfo.bankName : null,

        // Business Registration (Business Survey)
        businessName: group === 'business' ? contactInfo.businessName : null,
        businessRegNumber: group === 'business' ? contactInfo.businessRegNumber : null,
        businessEmail: group === 'business' ? contactInfo.businessEmail : null,
        businessPhone: group === 'business' ? contactInfo.businessPhone : null,
        businessAddress: group === 'business' ? contactInfo.businessAddress : null,
        businessType: group === 'business' ? contactInfo.businessType : null,

        // System Fields
        ipAddress,
        userAgent,
        rewardAmount,
        status: 'submitted',
        paymentStatus: 'pending'
      }
    })

    // Create analytics entries for each question response
    const analyticsEntries = Object.entries(formData).map(([questionId, selectedOption]) => ({
      surveyType: group,
      questionId,
      selectedOption,
      participantId: surveySubmission.id,
      country: contactInfo.country
    }))

    if (analyticsEntries.length > 0) {
      await prisma.surveyAnalytics.createMany({
        data: analyticsEntries
      })
    }

    // Create initial payment log
    await prisma.paymentLog.create({
      data: {
        surveyId: surveySubmission.id,
        stripeEmail: contactInfo.stripeEmail,
        amount: rewardAmount,
        currency: 'USD',
        status: 'pending',
        attemptCount: 0
      }
    })

    // TODO: Queue payment processing job
    // This would typically be handled by a background job or webhook
    // For now, we'll create a simple processing function

    // Trigger payment processing (async, don't wait for completion)
    processPaymentAsync(surveySubmission.id).catch(error => {
      console.error('Payment processing error:', error)
    })

    return NextResponse.json({
      success: true,
      message: 'Survey submitted successfully',
      submissionId: surveySubmission.id,
      rewardAmount: `$${rewardAmount} USD`,
      paymentTimeline: '72 hours'
    })

  } catch (error) {
    console.error('Survey submission error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid form data',
          details: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to submit survey. Please try again.' },
      { status: 500 }
    )
  }
}

// Async payment processing function
async function processPaymentAsync(surveyId: string) {
  try {
    // Import payment processing function
    const { processStripePayment } = await import('@/lib/stripe-payments')

    // Process the payment
    await processStripePayment(surveyId)
  } catch (error) {
    console.error('Async payment processing error:', error)

    // Update payment status to failed
    await prisma.paymentLog.updateMany({
      where: { surveyId },
      data: {
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      }
    })
  }
}

// Get survey statistics (for admin dashboard)
export async function GET() {
  try {
    const stats = await prisma.surveySubmission.groupBy({
      by: ['surveyType', 'paymentStatus'],
      _count: {
        id: true
      }
    })

    const totalSubmissions = await prisma.surveySubmission.count()
    const totalPaid = await prisma.surveySubmission.count({
      where: { paymentStatus: 'completed' }
    })

    const recentSubmissions = await prisma.surveySubmission.findMany({
      select: {
        id: true,
        surveyType: true,
        country: true,
        paymentStatus: true,
        submittedAt: true,
        rewardAmount: true
      },
      orderBy: { submittedAt: 'desc' },
      take: 10
    })

    return NextResponse.json({
      stats,
      totalSubmissions,
      totalPaid,
      recentSubmissions
    })

  } catch (error) {
    console.error('Survey stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch survey statistics' },
      { status: 500 }
    )
  }
}