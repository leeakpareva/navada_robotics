import { NextRequest, NextResponse } from 'next/server';
import { mcpClient } from '@/lib/mcp/client';

export async function GET(request: NextRequest) {
  try {
    const servers = mcpClient.getAllServers();
    const activeServers = mcpClient.getActiveServers();
    const usageStats = mcpClient.getUsageStats();

    const stats = {
      totalServers: servers.length,
      activeServers: activeServers.length,
      totalCalls: usageStats.totalCalls,
      successRate: usageStats.totalCalls > 0
        ? Math.round((usageStats.successfulCalls / usageStats.totalCalls) * 100)
        : 0,
      avgResponseTime: Math.round(usageStats.averageResponseTime),
      toolUsage: usageStats.toolUsage,
      serverHealth: servers.map(server => ({
        serverId: server.id,
        name: server.name,
        status: server.status,
        lastCheck: server.lastHealthCheck?.toISOString(),
        uptime: server.status === 'active' ? 100 : 0 // Simplified uptime calculation
      }))
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('MCP Stats API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch MCP statistics' },
      { status: 500 }
    );
  }
}