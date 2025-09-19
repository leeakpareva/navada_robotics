import { NextResponse } from "next/server"
import { RAGService } from "@/lib/rag-service"

export async function POST() {
  try {
    // Seed the knowledge base with initial robotics and AI content
    await RAGService.seedKnowledgeBase()

    const stats = await RAGService.getStats()

    return NextResponse.json({
      success: true,
      message: "Knowledge base initialized successfully",
      stats
    })
  } catch (error) {
    console.error("[Agent Lee Init] Error initializing knowledge base:", error)
    return NextResponse.json(
      { error: "Failed to initialize knowledge base" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const stats = await RAGService.getStats()
    const categories = await RAGService.getCategories()

    return NextResponse.json({
      stats,
      categories,
      ready: stats.totalEntries > 0
    })
  } catch (error) {
    console.error("[Agent Lee Init] Error getting knowledge base status:", error)
    return NextResponse.json(
      { error: "Failed to get knowledge base status" },
      { status: 500 }
    )
  }
}