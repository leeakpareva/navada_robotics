import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Simple admin authentication (you can enhance this)
    const authHeader = request.headers.get('authorization')
    const adminKey = process.env.EMAIL_ADMIN_KEY || 'admin123' // Set this in your .env.local

    if (!authHeader || authHeader !== `Bearer ${adminKey}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Dynamic import to avoid build-time issues
    const { prisma } = await import('@/lib/prisma')

    // Get all email subscribers
    const subscribers = await prisma.emailSubscriber.findMany({
      orderBy: { subscribedAt: 'desc' },
      select: {
        id: true,
        email: true,
        source: true,
        subscribedAt: true,
        isActive: true
      }
    })

    // Get statistics
    const stats = await prisma.emailSubscriber.aggregate({
      _count: {
        id: true
      },
      where: { isActive: true }
    })

    const totalSubscribers = await prisma.emailSubscriber.count()

    return NextResponse.json({
      subscribers,
      statistics: {
        total: totalSubscribers,
        active: stats._count.id,
        inactive: totalSubscribers - stats._count.id
      }
    })

  } catch (error) {
    console.error('Email admin error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch email data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Authentication check
    const authHeader = request.headers.get('authorization')
    const adminKey = process.env.EMAIL_ADMIN_KEY || 'admin123'

    if (!authHeader || authHeader !== `Bearer ${adminKey}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Dynamic import to avoid build-time issues
    const { prisma } = await import('@/lib/prisma')

    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      )
    }

    // Deactivate subscriber (soft delete)
    const updated = await prisma.emailSubscriber.update({
      where: { email: email.toLowerCase() },
      data: { isActive: false }
    })

    return NextResponse.json({
      message: `Subscriber ${updated.email} has been deactivated`,
      email: updated.email
    })

  } catch (error) {
    console.error('Email deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to deactivate subscriber' },
      { status: 500 }
    )
  }
}