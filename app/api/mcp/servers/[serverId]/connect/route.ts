import { NextRequest, NextResponse } from 'next/server';
import { mcpClient } from '@/lib/mcp/client';

export async function POST(
  request: NextRequest,
  { params }: { params: { serverId: string } }
) {
  try {
    const { serverId } = params;

    console.log(`[MCP API] Attempting to connect to server: ${serverId}`);

    const success = await mcpClient.connectServer(serverId);

    if (success) {
      return NextResponse.json({
        success: true,
        message: `Successfully connected to ${serverId}`
      });
    } else {
      return NextResponse.json(
        { error: `Failed to connect to ${serverId}` },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error(`[MCP API] Connect error for ${params.serverId}:`, error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to connect to server',
        serverId: params.serverId
      },
      { status: 500 }
    );
  }
}