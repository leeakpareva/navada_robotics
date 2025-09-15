import { mcpServerManager } from '../server-manager'

export class GitHubMCP {
  private apiKey: string | undefined

  constructor() {
    this.apiKey = process.env.GITHUB_API_KEY
  }

  async listRepos(username?: string): Promise<any> {
    const startTime = Date.now()

    try {
      if (!this.apiKey) {
        throw new Error('GitHub API key not configured')
      }

      const endpoint = username ? `https://api.github.com/users/${username}/repos` : 'https://api.github.com/user/repos'

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'NavadaRobotics-MCP'
        }
      })

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`)
      }

      const data = await response.json()
      const responseTime = Date.now() - startTime

      await mcpServerManager.logCall({
        serverId: 'github',
        toolName: 'list_repos',
        success: true,
        responseTime,
        input: { username },
        output: { repoCount: data.length }
      })

      return {
        repositories: data.slice(0, 10).map((repo: any) => ({
          name: repo.name,
          fullName: repo.full_name,
          description: repo.description,
          url: repo.html_url,
          language: repo.language,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          private: repo.private,
          updatedAt: repo.updated_at
        })),
        totalCount: data.length
      }
    } catch (error) {
      const responseTime = Date.now() - startTime

      await mcpServerManager.logCall({
        serverId: 'github',
        toolName: 'list_repos',
        success: false,
        responseTime,
        input: { username },
        error: error instanceof Error ? error.message : 'Unknown error'
      })

      throw error
    }
  }

  async createRepo(name: string, description?: string, isPrivate: boolean = false): Promise<any> {
    const startTime = Date.now()

    try {
      if (!this.apiKey) {
        throw new Error('GitHub API key not configured')
      }

      const response = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'NavadaRobotics-MCP',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          description,
          private: isPrivate,
          auto_init: true
        })
      })

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`)
      }

      const data = await response.json()
      const responseTime = Date.now() - startTime

      await mcpServerManager.logCall({
        serverId: 'github',
        toolName: 'create_repo',
        success: true,
        responseTime,
        input: { name, description, isPrivate },
        output: { repoUrl: data.html_url }
      })

      return {
        name: data.name,
        fullName: data.full_name,
        url: data.html_url,
        cloneUrl: data.clone_url,
        private: data.private
      }
    } catch (error) {
      const responseTime = Date.now() - startTime

      await mcpServerManager.logCall({
        serverId: 'github',
        toolName: 'create_repo',
        success: false,
        responseTime,
        input: { name, description, isPrivate },
        error: error instanceof Error ? error.message : 'Unknown error'
      })

      throw error
    }
  }

  async createIssue(owner: string, repo: string, title: string, body?: string): Promise<any> {
    const startTime = Date.now()

    try {
      if (!this.apiKey) {
        throw new Error('GitHub API key not configured')
      }

      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'NavadaRobotics-MCP',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          body
        })
      })

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`)
      }

      const data = await response.json()
      const responseTime = Date.now() - startTime

      await mcpServerManager.logCall({
        serverId: 'github',
        toolName: 'create_issue',
        success: true,
        responseTime,
        input: { owner, repo, title, body },
        output: { issueNumber: data.number }
      })

      return {
        number: data.number,
        title: data.title,
        url: data.html_url,
        state: data.state,
        createdAt: data.created_at
      }
    } catch (error) {
      const responseTime = Date.now() - startTime

      await mcpServerManager.logCall({
        serverId: 'github',
        toolName: 'create_issue',
        success: false,
        responseTime,
        input: { owner, repo, title, body },
        error: error instanceof Error ? error.message : 'Unknown error'
      })

      throw error
    }
  }
}

export const githubMCP = new GitHubMCP()