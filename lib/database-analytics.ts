import { PrismaClient } from '@prisma/client'

// Use singleton pattern for Prisma client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Types for analytics
export interface ChatSessionData {
  threadId: string
  userId?: string
  apiProvider?: string
  sessionData?: any
}

export interface ChatMessageData {
  sessionId: string
  threadId: string
  messageIndex: number
  role: 'user' | 'assistant' | 'system'
  content: string
  imageData?: string
  websiteData?: any
  codeData?: any
  metadata?: any
}

export interface AnalyticsEventData {
  sessionId: string
  eventType: string
  eventData?: any
  responseTime?: number
  success?: boolean
  errorDetails?: string
}

export interface CodeGenerationData {
  sessionId?: string
  threadId?: string
  instruction: string
  model?: string
  success: boolean
  filesCreated: number
  generationTime: number
  errorDetails?: string
  filesList?: string[]
}

export interface ImageGenerationData {
  sessionId?: string
  threadId?: string
  prompt: string
  model?: string
  success: boolean
  generationTime: number
  imageUrl?: string
  errorDetails?: string
}

export interface MCPUsageData {
  sessionId?: string
  threadId?: string
  serverId: string
  toolName: string
  success: boolean
  responseTime: number
  inputData?: any
  outputData?: any
  errorDetails?: string
}

// Database-backed analytics functions
export class DatabaseAnalytics {
  // Chat Session Management
  static async createOrUpdateChatSession(data: ChatSessionData) {
    try {
      const existingSession = await prisma.chatSession.findUnique({
        where: { threadId: data.threadId }
      })

      if (existingSession) {
        return await prisma.chatSession.update({
          where: { threadId: data.threadId },
          data: {
            lastActivity: new Date(),
            messageCount: { increment: 1 },
            sessionData: data.sessionData ? JSON.stringify(data.sessionData) : undefined,
            apiProvider: data.apiProvider || existingSession.apiProvider
          }
        })
      } else {
        return await prisma.chatSession.create({
          data: {
            threadId: data.threadId,
            userId: data.userId,
            apiProvider: data.apiProvider || 'openai',
            sessionData: data.sessionData ? JSON.stringify(data.sessionData) : undefined
          }
        })
      }
    } catch (error) {
      console.error('[Database Analytics] Error creating/updating chat session:', error)
      throw error
    }
  }

  static async addChatMessage(data: ChatMessageData) {
    try {
      return await prisma.chatMessage.create({
        data: {
          sessionId: data.sessionId,
          threadId: data.threadId,
          messageIndex: data.messageIndex,
          role: data.role,
          content: data.content,
          imageData: data.imageData,
          websiteData: data.websiteData ? JSON.stringify(data.websiteData) : undefined,
          codeData: data.codeData ? JSON.stringify(data.codeData) : undefined,
          metadata: data.metadata ? JSON.stringify(data.metadata) : undefined
        }
      })
    } catch (error) {
      console.error('[Database Analytics] Error adding chat message:', error)
      throw error
    }
  }

  static async getChatHistory(threadId: string) {
    try {
      const session = await prisma.chatSession.findUnique({
        where: { threadId },
        include: {
          messages: {
            orderBy: { messageIndex: 'asc' }
          }
        }
      })

      if (!session) return null

      return {
        session,
        messages: session.messages.map(msg => ({
          ...msg,
          websiteData: msg.websiteData ? JSON.parse(msg.websiteData) : undefined,
          codeData: msg.codeData ? JSON.parse(msg.codeData) : undefined,
          metadata: msg.metadata ? JSON.parse(msg.metadata) : undefined
        }))
      }
    } catch (error) {
      console.error('[Database Analytics] Error getting chat history:', error)
      throw error
    }
  }

  static async endChatSession(threadId: string) {
    try {
      return await prisma.chatSession.update({
        where: { threadId },
        data: {
          status: 'completed',
          endTime: new Date()
        }
      })
    } catch (error) {
      console.error('[Database Analytics] Error ending chat session:', error)
      throw error
    }
  }

  // Analytics Events
  static async trackAnalyticsEvent(data: AnalyticsEventData) {
    try {
      return await prisma.sessionAnalytics.create({
        data: {
          sessionId: data.sessionId,
          eventType: data.eventType,
          eventData: data.eventData ? JSON.stringify(data.eventData) : undefined,
          responseTime: data.responseTime,
          success: data.success ?? true,
          errorDetails: data.errorDetails
        }
      })
    } catch (error) {
      console.error('[Database Analytics] Error tracking analytics event:', error)
      throw error
    }
  }

