import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from database
    const user = await prisma.users.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Fetch chat sessions for this user
    const chatSessions = await prisma.chatSession.findMany({
      where: { userId: user.id },
      orderBy: { lastActivity: 'desc' },
      select: {
        id: true,
        threadId: true,
        messageCount: true,
        lastActivity: true,
        status: true,
        startTime: true,
      }
    })

    return NextResponse.json(chatSessions)
  } catch (error) {
    console.error('Failed to fetch chat sessions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}