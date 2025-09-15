import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Check authentication - only admin can view analytics
    const session = await getServerSession()
    if (!session || session.user?.email !== "leeakpareva@gmail.com") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 }
      )
    }

    // Fetch analytics data
    const [
      totalStudents,
      totalCourses,
      completedCourses,
      paidSubscriptions,
      allProgress
    ] = await Promise.all([
      prisma.user_progress.count(),
      prisma.courses.count(),
      prisma.user_progress.count({
        where: { completedAt: { not: null } }
      }),
      prisma.subscriptions.count({
        where: {
          tier: "premium",
          status: "active"
        }
      }),
      prisma.user_progress.findMany({
        select: {
          progressPercentage: true
        }
      })
    ])

    // Calculate average completion rate
    const completionRate = allProgress.length > 0
      ? Math.round(allProgress.reduce((sum, p) => sum + p.progressPercentage, 0) / allProgress.length)
      : 0

    // Calculate revenue (mock data for now)
    const avgCoursePrice = 49.99
    const totalRevenue = paidSubscriptions * avgCoursePrice

    // Calculate average rating (mock data for now)
    const avgRating = 4.6

    return NextResponse.json({
      totalStudents,
      totalCourses,
      completedCourses,
      totalRevenue: totalRevenue.toFixed(2),
      completionRate,
      avgRating,
      paidSubscriptions,
      freeUsers: totalStudents - paidSubscriptions
    })
  } catch (error) {
    console.error("[Analytics API] Error fetching analytics:", error)
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    )
  }
}