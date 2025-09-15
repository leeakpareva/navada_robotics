import { NextResponse } from "next/server"
import { mcpServerManager } from "@/lib/mcp/server-manager"

export async function GET() {
  try {
    const servers = await mcpServerManager.getServers()
    return NextResponse.json({ servers })
  } catch (error) {
    console.error("Error fetching MCP servers:", error)
    return NextResponse.json(
      { error: "Failed to fetch MCP servers" },
      { status: 500 }
    )
  }
}