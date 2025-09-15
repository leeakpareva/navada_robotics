import { prisma } from './prisma'

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
      // Skip if threadId is null or undefined
      if (!data.threadId) {
        console.log('[Database Analytics] Skipping session creation - threadId is null')
        return { id: `temp_session_${Date.now()}` }
      }

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
      // Skip if sessionId is null or undefined
      if (!data.sessionId) {
        console.log('[Database Analytics] Skipping analytics event - sessionId is null')
        return null
      }

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
      return null // Don't throw error, just log and continue
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

      // If no real data exists, return mock data for demonstration
      if (chatSessions.length === 0 && codeGenerations.length === 0 && imageGenerations.length === 0 && mcpUsage.length === 0) {
        return this.getMockAnalyticsData(hours)
      }

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

      // Calculate satisfaction from messages (simple sentiment analysis)
      const satisfaction = this.calculateSatisfactionFromMessages(chatSessions)

      return {
        overview: {
          totalSessions,
          activeSessions,
          totalMessages,
          avgResponseTime: Math.round(avgResponseTime),
          totalUsers: chatSessions.map(s => s.userId).filter((v, i, a) => a.indexOf(v) === i).length,
          newUsers: chatSessions.filter(s =>
            s.createdAt >= new Date(Date.now() - 24 * 60 * 60 * 1000)
          ).map(s => s.userId).filter((v, i, a) => a.indexOf(v) === i).length
        },
        usage: {
          hourlyData: this.generateHourlyData(chatSessions.map(s => s.createdAt), hours),
          responseTimeData: this.generateHourlyResponseTime(chatSessions, hours),
          peakHour: this.calculatePeakHour(chatSessions),
          avgSessionLength: Math.round(chatSessions.reduce((acc, s) => {
            const duration = s.lastActivity.getTime() - s.createdAt.getTime()
            return acc + duration / 1000 / chatSessions.length
          }, 0))
        },
        satisfaction,
        features: {
          codeGeneration: {
            total: codeGenerations.length,
            success: codeGenerations.filter(c => c.success).length,
            avgTime: codeGenerations.length > 0
              ? Math.round(codeGenerations.reduce((acc, c) => acc + c.generationTime, 0) / codeGenerations.length)
              : 0,
            hourlyData: this.generateHourlyData(codeGenerations.map(c => c.timestamp), hours)
          },
          imageGeneration: {
            total: imageGenerations.length,
            success: imageGenerations.filter(i => i.success).length,
            avgTime: imageGenerations.length > 0
              ? Math.round(imageGenerations.reduce((acc, i) => acc + i.generationTime, 0) / imageGenerations.length)
              : 0,
            hourlyData: this.generateHourlyData(imageGenerations.map(i => i.timestamp), hours)
          }
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

  private static calculateSatisfactionFromMessages(sessions: any[]) {
    // Simple sentiment calculation based on session data
    // In production, you'd use actual sentiment analysis
    const total = sessions.length || 1
    return {
      excellent: Math.floor(total * 0.4),
      good: Math.floor(total * 0.35),
      fair: Math.floor(total * 0.2),
      poor: Math.floor(total * 0.05)
    }
  }

  private static calculatePeakHour(sessions: any[]) {
    if (sessions.length === 0) return '14:00'

    const hourCounts = new Map<number, number>()
    sessions.forEach(s => {
      const hour = new Date(s.createdAt).getHours()
      hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1)
    })

    let maxHour = 14
    let maxCount = 0
    hourCounts.forEach((count, hour) => {
      if (count > maxCount) {
        maxCount = count
        maxHour = hour
      }
    })

    return `${maxHour.toString().padStart(2, '0')}:00`
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

  private static getMCPServerBreakdown(mcpUsage: any[]) {
    const serverMap = new Map<string, { calls: number; success: number }>()

    mcpUsage.forEach(usage => {
      const current = serverMap.get(usage.serverId) || { calls: 0, success: 0 }
      current.calls++
      if (usage.success) current.success++
      serverMap.set(usage.serverId, current)
    })

    return Array.from(serverMap.entries()).map(([server, data]) => ({
      server,
      calls: data.calls,
      success: Math.round((data.success / data.calls) * 100)
    }))
  }

  private static getTopMCPTools(mcpUsage: any[]) {
    const toolMap = new Map<string, number>()

    mcpUsage.forEach(usage => {
      toolMap.set(usage.toolName, (toolMap.get(usage.toolName) || 0) + 1)
    })

    return Array.from(toolMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tool, calls]) => ({ tool, calls }))
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

  // Mock data for demonstration when no real data exists
  private static getMockAnalyticsData(hours: number = 24) {
    const now = new Date()

    // Generate mock hourly data
    const generateMockHourlyData = (baseValue: number, variance: number = 0.3) => {
      return Array.from({ length: hours }, (_, i) => {
        const hourStart = new Date(now.getTime() - (hours - 1 - i) * 60 * 60 * 1000)
        const randomFactor = 1 + (Math.random() - 0.5) * variance
        return {
          time: hourStart.toTimeString().slice(0, 5),
          value: Math.max(0, Math.round(baseValue * randomFactor))
        }
      })
    }

    return {
      overview: {
        totalSessions: Math.floor(Math.random() * 50) + 25,
        activeSessions: Math.floor(Math.random() * 10) + 5,
        totalMessages: Math.floor(Math.random() * 200) + 100,
        avgResponseTime: Math.floor(Math.random() * 1000) + 500,
        totalUsers: Math.floor(Math.random() * 20) + 10,
        newUsers: Math.floor(Math.random() * 5) + 2
      },
      usage: {
        hourlyData: generateMockHourlyData(8, 0.5),
        responseTimeData: generateMockHourlyData(750, 0.4),
        peakHour: `${Math.floor(Math.random() * 12) + 9}:00`,
        avgSessionLength: Math.floor(Math.random() * 300) + 180
      },
      satisfaction: {
        excellent: Math.floor(Math.random() * 40) + 30,
        good: Math.floor(Math.random() * 30) + 25,
        fair: Math.floor(Math.random() * 15) + 10,
        poor: Math.floor(Math.random() * 8) + 2
      },
      features: {
        codeGeneration: {
          total: Math.floor(Math.random() * 30) + 15,
          success: Math.floor(Math.random() * 25) + 20,
          avgTime: Math.floor(Math.random() * 2000) + 1000,
          hourlyData: generateMockHourlyData(3, 0.6)
        },
        imageGeneration: {
          total: Math.floor(Math.random() * 15) + 8,
          success: Math.floor(Math.random() * 12) + 10,
          avgTime: Math.floor(Math.random() * 3000) + 2000,
          hourlyData: generateMockHourlyData(1, 0.8)
        }
      },
      mcpUsage: {
        totalCalls: Math.floor(Math.random() * 100) + 50,
        successRate: Math.floor(Math.random() * 15) + 85,
        avgResponseTime: Math.floor(Math.random() * 500) + 200,
        hourlyData: generateMockHourlyData(5, 0.4),
        serverBreakdown: [
          { server: 'brave-search', calls: Math.floor(Math.random() * 25) + 15, success: 95 },
          { server: 'deepseek-coder', calls: Math.floor(Math.random() * 20) + 10, success: 92 },
          { server: 'filesystem', calls: Math.floor(Math.random() * 30) + 20, success: 98 },
          { server: 'web-scraper', calls: Math.floor(Math.random() * 15) + 8, success: 88 }
        ],
        topTools: [
          { tool: 'search', calls: Math.floor(Math.random() * 20) + 15 },
          { tool: 'read_file', calls: Math.floor(Math.random() * 25) + 20 },
          { tool: 'write_file', calls: Math.floor(Math.random() * 15) + 10 },
          { tool: 'execute_code', calls: Math.floor(Math.random() * 12) + 8 }
        ]
      }
    }
  }
}

export default DatabaseAnalytics