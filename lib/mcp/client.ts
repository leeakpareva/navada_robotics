import { mcpServerManager } from './server-manager'
import { braveSearchMCP } from './servers/brave-search'
import { fileSystemMCP } from './servers/file-system'
import { githubMCP } from './servers/github'

export interface MCPCallResult {
  success: boolean
  data?: any
  error?: string
  serverId: string
  toolName: string
}

export class MCPClient {
  constructor() {
    // Initialize using the real server manager
  }

  async callTool(serverId: string, toolName: string, params: any): Promise<MCPCallResult> {
    try {
      const servers = await mcpServerManager.getServers()
      const server = servers.find(s => s.id === serverId)

      if (!server) {
        return {
          success: false,
          error: `Server ${serverId} not found`,
          serverId,
          toolName
        }
      }

      if (server.status !== 'active') {
        return {
          success: false,
          error: `Server ${serverId} is not active (status: ${server.status})`,
          serverId,
          toolName
        }
      }

      let result: any

      switch (serverId) {
        case 'brave-search':
          if (toolName === 'web_search') {
            result = await braveSearchMCP.webSearch(params.query)
          } else if (toolName === 'news_search') {
            result = await braveSearchMCP.newsSearch(params.query)
          } else {
            throw new Error(`Unknown tool ${toolName} for Brave Search`)
          }
          break

        case 'file-system':
          if (toolName === 'read_file') {
            result = await fileSystemMCP.readFile(params.path)
          } else if (toolName === 'write_file') {
            result = await fileSystemMCP.writeFile(params.path, params.content)
          } else if (toolName === 'list_directory') {
            result = await fileSystemMCP.listDirectory(params.path)
          } else if (toolName === 'create_directory') {
            result = await fileSystemMCP.createDirectory(params.path)
          } else if (toolName === 'delete_file') {
            // Method might not exist, handle gracefully
            if ('deleteFile' in fileSystemMCP && typeof fileSystemMCP.deleteFile === 'function') {
              result = await (fileSystemMCP as any).deleteFile(params.path)
            } else {
              result = { error: 'Delete file method not available' }
            }
          } else {
            throw new Error(`Unknown tool ${toolName} for File System`)
          }
          break

        case 'github':
          if (toolName === 'list_repos') {
            result = await githubMCP.listRepos(params.username)
          } else if (toolName === 'create_repo') {
            result = await githubMCP.createRepo(params.name, params.description, params.isPrivate)
          } else if (toolName === 'create_issue') {
            result = await githubMCP.createIssue(params.owner, params.repo, params.title, params.body)
          } else {
            throw new Error(`Unknown tool ${toolName} for GitHub`)
          }
          break

        default:
          throw new Error(`Unknown server ${serverId}`)
      }

      return {
        success: true,
        data: result,
        serverId,
        toolName
      }

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        serverId,
        toolName
      }
    }
  }

  shouldUseWebSearch(message: string): boolean {
    const webSearchTriggers = [
      'search', 'find', 'look up', 'what is', 'who is', 'when did', 'where is',
      'latest', 'current', 'recent', 'news', 'today', 'this week', 'this month',
      'price', 'stock', 'weather', 'definition', 'meaning'
    ]

    const lowerMessage = message.toLowerCase()
    return webSearchTriggers.some(trigger => lowerMessage.includes(trigger))
  }

  shouldUseGitHub(message: string): boolean {
    const githubTriggers = [
      'repository', 'repo', 'github', 'create repo', 'list repos', 'issue', 'bug report',
      'feature request', 'pull request', 'commit', 'branch'
    ]

    const lowerMessage = message.toLowerCase()
    return githubTriggers.some(trigger => lowerMessage.includes(trigger))
  }

  shouldUseFileSystem(message: string): boolean {
    const fileSystemTriggers = [
      'file', 'directory', 'folder', 'read file', 'write file', 'save', 'load',
      'create directory', 'delete file', 'list files', 'browse files'
    ]

    const lowerMessage = message.toLowerCase()
    return fileSystemTriggers.some(trigger => lowerMessage.includes(trigger))
  }

  async getRecommendedTools(message: string): Promise<Array<{serverId: string, toolName: string, confidence: number}>> {
    const recommendations = []
    const lowerMessage = message.toLowerCase()

    if (this.shouldUseWebSearch(message)) {
      if (lowerMessage.includes('news')) {
        recommendations.push({ serverId: 'brave-search', toolName: 'news_search', confidence: 0.9 })
      } else {
        recommendations.push({ serverId: 'brave-search', toolName: 'web_search', confidence: 0.8 })
      }
    }

    if (this.shouldUseGitHub(message)) {
      if (lowerMessage.includes('create repo')) {
        recommendations.push({ serverId: 'github', toolName: 'create_repo', confidence: 0.9 })
      } else if (lowerMessage.includes('list repos')) {
        recommendations.push({ serverId: 'github', toolName: 'list_repos', confidence: 0.9 })
      } else if (lowerMessage.includes('issue')) {
        recommendations.push({ serverId: 'github', toolName: 'create_issue', confidence: 0.8 })
      }
    }

    if (this.shouldUseFileSystem(message)) {
      if (lowerMessage.includes('read')) {
        recommendations.push({ serverId: 'file-system', toolName: 'read_file', confidence: 0.8 })
      } else if (lowerMessage.includes('write') || lowerMessage.includes('save')) {
        recommendations.push({ serverId: 'file-system', toolName: 'write_file', confidence: 0.8 })
      } else if (lowerMessage.includes('list') || lowerMessage.includes('browse')) {
        recommendations.push({ serverId: 'file-system', toolName: 'list_directory', confidence: 0.7 })
      }
    }

    return recommendations.sort((a, b) => b.confidence - a.confidence)
  }

  async performWebSearch(query: string): Promise<MCPCallResult> {
    return this.callTool('brave-search', 'web_search', { query })
  }

  async performNewsSearch(query: string): Promise<MCPCallResult> {
    return this.callTool('brave-search', 'news_search', { query })
  }

  async listGitHubRepos(username?: string): Promise<MCPCallResult> {
    return this.callTool('github', 'list_repos', { username })
  }

  async createGitHubRepo(name: string, description?: string, isPrivate: boolean = false): Promise<MCPCallResult> {
    return this.callTool('github', 'create_repo', { name, description, isPrivate })
  }

  async readFile(path: string): Promise<MCPCallResult> {
    return this.callTool('file-system', 'read_file', { path })
  }

  async writeFile(path: string, content: string): Promise<MCPCallResult> {
    return this.callTool('file-system', 'write_file', { path, content })
  }
}

// Global MCP client instance
export const mcpClient = new MCPClient();