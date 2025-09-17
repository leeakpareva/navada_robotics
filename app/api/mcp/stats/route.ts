import { NextResponse } from "next/server"
import { mcpServerManager } from "@/lib/mcp/server-manager"

export const runtime = 'edge'

export async function GET() {
  try {
    const servers = await mcpServerManager.getServers()
    const calls = await mcpServerManager.getCalls()

    const totalServers = servers.length
    const activeServers = servers.filter(s => s.status === 'active').length
    const totalCalls = servers.reduce((sum, server) => sum + server.totalCalls, 0)

    const totalSuccessRate = servers.reduce((sum, server) => sum + server.successRate, 0)
    const successRate = totalServers > 0 ? totalSuccessRate / totalServers : 100

    const totalResponseTime = servers.reduce((sum, server) => sum + (server.responseTime || 0), 0)
    const avgResponseTime = activeServers > 0 ? totalResponseTime / activeServers : 0

    const stats = {
      totalServers,
      activeServers,
      totalCalls,
      successRate: Math.round(successRate * 10) / 10,
      avgResponseTime: Math.round(avgResponseTime)
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching MCP stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch MCP stats" },
      { status: 500 }
    )
  }
}
