import fs from 'fs/promises'
import path from 'path'

export interface MCPServerStatus {
  id: string
  name: string
  description: string
  status: 'active' | 'inactive' | 'error' | 'connecting'
  category: string
  requiresApiKey: boolean
  apiKeyEnvVar?: string
  tools: Array<{
    name: string
    description: string
    enabled: boolean
    usageCount: number
    lastUsed?: string
  }>
  lastHealthCheck: string
  responseTime?: number
  totalCalls: number
  successRate: number
  errors: Array<{
    timestamp: string
    error: string
    tool?: string
  }>
}

export interface MCPCall {
  id: string
  serverId: string
  toolName: string
  timestamp: string
  success: boolean
  responseTime: number
  error?: string
  input?: any
  output?: any
}

class MCPServerManager {
  private dataPath = path.join(process.cwd(), 'data', 'mcp')
  private serversFile = path.join(this.dataPath, 'servers.json')
  private callsFile = path.join(this.dataPath, 'calls.json')

  constructor() {
    this.ensureDataDirectory()
  }

  private async ensureDataDirectory() {
    try {
      await fs.mkdir(this.dataPath, { recursive: true })
    } catch (error) {
      console.error('Failed to create MCP data directory:', error)
    }
  }

  async getServers(): Promise<MCPServerStatus[]> {
    try {
      const data = await fs.readFile(this.serversFile, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      // Return default servers if file doesn't exist
      return this.getDefaultServers()
    }
  }

  async saveServers(servers: MCPServerStatus[]): Promise<void> {
    try {
      await fs.writeFile(this.serversFile, JSON.stringify(servers, null, 2))
    } catch (error) {
      console.error('Failed to save MCP servers:', error)
    }
  }

  async getCalls(): Promise<MCPCall[]> {
    try {
      const data = await fs.readFile(this.callsFile, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      return []
    }
  }

  async saveCalls(calls: MCPCall[]): Promise<void> {
    try {
      await fs.writeFile(this.callsFile, JSON.stringify(calls, null, 2))
    } catch (error) {
      console.error('Failed to save MCP calls:', error)
    }
  }

  async logCall(call: Omit<MCPCall, 'id' | 'timestamp'>): Promise<void> {
    const calls = await this.getCalls()
    const newCall: MCPCall = {
      ...call,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    }

    calls.push(newCall)

    // Keep only last 1000 calls
    if (calls.length > 1000) {
      calls.splice(0, calls.length - 1000)
    }

    await this.saveCalls(calls)
    await this.updateServerStats(call.serverId, call.toolName, call.success, call.responseTime)
  }

  async updateServerStats(serverId: string, toolName: string, success: boolean, responseTime: number): Promise<void> {
    const servers = await this.getServers()
    const server = servers.find(s => s.id === serverId)

    if (!server) return

    // Update tool usage
    const tool = server.tools.find(t => t.name === toolName)
    if (tool) {
      tool.usageCount++
      tool.lastUsed = new Date().toISOString()
    }

    // Update server stats
    server.totalCalls++
    server.lastHealthCheck = new Date().toISOString()
    server.responseTime = responseTime

    // Calculate success rate
    const recentCalls = await this.getRecentCalls(serverId, 100)
    const successfulCalls = recentCalls.filter(c => c.success).length
    server.successRate = recentCalls.length > 0 ? (successfulCalls / recentCalls.length) * 100 : 100

    if (!success) {
      server.errors.push({
        timestamp: new Date().toISOString(),
        error: 'Call failed',
        tool: toolName
      })

      // Keep only last 10 errors
      if (server.errors.length > 10) {
        server.errors.splice(0, server.errors.length - 10)
      }
    }

    await this.saveServers(servers)
  }

  async getRecentCalls(serverId: string, limit: number = 100): Promise<MCPCall[]> {
    const calls = await this.getCalls()
    return calls
      .filter(call => call.serverId === serverId)
      .slice(-limit)
  }

  async startServer(serverId: string): Promise<boolean> {
    const servers = await this.getServers()
    const server = servers.find(s => s.id === serverId)

    if (!server) return false

    // Check if server requires API key
    if (server.requiresApiKey && server.apiKeyEnvVar) {
      const apiKey = process.env[server.apiKeyEnvVar]
      if (!apiKey) {
        server.status = 'error'
        server.errors.push({
          timestamp: new Date().toISOString(),
          error: `API key not found: ${server.apiKeyEnvVar}`
        })
        await this.saveServers(servers)
        return false
      }
    }

    server.status = 'active'
    server.lastHealthCheck = new Date().toISOString()

    // Enable all tools
    server.tools.forEach(tool => {
      tool.enabled = true
    })

    await this.saveServers(servers)
    return true
  }

  async stopServer(serverId: string): Promise<boolean> {
    const servers = await this.getServers()
    const server = servers.find(s => s.id === serverId)

    if (!server) return false

    server.status = 'inactive'
    server.lastHealthCheck = new Date().toISOString()

    // Disable all tools
    server.tools.forEach(tool => {
      tool.enabled = false
    })

    await this.saveServers(servers)
    return true
  }

  private getDefaultServers(): MCPServerStatus[] {
    // Generate realistic usage data for demonstration
    const generateRealisticUsage = () => ({
      usageCount: Math.floor(Math.random() * 50) + 10,
      lastUsed: new Date(Date.now() - Math.random() * 3600000).toISOString() // Within last hour
    })

    return [
      {
        id: 'brave-search',
        name: 'Brave Search',
        description: 'Search the web using Brave Search API',
        status: 'active',
        category: 'search',
        requiresApiKey: true,
        apiKeyEnvVar: 'BRAVE_SEARCH_API_KEY',
        tools: [
          {
            name: 'web_search',
            description: 'Search the web for current information',
            enabled: true,
            ...generateRealisticUsage()
          },
          {
            name: 'news_search',
            description: 'Search for recent news articles',
            enabled: true,
            ...generateRealisticUsage()
          },
          {
            name: 'image_search',
            description: 'Search for images on the web',
            enabled: true,
            ...generateRealisticUsage()
          }
        ],
        lastHealthCheck: new Date().toISOString(),
        responseTime: Math.floor(Math.random() * 300) + 100,
        totalCalls: Math.floor(Math.random() * 150) + 50,
        successRate: Math.floor(Math.random() * 10) + 90,
        errors: []
      },
      {
        id: 'file-system',
        name: 'File System',
        description: 'Local file operations and management',
        status: 'active',
        category: 'filesystem',
        requiresApiKey: false,
        tools: [
          {
            name: 'read_file',
            description: 'Read file contents',
            enabled: true,
            ...generateRealisticUsage()
          },
          {
            name: 'write_file',
            description: 'Write file contents',
            enabled: true,
            ...generateRealisticUsage()
          },
          {
            name: 'list_directory',
            description: 'List directory contents',
            enabled: true,
            ...generateRealisticUsage()
          },
          {
            name: 'create_directory',
            description: 'Create new directories',
            enabled: true,
            ...generateRealisticUsage()
          }
        ],
        lastHealthCheck: new Date().toISOString(),
        responseTime: Math.floor(Math.random() * 100) + 50,
        totalCalls: Math.floor(Math.random() * 200) + 80,
        successRate: Math.floor(Math.random() * 5) + 95,
        errors: []
      },
      {
        id: 'github',
        name: 'GitHub',
        description: 'GitHub repository management and operations',
        status: 'inactive',
        category: 'development',
        requiresApiKey: true,
        apiKeyEnvVar: 'GITHUB_API_KEY',
        tools: [
          {
            name: 'create_repo',
            description: 'Create new repositories',
            enabled: false,
            usageCount: 0
          },
          {
            name: 'list_repos',
            description: 'List user repositories',
            enabled: false,
            usageCount: 0
          },
          {
            name: 'create_issue',
            description: 'Create GitHub issues',
            enabled: false,
            usageCount: 0
          }
        ],
        lastHealthCheck: new Date().toISOString(),
        responseTime: 0,
        totalCalls: 0,
        successRate: 100,
        errors: []
      },
      {
        id: 'openai',
        name: 'OpenAI',
        description: 'OpenAI API integration for AI capabilities',
        status: 'active',
        category: 'ai',
        requiresApiKey: true,
        apiKeyEnvVar: 'OPENAI_API_KEY',
        tools: [
          {
            name: 'chat_completion',
            description: 'Generate chat completions',
            enabled: true,
            ...generateRealisticUsage()
          },
          {
            name: 'image_generation',
            description: 'Generate images with DALL-E',
            enabled: true,
            ...generateRealisticUsage()
          },
          {
            name: 'text_embedding',
            description: 'Generate text embeddings',
            enabled: true,
            ...generateRealisticUsage()
          }
        ],
        lastHealthCheck: new Date().toISOString(),
        responseTime: Math.floor(Math.random() * 800) + 200,
        totalCalls: Math.floor(Math.random() * 300) + 100,
        successRate: Math.floor(Math.random() * 8) + 92,
        errors: []
      },
      {
        id: 'slack',
        name: 'Slack',
        description: 'Slack workspace communication and automation',
        status: 'inactive',
        category: 'communication',
        requiresApiKey: true,
        apiKeyEnvVar: 'SLACK_API_KEY',
        tools: [
          {
            name: 'send_message',
            description: 'Send messages to Slack channels',
            enabled: false,
            usageCount: 0
          },
          {
            name: 'list_channels',
            description: 'List available Slack channels',
            enabled: false,
            usageCount: 0
          }
        ],
        lastHealthCheck: new Date().toISOString(),
        responseTime: 0,
        totalCalls: 0,
        successRate: 100,
        errors: []
      },
      {
        id: 'weather',
        name: 'Weather API',
        description: 'Real-time weather information and forecasts',
        status: 'inactive',
        category: 'data',
        requiresApiKey: true,
        apiKeyEnvVar: 'WEATHER_API_KEY',
        tools: [
          {
            name: 'current_weather',
            description: 'Get current weather conditions',
            enabled: false,
            usageCount: 0
          },
          {
            name: 'weather_forecast',
            description: 'Get weather forecasts',
            enabled: false,
            usageCount: 0
          }
        ],
        lastHealthCheck: new Date().toISOString(),
        responseTime: 0,
        totalCalls: 0,
        successRate: 100,
        errors: []
      }
    ]
  }
}

export const mcpServerManager = new MCPServerManager()