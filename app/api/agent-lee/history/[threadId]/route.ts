import { NextRequest, NextResponse } from "next/server"
import { loadChatHistory, endSession } from "@/lib/agent-lee-helpers"
import { DatabaseAnalytics } from "@/lib/database-analytics"

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

    // Get the session first
    const history = await DatabaseAnalytics.getChatHistory(threadId)

    if (history?.session) {
      // Delete all messages for this thread
      await DatabaseAnalytics.prisma.chatMessage.deleteMany({
        where: { threadId }
      })

      // Delete session analytics
      await DatabaseAnalytics.prisma.sessionAnalytics.deleteMany({
        where: { sessionId: history.session.id }
      })

      // Delete the session
      await DatabaseAnalytics.prisma.chatSession.delete({
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