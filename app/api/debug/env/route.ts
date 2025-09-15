import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL ? 'Present' : 'Missing',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Present' : 'Missing',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'Missing',
      VERCEL: process.env.VERCEL ? 'Yes' : 'No',
      VERCEL_ENV: process.env.VERCEL_ENV || 'Not set',
    }

    return NextResponse.json({
      status: 'Environment check',
      environment: envCheck,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Environment check error:', error)
    return NextResponse.json(
      { error: 'Environment check failed', details: error },
      { status: 500 }
    )
  }
}