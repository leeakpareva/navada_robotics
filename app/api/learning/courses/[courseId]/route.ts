import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET - Fetch a single course
export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const course = await prisma.courses.findUnique({
      where: { id: params.courseId },
      include: {
        lessons: {
          orderBy: {
            orderIndex: 'asc'
          }
        },
        user_progress: {
          include: {
            lesson_progress: true
          }
        }
      }
    })

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      )
    }

    // Parse quiz and image data from lesson resources
    const enhancedCourse = {
      ...course,
      lessons: course.lessons.map(lesson => {
        let quiz = []
        let images = []
        let originalResources = []

        if (lesson.resources) {
          try {
            const parsedResources = JSON.parse(lesson.resources)
            if (typeof parsedResources === 'object') {
              quiz = parsedResources.quiz || []
              images = parsedResources.images || []
              originalResources = parsedResources.originalResources || []
            } else {
              // Fallback for old format
              originalResources = [parsedResources]
            }
          } catch (error) {
            console.warn("Failed to parse lesson resources:", error)
            originalResources = lesson.resources ? [lesson.resources] : []
          }
        }

        return {
          ...lesson,
          quiz,
          images,
          resources: originalResources
        }
      })
    }

    return NextResponse.json({ course: enhancedCourse })
  } catch (error) {
    console.error("[Course API] Error fetching course:", error)
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    )
  }
}

// PATCH - Update a course
export async function PATCH(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    // Check authentication - only admin can update courses
    const session = await getServerSession()
    if (!session || session.user?.email !== "leeakpareva@gmail.com") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 }
      )
    }

    const body = await request.json()

    const updatedCourse = await prisma.courses.update({
      where: { id: params.courseId },
      data: {
        ...body,
        updatedAt: new Date()
      }
    })

    console.log("[Course API] Course updated:", params.courseId)

    return NextResponse.json({
      success: true,
      course: updatedCourse
    })
  } catch (error) {
    console.error("[Course API] Error updating course:", error)
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    )
  }
}

// DELETE - Delete a course
export async function DELETE(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    // Check authentication - only admin can delete courses
    const session = await getServerSession()
    if (!session || session.user?.email !== "leeakpareva@gmail.com") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 }
      )
    }

    // Delete course and all related data (cascading delete)
    await prisma.courses.delete({
      where: { id: params.courseId }
    })

    console.log("[Course API] Course deleted:", params.courseId)

    return NextResponse.json({
      success: true,
      message: "Course deleted successfully"
    })
  } catch (error) {
    console.error("[Course API] Error deleting course:", error)
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 }
    )
  }
}