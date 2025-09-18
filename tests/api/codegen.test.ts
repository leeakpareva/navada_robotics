import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const { runCodegenTask, trackCodeGeneration } = vi.hoisted(() => ({
  runCodegenTask: vi.fn(),
  trackCodeGeneration: vi.fn()
}))

vi.mock('@/lib/anthropic/codegenAnthropic', () => ({
  runCodegenTask
}))

vi.mock('@/lib/analytics', () => ({
  trackCodeGeneration
}))

import { POST } from '../../app/api/anthropic/codegen/route'

describe('Anthropic codegen API', () => {
  const originalInternal = process.env.INTERNAL_API_KEY
  const originalAnthropic = process.env.ANTHROPIC_API_KEY

  beforeEach(() => {
    runCodegenTask.mockReset()
    trackCodeGeneration.mockReset()
    process.env.INTERNAL_API_KEY = 'internal-key'
    process.env.ANTHROPIC_API_KEY = 'anthropic-key'
  })

  afterEach(() => {
    process.env.INTERNAL_API_KEY = originalInternal
    process.env.ANTHROPIC_API_KEY = originalAnthropic
  })

  it('returns 500 when internal key is missing', async () => {
    delete process.env.INTERNAL_API_KEY

    const request = new NextRequest('http://localhost/api/anthropic/codegen', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer anything'
      },
      body: JSON.stringify({
        instruction: 'generate code',
        model: 'claude',
        sessionId: 'session-1'
      })
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.error).toBe('Internal API key not configured')
  })

  it('returns 401 when authorization header is invalid', async () => {
    const request = new NextRequest('http://localhost/api/anthropic/codegen', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer wrong-key'
      },
      body: JSON.stringify({
        instruction: 'generate code',
        model: 'claude',
        sessionId: 'session-1'
      })
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body.error).toBe('Unauthorized access to code generation')
  })

  it('invokes code generation when authorized', async () => {
    runCodegenTask.mockResolvedValueOnce({
      success: true,
      message: 'Done',
      filesCreated: [{ path: 'index.ts' }],
      error: null
    })

    const request = new NextRequest('http://localhost/api/anthropic/codegen', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer internal-key'
      },
      body: JSON.stringify({
        instruction: 'generate code',
        model: 'claude',
        sessionId: 'session-1'
      })
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.success).toBe(true)
    expect(runCodegenTask).toHaveBeenCalledWith('generate code', 'claude')
    expect(trackCodeGeneration).toHaveBeenCalled()
  })
})
