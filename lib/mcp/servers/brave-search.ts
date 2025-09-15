import { DatabaseAnalytics } from '../../database-analytics'

export class BraveSearchMCP {
  private apiKey: string | undefined

  constructor() {
    this.apiKey = process.env.BRAVE_SEARCH_API_KEY
  }

  async webSearch(query: string, sessionId?: string, threadId?: string): Promise<any> {
    const startTime = Date.now()

    try {
      if (!this.apiKey) {
        throw new Error('Brave Search API key not configured')
      }

      const response = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}`, {
        headers: {
          'X-Subscription-Token': this.apiKey,
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Brave Search API error: ${response.status}`)
      }

      const data = await response.json()
      const responseTime = Date.now() - startTime

      await DatabaseAnalytics.trackMCPUsage({
        sessionId,
        threadId,
        serverId: 'brave-search',
        toolName: 'web_search',
        success: true,
        responseTime,
        inputData: { query },
        outputData: { resultCount: data.web?.results?.length || 0 }
      })

      return {
        results: data.web?.results?.slice(0, 5) || [],
        summary: this.formatSearchResults(data.web?.results?.slice(0, 3) || [])
      }
    } catch (error) {
      const responseTime = Date.now() - startTime

      await DatabaseAnalytics.trackMCPUsage({
        sessionId,
        threadId,
        serverId: 'brave-search',
        toolName: 'web_search',
        success: false,
        responseTime,
        inputData: { query },
        errorDetails: error instanceof Error ? error.message : 'Unknown error'
      })

      throw error
    }
  }

  async newsSearch(query: string, sessionId?: string, threadId?: string): Promise<any> {
    const startTime = Date.now()

    try {
      if (!this.apiKey) {
        throw new Error('Brave Search API key not configured')
      }

      const response = await fetch(`https://api.search.brave.com/res/v1/news/search?q=${encodeURIComponent(query)}`, {
        headers: {
          'X-Subscription-Token': this.apiKey,
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Brave News API error: ${response.status}`)
      }

      const data = await response.json()
      const responseTime = Date.now() - startTime

      await DatabaseAnalytics.trackMCPUsage({
        sessionId,
        threadId,
        serverId: 'brave-search',
        toolName: 'news_search',
        success: true,
        responseTime,
        inputData: { query },
        outputData: { resultCount: data.results?.length || 0 }
      })

      return {
        results: data.results?.slice(0, 5) || [],
        summary: this.formatNewsResults(data.results?.slice(0, 3) || [])
      }
    } catch (error) {
      const responseTime = Date.now() - startTime

      await DatabaseAnalytics.trackMCPUsage({
        sessionId,
        threadId,
        serverId: 'brave-search',
        toolName: 'news_search',
        success: false,
        responseTime,
        inputData: { query },
        errorDetails: error instanceof Error ? error.message : 'Unknown error'
      })

      throw error
    }
  }

  private formatSearchResults(results: any[]): string {
    if (results.length === 0) {
      return "No search results found."
    }

    return results.map((result: any) =>
      `**${result.title}**\n${result.description}\n*Source: ${result.url}*`
    ).join('\n\n')
  }

  private formatNewsResults(results: any[]): string {
    if (results.length === 0) {
      return "No news results found."
    }

    return results.map((result: any) =>
      `**${result.title}**\n${result.description}\n*Published: ${new Date(result.age).toLocaleDateString()}*\n*Source: ${result.url}*`
    ).join('\n\n')
  }
}

export const braveSearchMCP = new BraveSearchMCP()