import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { RAGService } from '../lib/rag-service'

interface KnowledgeRecord {
  id: string
  title: string
  content: string
  summary: string | null
  source: string | null
  category: string
  tags: string | null
  embeddings: number[] | null
  isActive: boolean
  updatedAt: Date
}

const prismaMocks = vi.hoisted(() => {
  const knowledgeBaseStore: KnowledgeRecord[] = []

  const createMock = vi.fn(async ({ data }: any) => {
    const record: KnowledgeRecord = {
      id: `kb_${knowledgeBaseStore.length + 1}`,
      title: data.title,
      content: data.content,
      summary: data.summary ?? null,
      source: data.source ?? null,
      category: data.category ?? 'general',
      tags: data.tags ?? null,
      embeddings: data.embeddings ?? null,
      isActive: data.isActive ?? true,
      updatedAt: data.updatedAt ?? new Date()
    }

    knowledgeBaseStore.push(record)
    return record
  })

  const findManyMock = vi.fn(async (args: any = {}) => {
    let results = [...knowledgeBaseStore]
    const conditions = Array.isArray(args?.where?.AND) ? args.where.AND : []

    for (const condition of conditions) {
      if (typeof condition?.isActive === 'boolean') {
        results = results.filter(entry => entry.isActive === condition.isActive)
      }

      if (condition?.category) {
        results = results.filter(entry => entry.category === condition.category)
      }

      if (Array.isArray(condition?.OR)) {
        const orFilters = condition.OR as Array<Record<string, { contains: string }>>
        results = results.filter(entry =>
          orFilters.some(filter => {
            if (filter.title) {
              return entry.title.toLowerCase().includes(filter.title.contains.toLowerCase())
            }
            if (filter.content) {
              return entry.content.toLowerCase().includes(filter.content.contains.toLowerCase())
            }
            if (filter.summary) {
              return (entry.summary ?? '').toLowerCase().includes(filter.summary.contains.toLowerCase())
            }
            return false
          })
        )
      }
    }

    if (typeof args?.take === 'number') {
      results = results.slice(0, args.take)
    }

    return results
  })

  const updateMock = vi.fn(async ({ where, data }: any) => {
    const record = knowledgeBaseStore.find(entry => entry.id === where.id)
    if (!record) {
      throw new Error('Knowledge entry not found')
    }

    if (data.title !== undefined) record.title = data.title
    if (data.content !== undefined) record.content = data.content
    if (data.summary !== undefined) record.summary = data.summary
    if (data.source !== undefined) record.source = data.source
    if (data.category !== undefined) record.category = data.category
    if (data.tags !== undefined) record.tags = data.tags
    if (data.embeddings !== undefined) record.embeddings = data.embeddings ?? null
    record.updatedAt = data.updatedAt ?? new Date()

    return record
  })

  const findFirstMock = vi.fn(async ({ where }: any) => {
    if (where?.title) {
      return knowledgeBaseStore.find(entry => entry.title === where.title) ?? null
    }

    return knowledgeBaseStore[0] ?? null
  })

  const findUniqueMock = vi.fn(async ({ where }: any) => {
    return knowledgeBaseStore.find(entry => entry.id === where.id) ?? null
  })

  const countMock = vi.fn(async ({ where }: any = {}) => {
    if (typeof where?.isActive === 'boolean') {
      return knowledgeBaseStore.filter(entry => entry.isActive === where.isActive).length
    }

    return knowledgeBaseStore.length
  })

  const groupByMock = vi.fn(async () => [])
  const chatMessageFindManyMock = vi.fn(async () => [])

  return {
    knowledgeBaseStore,
    createMock,
    findManyMock,
    updateMock,
    findFirstMock,
    findUniqueMock,
    countMock,
    groupByMock,
    chatMessageFindManyMock
  }
})

const {
  knowledgeBaseStore,
  createMock,
  findManyMock,
  updateMock,
  findFirstMock,
  findUniqueMock,
  countMock,
  groupByMock,
  chatMessageFindManyMock
} = prismaMocks

