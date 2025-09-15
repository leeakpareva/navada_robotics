// MCP (Model Context Protocol) Types and Interfaces

export interface MCPServer {
  id: string;
  name: string;
  description: string;
  url?: string;
  status: 'active' | 'inactive' | 'error' | 'connecting';
  category: 'web_search' | 'database' | 'api' | 'file_system' | 'custom';
  requiresApiKey: boolean;
  apiKeyName?: string;
  tools: MCPTool[];
  lastHealthCheck?: Date;
  createdAt: Date;
  config?: Record<string, any>;
}

export interface MCPTool {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
  enabled: boolean;
  usageCount?: number;
}

export interface MCPConnection {
  serverId: string;
  sessionId: string;
  isConnected: boolean;
  lastUsed: Date;
  responseTime?: number;
}

export interface MCPToolCall {
  toolName: string;
  serverId: string;
  parameters: Record<string, any>;
  sessionId: string;
}

export interface MCPToolResponse {
  success: boolean;
  data?: any;
  error?: string;
  responseTime: number;
}

export interface MCPAnalytics {
  serverMetrics: {
    totalServers: number;
    activeServers: number;
    averageResponseTime: number;
    successRate: number;
  };
  toolUsage: Array<{
    name: string;
    count: number;
    avgResponseTime: number;
    errorRate: number;
  }>;
  serverHealth: Array<{
    serverId: string;
    name: string;
    status: string;
    lastCheck: Date;
    uptime: number;
  }>;
}

// Brave Search specific types
export interface BraveSearchResult {
  title: string;
  url: string;
  description: string;
  age?: string;
  extra_snippets?: string[];
}

export interface BraveSearchResponse {
  web?: {
    results: BraveSearchResult[];
  };
  query: {
    original: string;
    show_strict_warning: boolean;
    altered?: string;
  };
}