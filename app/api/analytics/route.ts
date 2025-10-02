import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    // Get current timestamp for time-based calculations
    const now = new Date()
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Fetch basic overview data
    const [
      totalUsers,
      newUsers,
      totalContacts,
      recentContacts,
      totalSubscribers,
      activeSubscribers
    ] = await Promise.all([
      // Total users
      prisma.user.count(),

      // New users (last 7 days)
      prisma.user.count({
        where: {
          createdAt: {
            gte: last7Days
          }
        }
      }),

      // Total contact submissions
      prisma.contactSubmission.count(),

      // Recent contact submissions (last 24 hours)
      prisma.contactSubmission.count({
        where: {
          createdAt: {
            gte: last24Hours
          }
        }
      }),

      // Total email subscribers
      prisma.emailSubscriber.count(),

      // Active email subscribers
      prisma.emailSubscriber.count({
        where: {
          isActive: true
        }
      })
    ])

    // Calculate daily data for the last 7 days
    const dailyData = []
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      dayStart.setHours(0, 0, 0, 0)
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000)

      const newUsersCount = await prisma.user.count({
        where: {
          createdAt: {
            gte: dayStart,
            lt: dayEnd
          }
        }
      })

      dailyData.push({
        date: dayStart.toLocaleDateString('en-US', { weekday: 'short' }),
        users: newUsersCount
      })
    }

    // Get recent activity
    const recentActivity = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        lastLoginAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })

    // Mock satisfaction data for demo purposes
    const satisfaction = {
      excellent: 45,
      good: 35,
      fair: 15,
      poor: 5
    }

    const analyticsData = {
      overview: {
        totalUsers,
        newUsers,
        totalContacts,
        recentContacts,
        totalSubscribers,
        activeSubscribers,
        growthRate: newUsers > 0 ? ((newUsers / Math.max(totalUsers - newUsers, 1)) * 100).toFixed(1) : '0'
      },
      usage: {
        dailyData,
        peakDay: dailyData.reduce((max, current) =>
          current.users > max.users ? current : max,
          dailyData[0]
        )?.date || 'N/A'
      },
      satisfaction,
      recentActivity: recentActivity.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name || 'Anonymous',
        joined: user.createdAt.toLocaleDateString(),
        lastLogin: user.lastLoginAt?.toLocaleDateString() || 'Never'
      }))
    }

    return NextResponse.json(analyticsData)

  } catch (error) {
    console.error('Analytics API Error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch analytics data',
        // Return empty data structure to prevent frontend errors
        overview: {
          totalUsers: 0,
          newUsers: 0,
          totalContacts: 0,
          recentContacts: 0,
          totalSubscribers: 0,
          activeSubscribers: 0,
          growthRate: '0'
        },
        usage: {
          dailyData: [],
          peakDay: 'N/A'
        },
        satisfaction: {
          excellent: 0,
          good: 0,
          fair: 0,
          poor: 0
        },
        recentActivity: []
      },
      { status: 200 } // Return 200 to prevent breaking the app
    )
  } finally {
    await prisma.$disconnect()
  }
}