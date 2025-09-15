import { NextRequest, NextResponse } from "next/server"
import { endSession } from "@/lib/agent-lee-helpers"

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