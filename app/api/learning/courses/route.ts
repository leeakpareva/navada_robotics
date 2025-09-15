import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { v4 as uuidv4 } from "uuid"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET - Fetch all courses
export async function GET(request: NextRequest) {
  try {
    const courses = await prisma.courses.findMany({
      include: {
        lessons: {
          orderBy: {
            orderIndex: 'asc'
          }
        },
        _count: {
          select: {
            user_progress: true,
            lessons: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      courses: courses.map(course => ({
        id: course.id,
        title: course.title,
        description: course.description,
        shortDescription: course.shortDescription,
        duration: course.duration,
        difficulty: course.difficulty,
        category: course.category,
        isFreeTier: course.isFreeTier,
        prerequisites: course.prerequisites,
        learningOutcomes: course.learningOutcomes,
        price: course.price,
        featured: course.featured,
        published: course.published,
        thumbnailUrl: course.thumbnailUrl,
        lessons: course._count.lessons,
        studentCount: course._count.user_progress,
        lessonCount: course._count.lessons
      }))
    })
  } catch (error) {
    console.error("[Courses API] Error fetching courses:", error)
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    )
  }
}

// POST - Create a new course
export async function POST(request: NextRequest) {
  try {
    // Check authentication - only admin can create courses
    const session = await getServerSession()
    if (!session || session.user?.email !== "leeakpareva@gmail.com") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      title,
      shortDescription,
      description,
      duration,
      difficulty,
      category,
      isFreeTier,
      prerequisites,
      learningOutcomes,
      price,
      featured,
      published,
      modules
    } = body

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      )
    }

    // Create course with lessons in a transaction
    const course = await prisma.$transaction(async (tx) => {
      // Create the course
      const newCourse = await tx.courses.create({
        data: {
          id: uuidv4(),
          title,
          shortDescription: shortDescription || description.substring(0, 150),
          description,
          duration: duration || "4 weeks",
          difficulty: difficulty || "Beginner",
          category: category || "General",
          isFreeTier: isFreeTier !== undefined ? isFreeTier : true,
          prerequisites: prerequisites || null,
          learningOutcomes: learningOutcomes || "",
          price: isFreeTier ? null : (price || null),
          featured: featured || false,
          published: published || false,
          updatedAt: new Date()
        }
      })

      // Create lessons if modules are provided
      if (modules && Array.isArray(modules) && modules.length > 0) {
        const lessonsData = modules.map((module: any, index: number) => {
          // Prepare enhanced resources that include quiz and images
          const enhancedResources = {
            quiz: module.quiz || [],
            images: module.images || [],
            originalResources: module.resources || []
          }

          return {
            id: uuidv4(),
            courseId: newCourse.id,
            title: module.title || `Lesson ${index + 1}`,
            description: module.description || null,
            content: module.content || "",
            orderIndex: module.orderIndex !== undefined ? module.orderIndex : index,
            duration: parseInt(module.duration) || 30, // Default 30 minutes
            lessonType: module.lessonType || "text",
            videoUrl: module.videoUrl || null,
            resources: JSON.stringify(enhancedResources), // Store quiz and images in resources
            published: published || false,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })

        await tx.lessons.createMany({
          data: lessonsData
        })
      }

      // Return the created course with lessons
      return await tx.courses.findUnique({
        where: { id: newCourse.id },
        include: {
          lessons: {
            orderBy: {
              orderIndex: 'asc'
            }
          }
        }
      })
    })

    console.log("[Courses API] Course created successfully:", course?.id)

    return NextResponse.json({
      success: true,
      course
    })

  } catch (error) {
    console.error("[Courses API] Error creating course:", error)
    return NextResponse.json(
      { error: "Failed to create course", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}