import { NextRequest, NextResponse } from "next/server"

// Load chat history function inline to avoid build issues
async function loadChatHistory(threadId: string) {
  try {
    const { DatabaseAnalytics } = await import("@/lib/database-analytics")
    const history = await DatabaseAnalytics.getChatHistory(threadId)
    if (history && history.messages.length > 0) {
      console.log(`[Agent Lee] Loaded ${history.messages.length} previous messages for thread ${threadId}`)
      return history.messages.map(msg => ({
        id: parseInt(msg.id) || Date.now(),
        text: msg.content,
        sender: msg.role === 'user' ? 'user' : 'agent',
        timestamp: msg.timestamp,
        image: msg.imageData || undefined,
        website: msg.websiteData || undefined
      }))
    }
    return null
  } catch (error) {
    console.error('[Agent Lee] Error loading chat history:', error)
    return null
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { threadId: string } }
) {
  try {
    const { threadId } = params

    if (!threadId) {
      return NextResponse.json(
        { error: "Thread ID is required" },
        { status: 400 }
      )
    }

    const history = await loadChatHistory(threadId)

    if (!history) {
      return NextResponse.json([])
    }

    return NextResponse.json(history)
  } catch (error) {
    console.error("[Agent Lee History] Error loading chat history:", error)
    return NextResponse.json(
      { error: "Failed to load chat history" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { threadId: string } }
) {
  try {
    const { threadId } = params

    if (!threadId) {
      return NextResponse.json(
        { error: "Thread ID is required" },
        { status: 400 }
      )
    }

    // Import DatabaseAnalytics dynamically
    const { DatabaseAnalytics } = await import("@/lib/database-analytics")
    const history = await DatabaseAnalytics.getChatHistory(threadId)

    if (history?.session) {
      // Import prisma directly
      const { prisma } = await import("@/lib/database-analytics")

      // Delete all messages for this thread
      await prisma.chatMessage.deleteMany({
        where: { threadId }
      })

      // Delete session analytics
      await prisma.sessionAnalytics.deleteMany({
        where: { sessionId: history.session.id }
      })

      // Delete the session
      await prisma.chatSession.delete({
        where: { id: history.session.id }
      })

      console.log(`[Agent Lee History] Cleared history for thread ${threadId}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Agent Lee History] Error clearing chat history:", error)
    return NextResponse.json(
      { error: "Failed to clear chat history" },
      { status: 500 }
    )
  }
}