  // MCP Server Usage Tracking
  static async trackMCPUsage(data: MCPUsageData) {
    try {
      return await prisma.mCPUsage.create({
        data: {
          sessionId: data.sessionId,
          threadId: data.threadId,
          serverId: data.serverId,
          toolName: data.toolName,
          success: data.success,
          responseTime: data.responseTime,
          inputData: data.inputData ? JSON.stringify(data.inputData) : undefined,
          outputData: data.outputData ? JSON.stringify(data.outputData) : undefined,
          errorDetails: data.errorDetails
        }
      })
    } catch (error) {
      console.error('[Database Analytics] Error tracking MCP usage:', error)
      throw error
    }
  }

  // Code Generation Tracking
  static async trackCodeGeneration(data: CodeGenerationData) {
    try {
      return await prisma.codeGeneration.create({
        data: {
          sessionId: data.sessionId,
          threadId: data.threadId,
          instruction: data.instruction,
          model: data.model || 'claude-sonnet-4-20250514',
          success: data.success,
          filesCreated: data.filesCreated,
          generationTime: data.generationTime,
          errorDetails: data.errorDetails,
          filesList: data.filesList ? JSON.stringify(data.filesList) : undefined
        }
      })
    } catch (error) {
      console.error('[Database Analytics] Error tracking code generation:', error)
      throw error
    }
  }

  // Image Generation Tracking
  static async trackImageGeneration(data: ImageGenerationData) {
    try {
      return await prisma.imageGeneration.create({
        data: {
          sessionId: data.sessionId,
          threadId: data.threadId,
          prompt: data.prompt,
          model: data.model || 'dall-e-3',
          success: data.success,
          generationTime: data.generationTime,
          imageUrl: data.imageUrl,
          errorDetails: data.errorDetails
        }
      })
    } catch (error) {
      console.error('[Database Analytics] Error tracking image generation:', error)
      throw error
    }
  }

  // Analytics Queries
  static async getAnalyticsData(hours: number = 24) {
    try {
      const since = new Date(Date.now() - hours * 60 * 60 * 1000)

      // Get chat sessions
      const chatSessions = await prisma.chatSession.findMany({
        where: { createdAt: { gte: since } },
        include: { messages: true, analytics: true }
      })

      // Get code generations
      const codeGenerations = await prisma.codeGeneration.findMany({
        where: { timestamp: { gte: since } }
      })

      // Get image generations
      const imageGenerations = await prisma.imageGeneration.findMany({
        where: { timestamp: { gte: since } }
      })

      // Get MCP usage
      const mcpUsage = await prisma.mCPUsage.findMany({
        where: { timestamp: { gte: since } }
      })

      // Calculate metrics
      const totalSessions = chatSessions.length
      const activeSessions = chatSessions.filter(s => s.status === 'active').length
      const totalMessages = chatSessions.reduce((acc, s) => acc + s.messageCount, 0)
      const avgResponseTime = chatSessions.length > 0
        ? chatSessions
            .flatMap(s => s.analytics)
            .filter(a => a.responseTime)
            .reduce((acc, a, _, arr) => acc + (a.responseTime! / arr.length), 0)
        : 0

      const codeGenSuccessRate = codeGenerations.length > 0
        ? (codeGenerations.filter(c => c.success).length / codeGenerations.length) * 100
        : 0

      const imageGenSuccessRate = imageGenerations.length > 0
        ? (imageGenerations.filter(i => i.success).length / imageGenerations.length) * 100
        : 0

      return {
        activeUsers: {
          current: activeSessions,
          thisHour: chatSessions.filter(s =>
            s.lastActivity >= new Date(Date.now() - 60 * 60 * 1000)
          ).length,
          today: totalSessions
        },
        chatVolume: this.generateHourlyData(chatSessions.map(s => s.createdAt), hours),
        responseTimeData: this.generateHourlyResponseTime(chatSessions, hours),
        totalSessions,
        avgResponseTime: Math.round(avgResponseTime),
        messageVolume: totalMessages,
        dailyQueries: totalMessages,
        uptime: 99.9,
        accuracy: 95,
        imageGeneration: {
          totalGenerated: imageGenerations.length,
          successRate: Math.round(imageGenSuccessRate),
          avgGenerationTime: imageGenerations.length > 0
            ? Math.round(imageGenerations.reduce((acc, i) => acc + i.generationTime, 0) / imageGenerations.length / 1000)
            : 0,
          hourlyData: this.generateHourlyData(imageGenerations.map(i => i.timestamp), hours),
          topPrompts: this.getTopPrompts(imageGenerations.map(i => i.prompt))
        },
        codeGeneration: {
          totalGenerated: codeGenerations.length,
          successRate: Math.round(codeGenSuccessRate),
          avgGenerationTime: codeGenerations.length > 0
            ? Math.round(codeGenerations.reduce((acc, c) => acc + c.generationTime, 0) / codeGenerations.length / 1000)
            : 0,
          filesCreated: codeGenerations.reduce((acc, c) => acc + c.filesCreated, 0),
          hourlyData: this.generateHourlyData(codeGenerations.map(c => c.timestamp), hours),
          topInstructions: this.getTopInstructions(codeGenerations.map(c => c.instruction))
        },
        mcpUsage: {
          totalCalls: mcpUsage.length,
          successRate: mcpUsage.length > 0
            ? Math.round((mcpUsage.filter(m => m.success).length / mcpUsage.length) * 100)
            : 0,
          avgResponseTime: mcpUsage.length > 0
            ? Math.round(mcpUsage.reduce((acc, m) => acc + m.responseTime, 0) / mcpUsage.length)
            : 0,
          hourlyData: this.generateHourlyData(mcpUsage.map(m => m.timestamp), hours),
          serverBreakdown: this.getMCPServerBreakdown(mcpUsage),
          topTools: this.getTopMCPTools(mcpUsage)
        }
      }
    } catch (error) {
      console.error('[Database Analytics] Error getting analytics data:', error)
      throw error
    }
  }

