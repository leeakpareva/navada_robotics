import OpenAI from 'openai'
import { prisma } from './prisma'

export interface KnowledgeEntry {
  id?: string
  title: string
  content: string
  summary?: string
  source?: string
  category?: string
  tags?: string[]
}

type EmbeddingProvider = (input: string) => Promise<number[]>

export interface RAGQuery {
  query: string
  category?: string
  limit?: number
}

export interface RAGResult {
  id: string
  title: string
  content: string
  summary?: string
  source?: string
  category: string
  relevanceScore: number
}

export class RAGService {
  private static readonly DEFAULT_LIMIT = 5
  private static readonly VECTOR_CANDIDATE_LIMIT = 200
  private static embeddingProvider: EmbeddingProvider | null = null
  private static openAIClient: OpenAI | null = null
  private static embeddingWarningLogged = false

  /**
   * Allow tests or alternative providers to supply a custom embedding generator.
   */
  static configureEmbeddingProvider(provider: EmbeddingProvider | null) {
    this.embeddingProvider = provider
    if (provider) {
      this.embeddingWarningLogged = false
    }
  }

  private static buildEmbeddingInput(...parts: Array<string | undefined | null>): string {
    return parts
      .map(part => part?.trim())
      .filter((part): part is string => Boolean(part && part.length > 0))
      .join('\n\n')
  }

  private static async getEmbeddingProvider(): Promise<EmbeddingProvider | null> {
    if (this.embeddingProvider) {
      return this.embeddingProvider
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return null
    }

    try {
      if (!this.openAIClient) {
        this.openAIClient = new OpenAI({ apiKey })
      }

      const model = process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small'
      this.embeddingProvider = async (input: string) => {
        const response = await this.openAIClient!.embeddings.create({
          model,
          input
        })

        const vector = response.data?.[0]?.embedding
        if (!vector || vector.length === 0) {
          throw new Error('Embedding provider returned an empty vector')
        }

        return vector
      }

      return this.embeddingProvider
    } catch (error) {
      console.error('[RAG Service] Failed to initialize embedding provider:', error)
      return null
    }
  }

  private static async generateEmbedding(text: string): Promise<number[] | null> {
    const input = text.trim()
    if (!input) {
      return null
    }

    try {
      const provider = await this.getEmbeddingProvider()
      if (!provider) {
        if (!this.embeddingWarningLogged) {
          console.warn('[RAG Service] Embedding provider not configured. Falling back to keyword search.')
          this.embeddingWarningLogged = true
        }
        return null
      }

      return await provider(input)
    } catch (error) {
      console.error('[RAG Service] Error generating embedding:', error)
      return null
    }
  }

  private static normalizeEmbedding(embedding: unknown): number[] | null {
    if (!embedding) {
      return null
    }

    if (Array.isArray(embedding)) {
      const values = embedding
        .map(value => (typeof value === 'number' ? value : Number(value)))
        .filter(value => Number.isFinite(value))

      return values.length > 0 ? values : null
    }

    if (typeof embedding === 'string') {
      try {
        const parsed = JSON.parse(embedding)
        return this.normalizeEmbedding(parsed)
      } catch (error) {
        console.warn('[RAG Service] Failed to parse stored embedding string:', error)
      }
    }

    return null
  }

  private static cosineSimilarity(a: number[], b: number[]): number {
    const length = Math.min(a.length, b.length)
    if (length === 0) {
      return 0
    }

    let dot = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < length; i++) {
      const valA = a[i]
      const valB = b[i]
      dot += valA * valB
      normA += valA * valA
      normB += valB * valB
    }

    if (normA === 0 || normB === 0) {
      return 0
    }

