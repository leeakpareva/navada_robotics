import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email, source } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Valid email address is required' },
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

    // Check if email already exists
    const existingSubscriber = await prisma.emailSubscriber.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return NextResponse.json(
          { message: 'Email already subscribed!' },
          { status: 200 }
        )
      } else {
        // Reactivate inactive subscription
        await prisma.emailSubscriber.update({
          where: { email: email.toLowerCase() },
          data: { isActive: true, subscribedAt: new Date() }
        })
        return NextResponse.json(
          { message: 'Welcome back! Your subscription has been reactivated.' },
          { status: 200 }
        )
      }
    }

    // Create new subscriber
    const newSubscriber = await prisma.emailSubscriber.create({
      data: {
        email: email.toLowerCase(),
        source: source || 'unknown',
        isActive: true
      }
    })

    console.log(`New email subscriber: ${newSubscriber.email} from ${newSubscriber.source}`)

    return NextResponse.json(
      {
        message: 'Successfully subscribed! Thank you for joining us.',
        id: newSubscriber.id
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Email subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again later.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Get subscription statistics (safe to expose)
    const stats = await prisma.emailSubscriber.aggregate({
      where: { isActive: true },
      _count: { id: true }
    })

    return NextResponse.json({
      totalActiveSubscribers: stats._count.id,
      message: 'Email subscription service is active'
    })

  } catch (error) {
    console.error('Email stats error:', error)
    return NextResponse.json(
      { error: 'Failed to get subscription stats' },
      { status: 500 }
    )
  }
}