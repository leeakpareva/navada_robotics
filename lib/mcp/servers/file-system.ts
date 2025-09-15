import fs from 'fs/promises'
import path from 'path'
import { mcpServerManager } from '../server-manager'

export class FileSystemMCP {
  private allowedPath = path.join(process.cwd(), 'data', 'mcp-files')

  constructor() {
    this.ensureAllowedPath()
  }

  private async ensureAllowedPath() {
    try {
      await fs.mkdir(this.allowedPath, { recursive: true })
    } catch (error) {
      console.error('Failed to create MCP files directory:', error)
    }
  }

  private validatePath(filePath: string): string {
    const normalizedPath = path.normalize(filePath)
    const fullPath = path.resolve(this.allowedPath, normalizedPath)

    if (!fullPath.startsWith(this.allowedPath)) {
      throw new Error('Access denied: Path outside allowed directory')
    }

    return fullPath
  }

  async readFile(filePath: string): Promise<any> {
    const startTime = Date.now()

    try {
      const fullPath = this.validatePath(filePath)
      const content = await fs.readFile(fullPath, 'utf8')
      const responseTime = Date.now() - startTime

      await mcpServerManager.logCall({
        serverId: 'file-system',
        toolName: 'read_file',
        success: true,
        responseTime,
        input: { filePath },
        output: { content: content.length > 100 ? content.substring(0, 100) + '...' : content }
      })

      return { content, size: content.length }
    } catch (error) {
      const responseTime = Date.now() - startTime

      await mcpServerManager.logCall({
        serverId: 'file-system',
        toolName: 'read_file',
        success: false,
        responseTime,
        input: { filePath },
        error: error instanceof Error ? error.message : 'Unknown error'
      })

      throw error
    }
  }

  async writeFile(filePath: string, content: string): Promise<any> {
    const startTime = Date.now()

    try {
      const fullPath = this.validatePath(filePath)
      await fs.writeFile(fullPath, content, 'utf8')
      const responseTime = Date.now() - startTime

      await mcpServerManager.logCall({
        serverId: 'file-system',
        toolName: 'write_file',
        success: true,
        responseTime,
        input: { filePath, contentLength: content.length },
        output: { success: true }
      })

      return { success: true, size: content.length }
    } catch (error) {
      const responseTime = Date.now() - startTime

      await mcpServerManager.logCall({
        serverId: 'file-system',
        toolName: 'write_file',
        success: false,
        responseTime,
        input: { filePath, contentLength: content.length },
        error: error instanceof Error ? error.message : 'Unknown error'
      })

      throw error
    }
  }

  async listDirectory(dirPath: string = '.'): Promise<any> {
    const startTime = Date.now()

    try {
      const fullPath = this.validatePath(dirPath)
      const items = await fs.readdir(fullPath, { withFileTypes: true })
      const responseTime = Date.now() - startTime

      const result = items.map(item => ({
        name: item.name,
        type: item.isDirectory() ? 'directory' : 'file',
        isDirectory: item.isDirectory()
      }))

      await mcpServerManager.logCall({
        serverId: 'file-system',
        toolName: 'list_directory',
        success: true,
        responseTime,
        input: { dirPath },
        output: { itemCount: result.length }
      })

      return { items: result, count: result.length }
    } catch (error) {
      const responseTime = Date.now() - startTime

      await mcpServerManager.logCall({
        serverId: 'file-system',
        toolName: 'list_directory',
        success: false,
        responseTime,
        input: { dirPath },
        error: error instanceof Error ? error.message : 'Unknown error'
      })

      throw error
    }
  }

  async createDirectory(dirPath: string): Promise<any> {
    const startTime = Date.now()

    try {
      const fullPath = this.validatePath(dirPath)
      await fs.mkdir(fullPath, { recursive: true })
      const responseTime = Date.now() - startTime

      await mcpServerManager.logCall({
        serverId: 'file-system',
        toolName: 'create_directory',
        success: true,
        responseTime,
        input: { dirPath },
        output: { success: true }
      })

      return { success: true, path: dirPath }
    } catch (error) {
      const responseTime = Date.now() - startTime

      await mcpServerManager.logCall({
        serverId: 'file-system',
        toolName: 'create_directory',
        success: false,
        responseTime,
        input: { dirPath },
        error: error instanceof Error ? error.message : 'Unknown error'
      })

      throw error
    }
  }
}

export const fileSystemMCP = new FileSystemMCP()