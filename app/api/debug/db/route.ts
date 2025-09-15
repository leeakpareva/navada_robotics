import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Simple database connection test
    await prisma.$connect()

    // Test a simple query
    const userCount = await prisma.users.count()

    await prisma.$disconnect()

    return NextResponse.json({
      status: 'Database connection successful',
      userCount,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Database connection error:', error)

    return NextResponse.json(
      {
        status: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}