vi.mock('../lib/prisma', () => ({
  prisma: {
    knowledgeBase: {
      create: prismaMocks.createMock,
      findMany: prismaMocks.findManyMock,
      update: prismaMocks.updateMock,
      findFirst: prismaMocks.findFirstMock,
      findUnique: prismaMocks.findUniqueMock,
      count: prismaMocks.countMock,
      groupBy: prismaMocks.groupByMock
    },
    chatMessage: {
      findMany: prismaMocks.chatMessageFindManyMock
    }
  }
}))

const resetTestEnvironment = () => {
  knowledgeBaseStore.length = 0
  createMock.mockClear()
  findManyMock.mockClear()
  updateMock.mockClear()
  findFirstMock.mockClear()
  findUniqueMock.mockClear()
  countMock.mockClear()
  groupByMock.mockClear()
  chatMessageFindManyMock.mockClear()
  chatMessageFindManyMock.mockImplementation(async () => [])
  RAGService.configureEmbeddingProvider(null)
}

describe('RAGService vector search', () => {
  beforeEach(resetTestEnvironment)

  afterEach(() => {
    RAGService.configureEmbeddingProvider(null)
  })

  it('stores generated embeddings when adding knowledge', async () => {
    const embedding = [0.2, 0.3, 0.5]
    const provider = vi.fn(async () => embedding)
    RAGService.configureEmbeddingProvider(provider)

    const id = await RAGService.addKnowledge({
      title: 'Robotics 101',
      summary: 'Basics of robotics',
      content: 'Robots use sensors and actuators to interact with the world.',
      category: 'robotics'
    })

    expect(provider).toHaveBeenCalledTimes(1)
    expect(id).toBe('kb_1')
    expect(knowledgeBaseStore[0].embeddings).toEqual(embedding)
    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ embeddings: embedding })
      })
    )
  })

  it('ranks knowledge using cosine similarity of stored embeddings', async () => {
    const provider = vi.fn(async (input: string) => {
      const normalized = input.toLowerCase()
      if (normalized.includes('robot')) {
        return [1, 0]
      }
      if (normalized.includes('vision')) {
        return [0, 1]
      }
      return [0.5, 0.5]
    })
    RAGService.configureEmbeddingProvider(provider)

    await RAGService.addKnowledge({
      title: 'Robot control fundamentals',
      summary: 'Learn how robots move',
      content: 'Robot control involves managing actuators and feedback loops.',
      category: 'robotics'
    })

    await RAGService.addKnowledge({
      title: 'Computer vision pipelines',
      summary: 'Vision for autonomous systems',
      content: 'Computer vision models interpret camera feeds and depth sensors.',
      category: 'computer-vision'
    })

    findManyMock.mockClear()

    const results = await RAGService.search({ query: 'robotics', limit: 2 })

    expect(provider).toHaveBeenCalled()
    expect(results).toHaveLength(2)
    expect(results[0].title).toContain('Robot')
    expect(results[0].relevanceScore).toBeGreaterThan(results[1].relevanceScore)
    expect(findManyMock).toHaveBeenCalledTimes(1)
  })
})

describe('RAGService contextual responses', () => {
  beforeEach(resetTestEnvironment)

  afterEach(() => {
    RAGService.configureEmbeddingProvider(null)
  })

  it('combines recent conversation and knowledge snippets into contextual output', async () => {
    await RAGService.addKnowledge({
      title: 'Sensor Fusion Basics',
      summary: 'Combine sensor data for accuracy.',
      content: 'Sensor fusion blends multiple sensor inputs to reduce noise and improve robustness.',
      category: 'robotics'
    })

    chatMessageFindManyMock.mockResolvedValueOnce([
      { role: 'user', content: 'How do I fuse sensor data?', messageIndex: 10 },
      { role: 'assistant', content: 'Consider complementary filters.', messageIndex: 11 }
    ])

    const context = await RAGService.getRelevantContext('sensor fusion', 'thread_123')

    expect(findManyMock).toHaveBeenCalled()
    expect(chatMessageFindManyMock).toHaveBeenCalledWith(expect.objectContaining({
      where: { threadId: 'thread_123' },
      orderBy: { messageIndex: 'desc' },
      take: 3
    }))
    expect(context).toContain('Recent conversation:')
    expect(context).toContain('User: How do I fuse sensor data?')
    expect(context).toContain('Relevant knowledge:')
    expect(context).toContain('Sensor Fusion Basics')
    expect(context).toContain('Combine sensor data for accuracy')
  })
})
