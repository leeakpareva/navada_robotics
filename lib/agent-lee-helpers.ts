import { DatabaseAnalytics } from './database-analytics'
import { RAGService } from './rag-service'

export async function initializeSession(threadId: string | null, apiProvider: string = 'openai') {
  const session = await DatabaseAnalytics.createOrUpdateChatSession({
    threadId: threadId || `thread_${Date.now()}`,
    apiProvider
  })

  return {
    sessionId: session.id,
    threadId: session.threadId
  }
}

export async function getMessageCount(threadId: string): Promise<number> {
  const history = await DatabaseAnalytics.getChatHistory(threadId)
  return history?.messages.length || 0
}

export async function saveUserMessage(sessionId: string, threadId: string, message: string) {
  const messageIndex = await getMessageCount(threadId)

  await DatabaseAnalytics.addChatMessage({
    sessionId,
    threadId,
    messageIndex,
    role: 'user',
    content: message
  })

  return messageIndex
}

export async function saveAssistantMessage(
  sessionId: string,
  threadId: string,
  content: string,
  messageIndex: number,
  imageData?: string,
  websiteData?: any,
  codeData?: any
) {
  await DatabaseAnalytics.addChatMessage({
    sessionId,
    threadId,
    messageIndex: messageIndex + 1,
    role: 'assistant',
    content,
    imageData,
    websiteData,
    codeData
  })
}

export async function trackEvent(
  sessionId: string,
  eventType: string,
  responseTime: number,
  success: boolean = true,
  errorDetails?: string
) {
  await DatabaseAnalytics.trackAnalyticsEvent({
    sessionId,
    eventType,
    responseTime,
    success,
    errorDetails
  })
}

export async function getRAGContext(message: string, threadId: string): Promise<string> {
  try {
    // Get relevant context from knowledge base and conversation history
    const context = await RAGService.getRelevantContext(message, threadId)

    if (context) {
      console.log('[Agent Lee] Using RAG context for enhanced response')
      return `\n\nRelevant context to consider in your response:\n${context}`
    }

    return ''
  } catch (error) {
    console.error('[Agent Lee] Error getting RAG context:', error)
    return ''
  }
}

export async function loadChatHistory(threadId: string) {
  try {
    const history = await DatabaseAnalytics.getChatHistory(threadId)
    if (history && history.messages.length > 0) {
      console.log(`[Agent Lee] Loaded ${history.messages.length} previous messages for thread ${threadId}`)
      return history.messages.map(msg => ({
        id: parseInt(msg.id) || Date.now(),
        text: msg.content,
        sender: msg.role === 'user' ? 'user' : 'agent',
        timestamp: msg.timestamp,
        image: msg.imageData || undefined,
        website: msg.websiteData || undefined
      }))
    }
    return null
  } catch (error) {
    console.error('[Agent Lee] Error loading chat history:', error)
    return null
  }
}

export async function endSession(threadId: string) {
  try {
    await DatabaseAnalytics.endChatSession(threadId)
    console.log(`[Agent Lee] Ended session for thread ${threadId}`)
  } catch (error) {
    console.error('[Agent Lee] Error ending session:', error)
  }
}