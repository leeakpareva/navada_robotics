import { NextRequest, NextResponse } from 'next/server'
import { sendEventRegistrationConfirmation } from '@/lib/email-service'

export async function POST(request: NextRequest) {
  try {
    // Dynamic import to avoid build-time issues
    const { prisma } = await import('@/lib/prisma')
    const data = await request.json()

    const {
      eventId,
      eventName,
      name,
      email,
      phone,
      company,
      jobTitle,
      interests,
      source
    } = data

    // Validate required fields
    if (!eventId || !eventName || !name || !email) {
      return NextResponse.json(
        { error: 'Event ID, event name, name, and email are required' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Check if already registered for this event
    const existingRegistration = await prisma.eventRegistration.findFirst({
      where: {
        eventId: eventId,
        email: email.toLowerCase()
      }
    })

    if (existingRegistration) {
      if (existingRegistration.status === 'cancelled') {
        // Reactivate cancelled registration
        const updatedRegistration = await prisma.eventRegistration.update({
          where: { id: existingRegistration.id },
          data: {
            status: 'registered',
            name: name,
            phone: phone || existingRegistration.phone,
            company: company || existingRegistration.company,
            jobTitle: jobTitle || existingRegistration.jobTitle,
            interests: interests || existingRegistration.interests,
            updatedAt: new Date()
          }
        })

        // Send confirmation email for reactivated registration
        try {
          await sendEventRegistrationConfirmation({
            name: updatedRegistration.name,
            email: updatedRegistration.email,
            eventName: updatedRegistration.eventName,
            eventId: updatedRegistration.eventId,
            phone: updatedRegistration.phone || undefined,
            company: updatedRegistration.company || undefined,
            jobTitle: updatedRegistration.jobTitle || undefined
          })
        } catch (emailError) {
          console.warn('Failed to send reactivation email:', emailError)
        }

        return NextResponse.json(
          { message: 'Welcome back! Your registration has been reactivated. Check your email for confirmation.' },
          { status: 200 }
        )
      } else {
        return NextResponse.json(
          { message: 'You are already registered for this event!' },
          { status: 200 }
        )
      }
    }

    // Create new registration
    const newRegistration = await prisma.eventRegistration.create({
      data: {
        eventId,
        eventName,
        name,
        email: email.toLowerCase(),
        phone: phone || null,
        company: company || null,
        jobTitle: jobTitle || null,
        interests: interests || null,
        source: source || 'unknown',
        status: 'registered'
      }
    })

    console.log(`New event registration: ${newRegistration.email} for ${newRegistration.eventName}`)

    // Send confirmation email
    try {
      const emailResult = await sendEventRegistrationConfirmation({
        name: newRegistration.name,
        email: newRegistration.email,
        eventName: newRegistration.eventName,
        eventId: newRegistration.eventId,
        phone: newRegistration.phone || undefined,
        company: newRegistration.company || undefined,
        jobTitle: newRegistration.jobTitle || undefined
      })

      if (!emailResult.success) {
        console.warn('Failed to send confirmation email:', emailResult.error)
        // Continue with registration success even if email fails
      } else {
        console.log(`Confirmation email sent to ${newRegistration.email}`)
      }
    } catch (emailError) {
      console.warn('Email service error:', emailError)
      // Continue with registration success even if email fails
    }

    return NextResponse.json(
      {
        message: 'Registration successful! You will receive a confirmation email shortly.',
        registrationId: newRegistration.id
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Event registration error:', error)
    return NextResponse.json(
      { error: 'Failed to register for event. Please try again later.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Dynamic import to avoid build-time issues
    const { prisma } = await import('@/lib/prisma')

    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('eventId')

    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      )
    }

    // Get registration statistics (safe to expose)
    const stats = await prisma.eventRegistration.aggregate({
      where: {
        eventId: eventId,
        status: { in: ['registered', 'confirmed'] }
      },
      _count: { id: true }
    })

    return NextResponse.json({
      eventId,
      totalRegistrations: stats._count.id,
      message: 'Event registration service is active'
    })

  } catch (error) {
    console.error('Event stats error:', error)
    return NextResponse.json(
      { error: 'Failed to get registration stats' },
      { status: 500 }
    )
  }
}