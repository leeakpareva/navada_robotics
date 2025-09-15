import { NextRequest, NextResponse } from 'next/server';
import { mcpClient } from '@/lib/mcp/client';

export async function POST(
  request: NextRequest,
  { params }: { params: { serverId: string } }
) {
  try {
    const { serverId } = params;

    console.log(`[MCP API] Attempting to disconnect from server: ${serverId}`);

    await mcpClient.disconnectServer(serverId);

    return NextResponse.json({
      success: true,
      message: `Successfully disconnected from ${serverId}`
    });

  } catch (error) {
    console.error(`[MCP API] Disconnect error for ${params.serverId}:`, error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to disconnect from server',
        serverId: params.serverId
      },
      { status: 500 }
    );
  }
}