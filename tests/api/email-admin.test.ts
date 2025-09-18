import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const { findMany, aggregate, count, update } = vi.hoisted(() => ({
  findMany: vi.fn(),
  aggregate: vi.fn(),
  count: vi.fn(),
  update: vi.fn()
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    emailSubscriber: {
      findMany,
      aggregate,
      count,
      update
    }
  }
}))

import { GET, DELETE } from '../../app/api/emails/admin/route'

describe('Email admin API', () => {
  const originalAdminKey = process.env.EMAIL_ADMIN_KEY

  beforeEach(() => {
    findMany.mockReset()
    aggregate.mockReset()
    count.mockReset()
    update.mockReset()
    process.env.EMAIL_ADMIN_KEY = 'email-secret'
  })

  afterEach(() => {
    process.env.EMAIL_ADMIN_KEY = originalAdminKey
  })

  it('fails with 500 when EMAIL_ADMIN_KEY is missing', async () => {
    delete process.env.EMAIL_ADMIN_KEY

    const request = new NextRequest('http://localhost/api/emails/admin')
    const response = await GET(request)
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.error).toBe('Email admin key not configured')
  })

  it('rejects unauthorized access', async () => {
    const request = new NextRequest('http://localhost/api/emails/admin', {
      headers: {
        authorization: 'Bearer wrong'
      }
    })

    const response = await GET(request)
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body.error).toBe('Unauthorized')
  })

  it('returns subscriber data for authorized requests', async () => {
    findMany.mockResolvedValueOnce([
      {
        id: 'sub-1',
        email: 'user@example.com',
        source: 'signup',
        subscribedAt: new Date('2024-01-01T00:00:00Z'),
        isActive: true
      }
    ])
    aggregate.mockResolvedValueOnce({ _count: { id: 1 } })
    count.mockResolvedValueOnce(1)

    const request = new NextRequest('http://localhost/api/emails/admin', {
      headers: {
        authorization: 'Bearer email-secret'
      }
    })

    const response = await GET(request)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.subscribers).toHaveLength(1)
    expect(body.statistics.total).toBe(1)
  })

  it('deactivates a subscriber when authorized', async () => {
    update.mockResolvedValueOnce({
      email: 'user@example.com'
    })

    const request = new NextRequest('http://localhost/api/emails/admin', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer email-secret'
      },
      body: JSON.stringify({ email: 'user@example.com' })
    })

    const response = await DELETE(request)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.email).toBe('user@example.com')
    expect(update).toHaveBeenCalledWith({
      where: { email: 'user@example.com' },
      data: { isActive: false }
    })
  })
})
