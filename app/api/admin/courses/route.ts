import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { AdminAuthorizationError, requireAdmin } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await requireAdmin()

    const courses = await prisma.courses.findMany({
      include: {
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

    // Calculate completion rates and enrollment counts
    const coursesWithStats = await Promise.all(
      courses.map(async (course) => {
        const enrollmentCount = course._count.user_progress
        const completedProgress = await prisma.user_progress.count({
          where: {
            courseId: course.id,
            completedAt: { not: null }
          }
        })

        const completionRate = enrollmentCount > 0
          ? Math.round((completedProgress / enrollmentCount) * 100)
          : 0

        return {
          ...course,
          enrollmentCount,
          completionRate,
          lessonCount: course._count.lessons
        }
      })
    )

    return NextResponse.json(coursesWithStats)
  } catch (error) {
    if (error instanceof AdminAuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error('Failed to fetch courses:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin()

    const data = await request.json()

    const course = await prisma.courses.create({
      data: {
        id: crypto.randomUUID(),
        title: data.title,
        description: data.description,
        shortDescription: data.shortDescription,
        duration: data.duration,
        difficulty: data.difficulty,
        category: data.category,
        isFreeTier: data.isFreeTier || false,
        price: data.price || null,
        featured: data.featured || false,
        published: data.published || false,
        thumbnailUrl: data.thumbnailUrl || null,
        instructorId: data.instructorId || null,
        prerequisites: data.prerequisites || null,
        learningOutcomes: data.learningOutcomes || '',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    return NextResponse.json(course)
  } catch (error) {
    if (error instanceof AdminAuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error('Failed to create course:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}