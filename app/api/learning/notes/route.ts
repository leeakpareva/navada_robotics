import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET - Fetch user notes for a lesson
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
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

    // Fetch notes for the lesson
    const notes = await prisma.notes.findMany({
      where: {
        userId: actualUserId,
        lessonId: lessonId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Fetch bookmarks for the lesson
    const bookmarks = await prisma.bookmarks.findMany({
      where: {
        userId: actualUserId,
        lessonId: lessonId
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    return NextResponse.json({
      success: true,
      notes,
      bookmarks
    })

  } catch (error) {
    console.error("[Notes API] Error fetching notes:", error)
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    )
  }
}

// POST - Create a new note or bookmark
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { type, lessonId, content, title } = body

    if (!type || !lessonId) {
      return NextResponse.json(
        { error: "Type and lesson ID are required" },
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

    if (type === 'note') {
      // Create a note
      if (!content) {
        return NextResponse.json(
          { error: "Content is required for notes" },
          { status: 400 }
        )
      }

      const note = await prisma.notes.create({
        data: {
          userId: actualUserId,
          lessonId,
          content
        }
      })

      return NextResponse.json({
        success: true,
        note
      })

    } else if (type === 'bookmark') {
      // Create a bookmark
      if (!content) {
        return NextResponse.json(
          { error: "Content is required for bookmarks" },
          { status: 400 }
        )
      }

      const bookmark = await prisma.bookmarks.create({
        data: {
          userId: actualUserId,
          lessonId,
          content: title || content
        }
      })

      return NextResponse.json({
        success: true,
        bookmark
      })
    }

    return NextResponse.json(
      { error: "Invalid type. Must be 'note' or 'bookmark'" },
      { status: 400 }
    )

  } catch (error) {
    console.error("[Notes API] Error creating note/bookmark:", error)
    return NextResponse.json(
      { error: "Failed to create note/bookmark" },
      { status: 500 }
    )
  }
}

// DELETE - Delete a note or bookmark
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const id = searchParams.get("id")

    if (!type || !id) {
      return NextResponse.json(
        { error: "Type and ID are required" },
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

    if (type === 'note') {
      await prisma.notes.delete({
        where: {
          id: id,
          userId: actualUserId
        }
      })
    } else if (type === 'bookmark') {
      await prisma.bookmarks.delete({
        where: {
          id: id,
          userId: actualUserId
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: `${type} deleted successfully`
    })

  } catch (error) {
    console.error("[Notes API] Error deleting note/bookmark:", error)
    return NextResponse.json(
      { error: "Failed to delete note/bookmark" },
      { status: 500 }
    )
  }
}