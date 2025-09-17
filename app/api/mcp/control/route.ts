import { NextRequest, NextResponse } from 'next/server'
import { mcpServerManager } from '@/lib/mcp/server-manager'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const { serverId, action } = await request.json()

    console.log(`MCP Server Control: ${action} server ${serverId}`)

    let success = false
    let message = ''

    if (action === 'start') {
      success = await mcpServerManager.startServer(serverId)
      message = success
        ? `${serverId} server started successfully`
        : `Failed to start ${serverId} server`
    } else if (action === 'stop') {
      success = await mcpServerManager.stopServer(serverId)
      message = success
        ? `${serverId} server stopped successfully`
        : `Failed to stop ${serverId} server`
    } else {
      return NextResponse.json({
        success: false,
        message: 'Invalid action. Use "start" or "stop"'
      }, { status: 400 })
    }

    return NextResponse.json({
      success,
      message,
      serverId
    })

  } catch (error) {
    console.error('MCP control error:', error)
    return NextResponse.json(
      { error: 'Failed to control MCP server' },
      { status: 500 }
    )
  }
}