    return dot / (Math.sqrt(normA) * Math.sqrt(normB))
  }

  // Add knowledge to the knowledge base
  static async addKnowledge(data: KnowledgeEntry): Promise<string> {
    try {
      const embeddingInput = this.buildEmbeddingInput(data.title, data.summary, data.content)
      const embeddings = await this.generateEmbedding(embeddingInput)

      const knowledge = await prisma.knowledgeBase.create({
        data: {
          title: data.title,
          content: data.content,
          summary: data.summary,
          source: data.source,
          category: data.category || 'general',
          tags: data.tags ? JSON.stringify(data.tags) : undefined,
          embeddings: embeddings ?? undefined
        }
      })

      console.log(`[RAG Service] Added knowledge: ${data.title}`)
      return knowledge.id
    } catch (error) {
      console.error('[RAG Service] Error adding knowledge:', error)
      throw error
    }
  }

  // Search knowledge base
  static async search(query: RAGQuery): Promise<RAGResult[]> {
    try {
      const limit = query.limit || this.DEFAULT_LIMIT

      const queryEmbedding = await this.generateEmbedding(query.query)

      if (queryEmbedding) {
        const vectorCandidates = await prisma.knowledgeBase.findMany({
          where: {
            AND: [
              { isActive: true },
              query.category ? { category: query.category } : {}
            ]
          },
          take: this.VECTOR_CANDIDATE_LIMIT
        })

        const vectorResults = vectorCandidates
          .map(candidate => {
            const embedding = this.normalizeEmbedding(candidate.embeddings)
            if (!embedding) {
              return null
            }

            const similarity = this.cosineSimilarity(queryEmbedding, embedding)

            return {
              id: candidate.id,
              title: candidate.title,
              content: candidate.content,
              summary: candidate.summary || undefined,
              source: candidate.source || undefined,
              category: candidate.category,
              relevanceScore: similarity
            }
          })
          .filter((result): result is RAGResult => result !== null)
          .sort((a, b) => b.relevanceScore - a.relevanceScore)
          .slice(0, limit)

        if (vectorResults.length > 0) {
          return vectorResults
        }
      }

      const results = await prisma.knowledgeBase.findMany({
        where: {
          AND: [
            { isActive: true },
            query.category ? { category: query.category } : {},
            {
              OR: [
                { title: { contains: query.query, mode: 'insensitive' } },
                { content: { contains: query.query, mode: 'insensitive' } },
                { summary: { contains: query.query, mode: 'insensitive' } }
              ]
            }
          ]
        },
        take: limit,
        orderBy: { updatedAt: 'desc' }
      })

      const normalizedQuery = query.query.toLowerCase()
      return results
        .map(result => {
          const titleMatch = result.title.toLowerCase().includes(normalizedQuery) ? 3 : 0
          const summaryMatch = result.summary?.toLowerCase().includes(normalizedQuery) ? 2 : 0
          const contentMatch = result.content.toLowerCase().includes(normalizedQuery) ? 1 : 0

          return {
            id: result.id,
            title: result.title,
            content: result.content,
            summary: result.summary || undefined,
            source: result.source || undefined,
            category: result.category,
            relevanceScore: titleMatch + summaryMatch + contentMatch
          }
        })
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
    } catch (error) {
      console.error('[RAG Service] Error searching knowledge:', error)
      throw error
    }
  }

  // Get knowledge by category
  static async getByCategory(category: string, limit: number = 10): Promise<RAGResult[]> {
    try {
      const results = await prisma.knowledgeBase.findMany({
        where: {
          category,
          isActive: true
        },
        take: limit,
        orderBy: { updatedAt: 'desc' }
      })

      return results.map(result => ({
        id: result.id,
        title: result.title,
        content: result.content,
        summary: result.summary || undefined,
        source: result.source || undefined,
        category: result.category,
        relevanceScore: 1.0
      }))
    } catch (error) {
      console.error('[RAG Service] Error getting knowledge by category:', error)
      throw error
    }
  }

  // Update knowledge
  static async updateKnowledge(id: string, data: Partial<KnowledgeEntry>): Promise<void> {
    try {
      const existing = await prisma.knowledgeBase.findUnique({ where: { id } })
      if (!existing) {
        throw new Error(`Knowledge entry not found: ${id}`)
      }

      const embeddingInput = this.buildEmbeddingInput(
        data.title ?? existing.title,
        data.summary ?? existing.summary ?? undefined,
        data.content ?? existing.content
      )
      const embeddings = await this.generateEmbedding(embeddingInput)

      await prisma.knowledgeBase.update({
        where: { id },
        data: {
          title: data.title,
          content: data.content,
          summary: data.summary,
          source: data.source,
          category: data.category,
          tags: data.tags ? JSON.stringify(data.tags) : undefined,
          embeddings: embeddings ?? undefined,
          updatedAt: new Date()
        }
      })

      console.log(`[RAG Service] Updated knowledge: ${id}`)
    } catch (error) {
      console.error('[RAG Service] Error updating knowledge:', error)
      throw error
    }
  }

  // Delete knowledge
  static async deleteKnowledge(id: string): Promise<void> {
    try {
      await prisma.knowledgeBase.update({
        where: { id },
        data: { isActive: false }
      })

      console.log(`[RAG Service] Deactivated knowledge: ${id}`)
    } catch (error) {
      console.error('[RAG Service] Error deleting knowledge:', error)
      throw error
    }
  }

  // Get conversation context from recent messages
  static async getConversationContext(threadId: string, messageLimit: number = 5): Promise<string> {
    try {
      const messages = await prisma.chatMessage.findMany({
        where: { threadId },
        orderBy: { messageIndex: 'desc' },
        take: messageLimit
      })

      if (messages.length === 0) return ''

      const context = messages
        .reverse() // Most recent first to oldest
        .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n')

      return context
    } catch (error) {
      console.error('[RAG Service] Error getting conversation context:', error)
      return ''
    }
  }

  // Seed initial knowledge base with robotics and AI information
  static async seedKnowledgeBase(): Promise<void> {
    try {
      const knowledgeEntries: KnowledgeEntry[] = [
        {
          title: 'Raspberry Pi Robotics Basics',
          content: 'Raspberry Pi is an excellent platform for robotics projects. Key components include GPIO pins for sensor connections, camera module support, and compatibility with motor drivers. Popular robotics projects include line-following robots, obstacle-avoiding robots, and remote-controlled vehicles.',
          summary: 'Guide to using Raspberry Pi for robotics projects',
          category: 'robotics',
          tags: ['raspberry-pi', 'hardware', 'robotics', 'sensors']
        },
        {
          title: 'Computer Vision with OpenCV',
          content: 'OpenCV (Open Source Computer Vision Library) is a powerful tool for image processing and computer vision. Key functions include image filtering, object detection, face recognition, and motion tracking. Python bindings make it easy to integrate with robotics projects.',
          summary: 'Introduction to OpenCV for computer vision applications',
          category: 'computer-vision',
          tags: ['opencv', 'python', 'image-processing', 'ai']
        },
        {
          title: 'Python for AI and Machine Learning',
          content: 'Python is the leading language for AI development. Key libraries include NumPy for numerical computing, Pandas for data manipulation, TensorFlow and PyTorch for deep learning, and Scikit-learn for traditional machine learning algorithms.',
          summary: 'Essential Python libraries for AI development',
          category: 'ai-development',
          tags: ['python', 'machine-learning', 'tensorflow', 'pytorch']
        },
        {
          title: 'Arduino vs Raspberry Pi for Robotics',
          content: 'Arduino is best for real-time control and simple sensor interfacing, while Raspberry Pi excels at complex processing and computer vision. Arduino uses C++ programming and has excellent analog input capabilities. Raspberry Pi runs full Linux and supports high-level languages like Python.',
          summary: 'Comparison of Arduino and Raspberry Pi for robotics projects',
          category: 'robotics',
          tags: ['arduino', 'raspberry-pi', 'comparison', 'hardware']
        },
        {
          title: 'Deep Learning Fundamentals',
          content: 'Deep learning uses neural networks with multiple layers to learn complex patterns. Key concepts include forward propagation, backpropagation, gradient descent, and activation functions. Popular architectures include CNNs for image processing and RNNs for sequential data.',
          summary: 'Basic concepts of deep learning and neural networks',
          category: 'ai-development',
          tags: ['deep-learning', 'neural-networks', 'cnn', 'rnn']
        },
        {
          title: 'Robot Sensors and Actuators',
          content: 'Common robot sensors include ultrasonic sensors for distance measurement, IMU for orientation, cameras for vision, and encoders for wheel rotation. Actuators include servo motors for precise positioning, DC motors for continuous rotation, and stepper motors for accurate movement.',
          summary: 'Overview of sensors and actuators used in robotics',
          category: 'robotics',
          tags: ['sensors', 'actuators', 'hardware', 'motors']
        }
      ]

      for (const entry of knowledgeEntries) {
        // Check if entry already exists
        const existing = await prisma.knowledgeBase.findFirst({
          where: { title: entry.title }
        })

        if (!existing) {
          await this.addKnowledge(entry)
        }
      }

      console.log(`[RAG Service] Knowledge base seeded with ${knowledgeEntries.length} entries`)
    } catch (error) {
      console.error('[RAG Service] Error seeding knowledge base:', error)
      throw error
    }
  }

  // Get relevant context for a user query
  static async getRelevantContext(query: string, threadId?: string): Promise<string> {
    try {
      // Search knowledge base
      const knowledge = await this.search({ query, limit: 3 })

      // Get conversation context if threadId provided
      let conversationContext = ''
      if (threadId) {
        conversationContext = await this.getConversationContext(threadId, 3)
      }

      // Combine contexts
      let context = ''

      if (conversationContext) {
        context += `Recent conversation:\n${conversationContext}\n\n`
      }

      if (knowledge.length > 0) {
        context += 'Relevant knowledge:\n'
        knowledge.forEach((item, index) => {
          context += `${index + 1}. ${item.title}: ${item.summary || item.content.substring(0, 200)}...\n`
        })
      }

      return context
    } catch (error) {
      console.error('[RAG Service] Error getting relevant context:', error)
      return ''
    }
  }

  // List all categories
  static async getCategories(): Promise<string[]> {
    try {
      const categories = await prisma.knowledgeBase.findMany({
        select: { category: true },
        where: { isActive: true },
        distinct: ['category']
      })

      return categories.map(c => c.category)
    } catch (error) {
      console.error('[RAG Service] Error getting categories:', error)
      return []
    }
  }

  // Get knowledge stats
  static async getStats() {
    try {
      const total = await prisma.knowledgeBase.count({
        where: { isActive: true }
      })

      const byCategory = await prisma.knowledgeBase.groupBy({
        by: ['category'],
        where: { isActive: true },
        _count: { category: true }
      })

      return {
        totalEntries: total,
        byCategory: byCategory.map(item => ({
          category: item.category,
          count: item._count.category
        }))
      }
    } catch (error) {
      console.error('[RAG Service] Error getting stats:', error)
      return { totalEntries: 0, byCategory: [] }
    }
  }
}

export default RAGService
