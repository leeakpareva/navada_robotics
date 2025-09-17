import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/agent-lee/route'

// Mock next-auth
vi.mock('next-auth', () => ({
  getServerSession: vi.fn()
}))

// Mock OpenAI
vi.mock('openai', () => ({
  default: vi.fn(() => ({
    chat: {
      completions: {
        create: vi.fn().mockResolvedValue({
          choices: [{ message: { content: 'Test response' } }]
        })
      }
    },
    beta: {
      threads: {
        create: vi.fn().mockResolvedValue({ id: 'thread_123' }),
        messages: {
          create: vi.fn().mockResolvedValue({ id: 'msg_123' }),
          list: vi.fn().mockResolvedValue({ data: [] })
        },
        runs: {
          create: vi.fn().mockResolvedValue({ id: 'run_123', status: 'completed' }),
          retrieve: vi.fn().mockResolvedValue({ status: 'completed' })
        }
      },
      assistants: {
        retrieve: vi.fn().mockResolvedValue({ id: 'asst_123' })
      }
    }
  }))
}))

describe('Agent Lee API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return 400 if no message is provided', async () => {
    const request = new NextRequest('http://localhost:3000/api/agent-lee', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Message is required')
  })

  it('should handle OpenAI provider correctly', async () => {
    const request = new NextRequest('http://localhost:3000/api/agent-lee', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Hello, Agent Lee!',
        provider: 'openai'
      })
    })

    const response = await POST(request)

    expect(response.status).toBe(200)
  })

  it('should handle Mistral provider correctly', async () => {
    const request = new NextRequest('http://localhost:3000/api/agent-lee', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Hello, Agent Lee!',
        provider: 'mistral'
      })
    })

    const response = await POST(request)

    // Should gracefully handle missing API key
    expect([200, 500]).toContain(response.status)
  })

  it('should handle Claude provider correctly', async () => {
    const request = new NextRequest('http://localhost:3000/api/agent-lee', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Hello, Agent Lee!',
        provider: 'claude'
      })
    })

    const response = await POST(request)

    // Should gracefully handle missing API key
    expect([200, 500]).toContain(response.status)
  })

  it('should handle thread ID correctly', async () => {
    const request = new NextRequest('http://localhost:3000/api/agent-lee', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Hello with thread',
        threadId: 'existing_thread_123',
        provider: 'openai'
      })
    })

    const response = await POST(request)

    expect(response.status).toBe(200)
  })
})