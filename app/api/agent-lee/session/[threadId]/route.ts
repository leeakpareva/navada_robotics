import { NextRequest, NextResponse } from "next/server"

// Import the function inline to avoid build issues
async function endSession(threadId: string) {
  try {
    const { DatabaseAnalytics } = await import("@/lib/database-analytics")
    await DatabaseAnalytics.endChatSession(threadId)
    console.log(`[Agent Lee] Ended session for thread ${threadId}`)
  } catch (error) {
    console.error('[Agent Lee] Error ending session:', error)
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

    const { DatabaseAnalytics } = await import("@/lib/database-analytics")
    const history = await DatabaseAnalytics.getChatHistory(threadId)

    return NextResponse.json({
      threadId,
      exists: !!history,
      messageCount: history?.messages.length || 0,
      status: history?.session.status || 'not_found'
    })
  } catch (error) {
    console.error("[Agent Lee Session] Error getting session:", error)
    return NextResponse.json(
      { error: "Failed to get session" },
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

    await endSession(threadId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Agent Lee Session] Error ending session:", error)
    return NextResponse.json(
      { error: "Failed to end session" },
      { status: 500 }
    )
  }
}