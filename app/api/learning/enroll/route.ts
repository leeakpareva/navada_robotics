import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { v4 as uuidv4 } from "uuid"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST - Enroll in a course
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required to enroll in courses" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { courseId } = body

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      )
    }

    // Check if course exists and is published
    const course = await prisma.courses.findUnique({
      where: { id: courseId },
      include: {
        lessons: true
      }
    })

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      )
    }

    if (!course.published) {
      return NextResponse.json(
        { error: "Course is not available for enrollment" },
        { status: 400 }
      )
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.user_progress.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: courseId
        }
      }
    })

    if (existingEnrollment) {
      return NextResponse.json(
        { error: "Already enrolled in this course" },
        { status: 400 }
      )
    }

    // Check if user has access (free tier or paid subscription)
    if (!course.isFreeTier) {
      const subscription = await prisma.subscriptions.findUnique({
        where: { userId: session.user.id }
      })

      if (!subscription || subscription.status !== "active" || subscription.tier !== "premium") {
        return NextResponse.json(
          { error: "Premium subscription required for this course" },
          { status: 403 }
        )
      }
    }

    // Create enrollment with progress tracking
    const enrollment = await prisma.$transaction(async (tx) => {
      // Create user progress record
      const userProgress = await tx.user_progress.create({
        data: {
          id: uuidv4(),
          userId: session.user.id,
          courseId: courseId,
          totalLessons: course.lessons.length,
          enrolledAt: new Date(),
          lastAccessedAt: new Date()
        }
      })

      // Create lesson progress records for each lesson
      if (course.lessons.length > 0) {
        const lessonProgressData = course.lessons.map(lesson => ({
          id: uuidv4(),
          userProgressId: userProgress.id,
          lessonId: lesson.id,
          completed: false,
          timeSpent: 0
        }))

        await tx.lesson_progress.createMany({
          data: lessonProgressData
        })
      }

      // Track enrollment analytics
      await tx.learning_analytics.create({
        data: {
          id: uuidv4(),
          userId: session.user.id,
          courseId: courseId,
          eventType: "course_enrollment",
          eventData: JSON.stringify({
            courseTitle: course.title,
            courseDifficulty: course.difficulty,
            courseCategory: course.category
          }),
          timestamp: new Date()
        }
      })

      return userProgress
    })

    console.log(`[Enrollment] User ${session.user.id} enrolled in course ${courseId}`)

    return NextResponse.json({
      success: true,
      enrollment,
      message: "Successfully enrolled in course"
    })

  } catch (error) {
    console.error("[Enrollment API] Error:", error)
    return NextResponse.json(
      { error: "Failed to enroll in course", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

// GET - Get user's enrolled courses
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const enrollments = await prisma.user_progress.findMany({
      where: { userId: session.user.id },
      include: {
        courses: {
          include: {
            lessons: true
          }
        },
        lesson_progress: true
      },
      orderBy: {
        lastAccessedAt: 'desc'
      }
    })

    const enrolledCourses = enrollments.map(enrollment => ({
      ...enrollment.courses,
      progress: {
        enrolledAt: enrollment.enrolledAt,
        lastAccessedAt: enrollment.lastAccessedAt,
        completedLessons: enrollment.completedLessons,
        totalLessons: enrollment.totalLessons,
        progressPercentage: enrollment.progressPercentage,
        completedAt: enrollment.completedAt,
        certificateEarned: enrollment.certificateEarned
      }
    }))

    return NextResponse.json({
      courses: enrolledCourses
    })

  } catch (error) {
    console.error("[Enrollment API] Error fetching enrollments:", error)
    return NextResponse.json(
      { error: "Failed to fetch enrolled courses" },
      { status: 500 }
    )
  }
}