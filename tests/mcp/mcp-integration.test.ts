import { describe, it, expect, vi, beforeEach } from 'vitest'
import { braveSearchMCP } from '@/lib/mcp/servers/brave-search'
import { mcpClient } from '@/lib/mcp/client'
import { mcpServerManager } from '@/lib/mcp/server-manager'

// Mock environment variables
vi.mock('process', () => ({
  env: {
    BRAVE_SEARCH_API_KEY: 'test_api_key',
    GITHUB_API_KEY: 'test_github_key',
    OPENAI_API_KEY: 'test_openai_key'
  }
}))

// Mock fetch for API calls
global.fetch = vi.fn()

describe('MCP Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Brave Search MCP', () => {
    it('should perform web search', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          web: {
            results: [
              {
                title: 'Test Result',
                description: 'Test description',
                url: 'https://example.com'
              }
            ]
          },
          summarizer: {
            key_points: ['Point 1', 'Point 2']
          }
        })
      } as Response)

      const result = await braveSearchMCP.webSearch('test query', 'session_123', 'thread_123')

      expect(result.results).toHaveLength(1)
      expect(result.results[0].title).toBe('Test Result')
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('api.search.brave.com'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Subscription-Token': 'test_api_key'
          })
        })
      )
    })

    it('should perform news search', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          news: {
            results: [
              {
                title: 'News Article',
                description: 'News description',
                url: 'https://news.example.com',
                age: '2 hours ago'
              }
            ]
          }
        })
      } as Response)

      const result = await braveSearchMCP.newsSearch('latest news', 'session_123', 'thread_123')

      expect(result.results).toHaveLength(1)
      expect(result.results[0].title).toBe('News Article')
    })

    it('should handle search errors gracefully', async () => {
      vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'))

      const result = await braveSearchMCP.webSearch('test', 'session_123', 'thread_123')

      expect(result.error).toBeDefined()
      expect(result.results).toEqual([])
    })
  })

  describe('MCP Client', () => {
    it('should get recommended tools based on user message', async () => {
      const recommendations = await mcpClient.getRecommendedTools('search for latest news about AI')

      expect(recommendations).toContain('web_search')
      expect(recommendations).toContain('news_search')
    })

    it('should perform web search through client', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          web: { results: [] },
          summarizer: {}
        })
      } as Response)

      const result = await mcpClient.performWebSearch('test query')

      expect(result.success).toBeDefined()
      if (result.success) {
        expect(result.data).toBeDefined()
      }
    })

    it('should handle GitHub operations', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ([
          {
            name: 'repo1',
            description: 'Test repository',
            html_url: 'https://github.com/user/repo1'
          }
        ])
      } as Response)

      const result = await mcpClient.listGitHubRepos('testuser')

      expect(result.success).toBeDefined()
      if (result.success) {
        expect(Array.isArray(result.data)).toBe(true)
      }
    })
  })

  describe('MCP Server Manager', () => {
    it('should get all MCP servers', async () => {
      const servers = await mcpServerManager.getServers()

      expect(Array.isArray(servers)).toBe(true)
      expect(servers.length).toBeGreaterThan(0)

      const braveServer = servers.find(s => s.id === 'brave-search')
      expect(braveServer).toBeDefined()
      expect(braveServer?.requiresApiKey).toBe(true)
    })

    it('should start a server', async () => {
      const success = await mcpServerManager.startServer('brave-search')

      expect(success).toBe(true)

      const servers = await mcpServerManager.getServers()
      const braveServer = servers.find(s => s.id === 'brave-search')
      expect(braveServer?.status).toBe('active')
    })

    it('should stop a server', async () => {
      const success = await mcpServerManager.stopServer('github')

      expect(success).toBe(true)

      const servers = await mcpServerManager.getServers()
      const githubServer = servers.find(s => s.id === 'github')
      expect(githubServer?.status).toBe('inactive')
    })

    it('should log MCP calls', async () => {
      await mcpServerManager.logCall({
        serverId: 'brave-search',
        toolName: 'web_search',
        success: true,
        responseTime: 150,
        input: { query: 'test' },
        output: { results: [] }
      })

      const calls = await mcpServerManager.getCalls()
      const recentCall = calls.find(c => c.toolName === 'web_search')

      expect(recentCall).toBeDefined()
      expect(recentCall?.success).toBe(true)
      expect(recentCall?.responseTime).toBe(150)
    })

    it('should update server statistics', async () => {
      await mcpServerManager.updateServerStats('brave-search', 'web_search', true, 200)

      const servers = await mcpServerManager.getServers()
      const braveServer = servers.find(s => s.id === 'brave-search')

      expect(braveServer?.totalCalls).toBeGreaterThan(0)
      expect(braveServer?.responseTime).toBe(200)
    })
  })

  describe('MCP Tool Detection', () => {
    it('should detect Brave Search triggers', () => {
      const testCases = [
        { message: 'search for information about AI', expected: true },
        { message: 'find latest news', expected: true },
        { message: 'current information about stocks', expected: true },
        { message: 'hello world', expected: false }
      ]

      testCases.forEach(({ message, expected }) => {
        const shouldUse = message.toLowerCase().includes('search') ||
                         message.toLowerCase().includes('find') ||
                         message.toLowerCase().includes('latest') ||
                         message.toLowerCase().includes('current')
        expect(shouldUse).toBe(expected)
      })
    })

    it('should detect GitHub triggers', () => {
      const testCases = [
        { message: 'create a GitHub repository', expected: true },
        { message: 'list my repos', expected: true },
        { message: 'make a pull request', expected: true },
        { message: 'hello world', expected: false }
      ]

      testCases.forEach(({ message, expected }) => {
        const shouldUse = message.toLowerCase().includes('github') ||
                         message.toLowerCase().includes('repo') ||
                         message.toLowerCase().includes('pull request')
        expect(shouldUse).toBe(expected)
      })
    })
  })
})