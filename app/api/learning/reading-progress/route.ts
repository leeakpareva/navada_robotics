import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { v4 as uuidv4 } from "uuid"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET - Fetch reading progress for a lesson
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const lessonId = searchParams.get("lessonId")

    if (!lessonId) {
      return NextResponse.json(
        { error: "Lesson ID is required" },
        { status: 400 }
      )
    }

    // Get user ID (handle admin user)
    const userId = session.user.id || session.user.email
    let actualUserId = userId

    if (session.user.email === "leeakpareva@gmail.com" && typeof userId === 'string' && userId.includes('@')) {
      const adminUser = await prisma.users.findUnique({
        where: { email: userId }
      })
      if (adminUser) {
        actualUserId = adminUser.id
      }
    }

    // Fetch reading progress
    const progress = await prisma.reading_progress.findUnique({
      where: {
        userId_lessonId: {
          userId: actualUserId,
          lessonId: lessonId
        }
      }
    })

    return NextResponse.json({
      success: true,
      progress: progress ? {
        scrollPosition: progress.scrollPosition,
        readingTime: progress.readingTime,
        lastReadAt: progress.lastReadAt
      } : null
    })

  } catch (error) {
    console.error("[Reading Progress API] Error fetching progress:", error)
    return NextResponse.json(
      { error: "Failed to fetch reading progress" },
      { status: 500 }
    )
  }
}

// POST - Save reading progress
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { lessonId, scrollPosition, readingTime } = body

    if (!lessonId || scrollPosition === undefined) {
      return NextResponse.json(
        { error: "Lesson ID and scroll position are required" },
        { status: 400 }
      )
    }

    // Get user ID (handle admin user)
    const userId = session.user.id || session.user.email
    let actualUserId = userId

    if (session.user.email === "leeakpareva@gmail.com" && typeof userId === 'string' && userId.includes('@')) {
      const adminUser = await prisma.users.findUnique({
        where: { email: userId }
      })
      if (adminUser) {
        actualUserId = adminUser.id
      }
    }

    // Upsert reading progress
    const progress = await prisma.reading_progress.upsert({
      where: {
        userId_lessonId: {
          userId: actualUserId,
          lessonId: lessonId
        }
      },
      update: {
        scrollPosition,
        readingTime: readingTime || 0,
        lastReadAt: new Date(),
        updatedAt: new Date()
      },
      create: {
        id: uuidv4(),
        userId: actualUserId,
        lessonId,
        scrollPosition,
        readingTime: readingTime || 0,
        lastReadAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      progress
    })

  } catch (error) {
    console.error("[Reading Progress API] Error saving progress:", error)
    return NextResponse.json(
      { error: "Failed to save reading progress" },
      { status: 500 }
    )
  }
}