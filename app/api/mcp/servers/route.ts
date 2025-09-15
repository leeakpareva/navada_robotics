import { NextRequest, NextResponse } from 'next/server';
import { mcpClient } from '@/lib/mcp/client';

export async function GET(request: NextRequest) {
  try {
    const servers = mcpClient.getAllServers();
    const stats = mcpClient.getUsageStats();

    // Format servers for the dashboard
    const formattedServers = servers.map(server => ({
      id: server.id,
      name: server.name,
      description: server.description,
      status: server.status,
      category: server.category,
      requiresApiKey: server.requiresApiKey,
      tools: server.tools.map(tool => ({
        name: tool.name,
        description: tool.description,
        enabled: tool.enabled,
        usageCount: tool.usageCount || 0
      })),
      lastHealthCheck: server.lastHealthCheck?.toISOString(),
      responseTime: undefined // This would come from recent calls
    }));

    return NextResponse.json({
      servers: formattedServers,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('MCP Servers API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch MCP servers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    switch (action) {
      case 'refresh_all':
        // Refresh all server connections
        await mcpClient.healthCheck();
        break;

      default:
        return NextResponse.json(
          { error: 'Unknown action' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('MCP Servers Action Error:', error);
    return NextResponse.json(
      { error: 'Failed to execute action' },
      { status: 500 }
    );
  }
}