  private static generateHourlyData(timestamps: Date[], hours: number = 24) {
    const now = new Date()
    const data = Array.from({ length: hours }, (_, i) => {
      const hourStart = new Date(now.getTime() - (hours - 1 - i) * 60 * 60 * 1000)
      const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000)

      const count = timestamps.filter(t => t >= hourStart && t < hourEnd).length

      return {
        time: hourStart.toTimeString().slice(0, 5),
        value: count
      }
    })

    return data
  }

  private static generateHourlyResponseTime(sessions: any[], hours: number = 24) {
    const now = new Date()

    return Array.from({ length: hours }, (_, i) => {
      const hourStart = new Date(now.getTime() - (hours - 1 - i) * 60 * 60 * 1000)
      const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000)

      const hourSessions = sessions.filter(s =>
        s.createdAt >= hourStart && s.createdAt < hourEnd
      )

      const responseTimes = hourSessions
        .flatMap(s => s.analytics)
        .filter(a => a.responseTime)
        .map(a => a.responseTime)

      const avgResponseTime = responseTimes.length > 0
        ? responseTimes.reduce((acc, rt) => acc + rt, 0) / responseTimes.length
        : 0

      return {
        time: hourStart.toTimeString().slice(0, 5),
        value: Math.round(avgResponseTime)
      }
    })
  }

  private static getTopPrompts(prompts: string[]) {
    const promptCounts: { [key: string]: number } = {}

    prompts.forEach(prompt => {
      const shortPrompt = prompt.length > 50 ? prompt.substring(0, 50) + '...' : prompt
      promptCounts[shortPrompt] = (promptCounts[shortPrompt] || 0) + 1
    })

    return Object.entries(promptCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([prompt, count]) => ({ prompt, count }))
  }

  private static getTopInstructions(instructions: string[]) {
    const instructionCounts: { [key: string]: number } = {}

    instructions.forEach(instruction => {
      const shortInstruction = instruction.length > 30 ? instruction.substring(0, 30) + '...' : instruction
      instructionCounts[shortInstruction] = (instructionCounts[shortInstruction] || 0) + 1
    })

    return Object.entries(instructionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([instruction, count]) => ({ instruction, count }))
  }

  private static getMCPServerBreakdown(mcpUsage: any[]) {
    const serverCounts: { [key: string]: { total: number, success: number } } = {}

    mcpUsage.forEach(usage => {
      if (!serverCounts[usage.serverId]) {
        serverCounts[usage.serverId] = { total: 0, success: 0 }
      }
      serverCounts[usage.serverId].total++
      if (usage.success) {
        serverCounts[usage.serverId].success++
      }
    })

    return Object.entries(serverCounts)
      .sort(([,a], [,b]) => b.total - a.total)
      .slice(0, 10)
      .map(([server, counts]) => ({
        server,
        calls: counts.total,
        successRate: counts.total > 0 ? Math.round((counts.success / counts.total) * 100) : 0
      }))
  }

  private static getTopMCPTools(mcpUsage: any[]) {
    const toolCounts: { [key: string]: number } = {}

    mcpUsage.forEach(usage => {
      const toolKey = `${usage.serverId}:${usage.toolName}`
      toolCounts[toolKey] = (toolCounts[toolKey] || 0) + 1
    })

    return Object.entries(toolCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([tool, count]) => {
        const [server, toolName] = tool.split(':')
        return { server, tool: toolName, count }
      })
  }

  // Session cleanup
  static async cleanupOldSessions(daysOld: number = 30) {
    try {
      const cutoff = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000)

      const result = await prisma.chatSession.deleteMany({
        where: {
          AND: [
            { lastActivity: { lt: cutoff } },
            { status: 'completed' }
          ]
        }
      })

      console.log(`[Database Analytics] Cleaned up ${result.count} old sessions`)
      return result.count
    } catch (error) {
      console.error('[Database Analytics] Error cleaning up old sessions:', error)
      throw error
    }
  }
}

export default DatabaseAnalytics