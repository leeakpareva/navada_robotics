import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { v4 as uuidv4 } from "uuid"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST - Update lesson progress
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    // Use email as fallback identifier for admin user
    const userId = session.user.id || session.user.email
    if (!userId) {
      return NextResponse.json(
        { error: "User identification required" },
        { status: 401 }
      )
    }

    // For admin user, find user by email if no direct ID
    let actualUserId = userId
    if (session.user.email === "leeakpareva@gmail.com" && typeof userId === 'string' && userId.includes('@')) {
      const adminUser = await prisma.users.findUnique({
        where: { email: userId }
      })
      if (adminUser) {
        actualUserId = adminUser.id
      }
    }

    const body = await request.json()
    const { courseId, lessonId, completed, timeSpent } = body

    if (!courseId || !lessonId) {
      return NextResponse.json(
        { error: "Course ID and Lesson ID are required" },
        { status: 400 }
      )
    }

    // Get user progress for the course
    const userProgress = await prisma.user_progress.findUnique({
      where: {
        userId_courseId: {
          userId: actualUserId,
          courseId: courseId
        }
      },
      include: {
        lesson_progress: true
      }
    })

    if (!userProgress) {
      return NextResponse.json(
        { error: "Not enrolled in this course" },
        { status: 403 }
      )
    }

    // Update lesson progress
    const lessonProgress = await prisma.lesson_progress.upsert({
      where: {
        userProgressId_lessonId: {
          userProgressId: userProgress.id,
          lessonId: lessonId
        }
      },
      update: {
        completed: completed !== undefined ? completed : true,
        completedAt: completed ? new Date() : null,
        timeSpent: {
          increment: timeSpent || 0
        }
      },
      create: {
        id: uuidv4(),
        userProgressId: userProgress.id,
        lessonId: lessonId,
        completed: completed !== undefined ? completed : true,
        completedAt: completed ? new Date() : null,
        timeSpent: timeSpent || 0
      }
    })

    // Update overall course progress
    const completedLessons = await prisma.lesson_progress.count({
      where: {
        userProgressId: userProgress.id,
        completed: true
      }
    })

    const progressPercentage = Math.round((completedLessons / userProgress.totalLessons) * 100)
    const isCompleted = completedLessons === userProgress.totalLessons

    await prisma.user_progress.update({
      where: { id: userProgress.id },
      data: {
        completedLessons,
        progressPercentage,
        lastAccessedAt: new Date(),
        completedAt: isCompleted ? new Date() : null,
        certificateEarned: isCompleted
      }
    })

    // Track analytics
    await prisma.learning_analytics.create({
      data: {
        id: uuidv4(),
        userId: actualUserId,
        courseId: courseId,
        eventType: completed ? "lesson_complete" : "lesson_progress",
        eventData: JSON.stringify({
          lessonId,
          timeSpent,
          progressPercentage
        }),
        timeSpent: timeSpent || 0,
        timestamp: new Date()
      }
    })

    // Generate certificate if course is completed
    if (isCompleted) {
      const existingCertificate = await prisma.certificates.findUnique({
        where: {
          courseId_userId: {
            courseId: courseId,
            userId: actualUserId
          }
        }
      })

      if (!existingCertificate) {
        await prisma.certificates.create({
          data: {
            id: uuidv4(),
            courseId: courseId,
            userId: actualUserId,
            template: "default",
            badgeData: JSON.stringify({
              completedAt: new Date(),
              totalTimeSpent: timeSpent
            }),
            issuedAt: new Date(),
            isActive: true
          }
        })
      }
    }

    console.log(`[Progress] User ${actualUserId} updated progress for lesson ${lessonId}`)

    return NextResponse.json({
      success: true,
      lessonProgress,
      courseProgress: {
        completedLessons,
        totalLessons: userProgress.totalLessons,
        progressPercentage,
        isCompleted
      }
    })

  } catch (error) {
    console.error("[Progress API] Error:", error)
    return NextResponse.json(
      { error: "Failed to update progress", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

// GET - Get course progress
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    // Use email as fallback identifier for admin user
    const userId = session.user.id || session.user.email
    if (!userId) {
      return NextResponse.json(
        { error: "User identification required" },
        { status: 401 }
      )
    }

    // For admin user, find user by email if no direct ID
    let actualUserId = userId
    if (session.user.email === "leeakpareva@gmail.com" && typeof userId === 'string' && userId.includes('@')) {
      const adminUser = await prisma.users.findUnique({
        where: { email: userId }
      })
      if (adminUser) {
        actualUserId = adminUser.id
      }
    }

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get("courseId")

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      )
    }

    const userProgress = await prisma.user_progress.findUnique({
      where: {
        userId_courseId: {
          userId: actualUserId,
          courseId: courseId
        }
      },
      include: {
        lesson_progress: {
          include: {
            lessons: true
          }
        },
        courses: true
      }
    })

    if (!userProgress) {
      return NextResponse.json(
        { error: "No progress found for this course" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      progress: userProgress
    })

  } catch (error) {
    console.error("[Progress API] Error fetching progress:", error)
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    )
  }
}