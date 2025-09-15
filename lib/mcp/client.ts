// MCP Client for managing Model Context Protocol servers

import { MCPServer, MCPTool, MCPConnection, MCPToolCall, MCPToolResponse } from './types';

export class MCPClient {
  private servers: Map<string, MCPServer> = new Map();
  private connections: Map<string, MCPConnection> = new Map();
  private usageLogs: Array<{
    serverId: string;
    toolName: string;
    success: boolean;
    responseTime: number;
    timestamp: Date;
  }> = [];

  constructor() {
    this.initializeDefaultServers();
  }

  private initializeDefaultServers() {
    // Initialize with Brave Search server
    const braveSearchServer: MCPServer = {
      id: 'brave-search',
      name: 'Brave Search',
      description: 'Web search capabilities using Brave Search API',
      category: 'web_search',
      status: 'inactive',
      requiresApiKey: true,
      apiKeyName: 'BRAVE_SEARCH_API_KEY',
      tools: [
        {
          name: 'web_search',
          description: 'Search the web for information on any topic',
          parameters: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'The search query to execute'
              },
              count: {
                type: 'number',
                description: 'Number of results to return (default: 10, max: 20)',
                minimum: 1,
                maximum: 20
              },
              offset: {
                type: 'number',
                description: 'Offset for pagination (default: 0)',
                minimum: 0
              }
            },
            required: ['query']
          },
          enabled: true,
          usageCount: 0
        }
      ],
      createdAt: new Date()
    };

    this.servers.set('brave-search', braveSearchServer);
  }

  async connectServer(serverId: string): Promise<boolean> {
    const server = this.servers.get(serverId);
    if (!server) {
      throw new Error(`Server ${serverId} not found`);
    }

    try {
      // Update server status to connecting
      server.status = 'connecting';
      this.servers.set(serverId, server);

      // For Brave Search, test the API key
      if (serverId === 'brave-search') {
        const isValid = await this.testBraveSearchConnection();
        if (isValid) {
          server.status = 'active';
          server.lastHealthCheck = new Date();

          // Create connection record
          const connection: MCPConnection = {
            serverId,
            sessionId: `session_${Date.now()}`,
            isConnected: true,
            lastUsed: new Date()
          };

          this.connections.set(serverId, connection);
          console.log(`[MCP] Successfully connected to ${server.name}`);
          return true;
        } else {
          server.status = 'error';
          return false;
        }
      }

      return false;
    } catch (error) {
      console.error(`[MCP] Failed to connect to ${server.name}:`, error);
      server.status = 'error';
      this.servers.set(serverId, server);
      return false;
    }
  }

  async disconnectServer(serverId: string): Promise<void> {
    const server = this.servers.get(serverId);
    if (server) {
      server.status = 'inactive';
      this.servers.set(serverId, server);
    }

    this.connections.delete(serverId);
    console.log(`[MCP] Disconnected from server ${serverId}`);
  }

  async callTool(toolCall: MCPToolCall): Promise<MCPToolResponse> {
    const startTime = Date.now();
    const { serverId, toolName, parameters } = toolCall;

    try {
      const server = this.servers.get(serverId);
      if (!server || server.status !== 'active') {
        throw new Error(`Server ${serverId} is not active`);
      }

      const tool = server.tools.find(t => t.name === toolName);
      if (!tool || !tool.enabled) {
        throw new Error(`Tool ${toolName} not found or disabled`);
      }

      let result;

      // Route to specific server implementation
      switch (serverId) {
        case 'brave-search':
          result = await this.callBraveSearchTool(toolName, parameters);
          break;
        default:
          throw new Error(`Server ${serverId} not implemented`);
      }

      const responseTime = Date.now() - startTime;

      // Update tool usage count
      tool.usageCount = (tool.usageCount || 0) + 1;

      // Log usage
      this.usageLogs.push({
        serverId,
        toolName,
        success: true,
        responseTime,
        timestamp: new Date()
      });

      return {
        success: true,
        data: result,
        responseTime
      };

    } catch (error) {
      const responseTime = Date.now() - startTime;

      // Log failed usage
      this.usageLogs.push({
        serverId,
        toolName,
        success: false,
        responseTime,
        timestamp: new Date()
      });

      console.error(`[MCP] Tool call failed:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime
      };
    }
  }

  private async testBraveSearchConnection(): Promise<boolean> {
    try {
      const apiKey = process.env.BRAVE_SEARCH_API_KEY;
      if (!apiKey) {
        console.error('[MCP] Brave Search API key not found');
        return false;
      }

      // Test with a simple query
      const response = await fetch('https://api.search.brave.com/res/v1/web/search?q=test', {
        headers: {
          'Accept': 'application/json',
          'X-Subscription-Token': apiKey
        }
      });

      return response.ok;
    } catch (error) {
      console.error('[MCP] Brave Search connection test failed:', error);
      return false;
    }
  }

  private async callBraveSearchTool(toolName: string, parameters: any): Promise<any> {
    if (toolName !== 'web_search') {
      throw new Error(`Unknown Brave Search tool: ${toolName}`);
    }

    const apiKey = process.env.BRAVE_SEARCH_API_KEY;
    if (!apiKey) {
      throw new Error('Brave Search API key not configured');
    }

    const { query, count = 10, offset = 0 } = parameters;

    const url = new URL('https://api.search.brave.com/res/v1/web/search');
    url.searchParams.set('q', query);
    url.searchParams.set('count', count.toString());
    url.searchParams.set('offset', offset.toString());

    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'X-Subscription-Token': apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`Brave Search API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Format results for Agent Lee
    const results = data.web?.results?.map((result: any) => ({
      title: result.title,
      url: result.url,
      description: result.description,
      age: result.age
    })) || [];

    return {
      query: data.query.original,
      results,
      total_results: results.length
    };
  }

  getServer(serverId: string): MCPServer | undefined {
    return this.servers.get(serverId);
  }

  getAllServers(): MCPServer[] {
    return Array.from(this.servers.values());
  }

  getActiveServers(): MCPServer[] {
    return this.getAllServers().filter(server => server.status === 'active');
  }

  getAvailableTools(): MCPTool[] {
    const tools: MCPTool[] = [];
    for (const server of this.getActiveServers()) {
      tools.push(...server.tools.filter(tool => tool.enabled));
    }
    return tools;
  }

  async healthCheck(serverId?: string): Promise<void> {
    const serversToCheck = serverId ? [serverId] : Array.from(this.servers.keys());

    for (const id of serversToCheck) {
      const server = this.servers.get(id);
      if (!server || server.status !== 'active') continue;

      try {
        let isHealthy = false;

        switch (id) {
          case 'brave-search':
            isHealthy = await this.testBraveSearchConnection();
            break;
        }

        server.lastHealthCheck = new Date();
        if (!isHealthy) {
          server.status = 'error';
          console.warn(`[MCP] Health check failed for ${server.name}`);
        }

        this.servers.set(id, server);
      } catch (error) {
        console.error(`[MCP] Health check error for ${id}:`, error);
      }
    }
  }

  getUsageStats() {
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);

    const recentLogs = this.usageLogs.filter(log =>
      log.timestamp.getTime() > oneHourAgo
    );

    return {
      totalCalls: recentLogs.length,
      successfulCalls: recentLogs.filter(log => log.success).length,
      averageResponseTime: recentLogs.length > 0
        ? recentLogs.reduce((sum, log) => sum + log.responseTime, 0) / recentLogs.length
        : 0,
      toolUsage: this.getToolUsageStats(recentLogs)
    };
  }

  private getToolUsageStats(logs: any[]) {
    const usage = new Map<string, { count: number; totalTime: number; errors: number }>();

    for (const log of logs) {
      const key = `${log.serverId}:${log.toolName}`;
      const current = usage.get(key) || { count: 0, totalTime: 0, errors: 0 };

      current.count++;
      current.totalTime += log.responseTime;
      if (!log.success) current.errors++;

      usage.set(key, current);
    }

    return Array.from(usage.entries()).map(([key, stats]) => {
      const [serverId, toolName] = key.split(':');
      return {
        serverId,
        toolName,
        count: stats.count,
        avgResponseTime: stats.totalTime / stats.count,
        errorRate: (stats.errors / stats.count) * 100
      };
    });
  }
}

// Global MCP client instance
export const mcpClient = new MCPClient();