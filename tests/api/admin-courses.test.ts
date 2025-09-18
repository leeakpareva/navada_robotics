import { beforeEach, describe, expect, it, vi } from 'vitest'

const { findMany, createCourse, userProgressCount } = vi.hoisted(() => ({
  findMany: vi.fn(),
  createCourse: vi.fn(),
  userProgressCount: vi.fn()
}))

const { mockRequireAdmin, AdminAuthorizationError } = vi.hoisted(() => {
  class AdminAuthError extends Error {
    status: number

    constructor(message: string, status: number) {
      super(message)
      this.name = 'AdminAuthorizationError'
      this.status = status
    }
  }

  return {
    mockRequireAdmin: vi.fn(),
    AdminAuthorizationError: AdminAuthError
  }
})

vi.mock('@/lib/prisma', () => ({
  prisma: {
    courses: {
      findMany,
      create: createCourse
    },
    user_progress: {
      count: userProgressCount
    }
  }
}))

vi.mock('@/lib/auth', () => ({
  AdminAuthorizationError,
  requireAdmin: (...args: unknown[]) => mockRequireAdmin(...args)
}))

import { GET, POST } from '../../app/api/admin/courses/route'

describe('Admin courses API', () => {
  beforeEach(() => {
    mockRequireAdmin.mockReset()
    findMany.mockReset()
    createCourse.mockReset()
    userProgressCount.mockReset()
  })

  it('rejects unauthenticated access to GET', async () => {
    mockRequireAdmin.mockRejectedValueOnce(new AdminAuthorizationError('Authentication required', 401))

    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body.error).toBe('Authentication required')
    expect(mockRequireAdmin).toHaveBeenCalled()
  })

  it('rejects non-admin access to GET', async () => {
    mockRequireAdmin.mockRejectedValueOnce(new AdminAuthorizationError('Forbidden', 403))

    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(403)
    expect(body.error).toBe('Forbidden')
    expect(mockRequireAdmin).toHaveBeenCalled()
  })

  it('returns courses with stats for admin', async () => {
    mockRequireAdmin.mockResolvedValueOnce({ user: { email: 'admin@example.com' } })

    findMany.mockResolvedValueOnce([
      {
        id: 'course-1',
        title: 'Course 1',
        description: 'Desc',
        shortDescription: 'Short',
        duration: '4 weeks',
        difficulty: 'Beginner',
        category: 'General',
        isFreeTier: true,
        price: null,
        featured: false,
        published: true,
        thumbnailUrl: null,
        instructorId: null,
        prerequisites: null,
        learningOutcomes: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: {
          user_progress: 2,
          lessons: 4
        }
      }
    ])
    userProgressCount.mockResolvedValueOnce(1)

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(Array.isArray(data)).toBe(true)
    expect(data[0].enrollmentCount).toBe(2)
    expect(data[0].completionRate).toBe(50)
    expect(data[0].lessonCount).toBe(4)
  })

  it('rejects non-admin course creation', async () => {
    mockRequireAdmin.mockRejectedValueOnce(new AdminAuthorizationError('Forbidden', 403))

    const request = new Request('http://localhost/api/admin/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'Course',
        description: 'Desc'
      })
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(403)
    expect(body.error).toBe('Forbidden')
    expect(createCourse).not.toHaveBeenCalled()
    expect(mockRequireAdmin).toHaveBeenCalled()
  })

  it('creates course for admin', async () => {
    mockRequireAdmin.mockResolvedValueOnce({ user: { email: 'admin@example.com' } })

    createCourse.mockResolvedValueOnce({
      id: 'new-course',
      title: 'Course',
      description: 'Desc'
    })

    const request = new Request('http://localhost/api/admin/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'Course',
        description: 'Desc'
      })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.id).toBe('new-course')
    expect(createCourse).toHaveBeenCalled()
  })
})
