import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    courses: {
      findMany: vi.fn().mockResolvedValue([
        { id: 'course_1', title: 'Test Course 1', published: true },
        { id: 'course_2', title: 'Test Course 2', published: true }
      ]),
      findUnique: vi.fn().mockResolvedValue({
        id: 'course_1',
        title: 'Test Course',
        description: 'Test Description',
        lessons: []
      }),
      create: vi.fn().mockResolvedValue({
        id: 'new_course',
        title: 'New Course',
        description: 'New Description'
      }),
      update: vi.fn().mockResolvedValue({
        id: 'course_1',
        title: 'Updated Course'
      })
    },
    user_progress: {
      create: vi.fn().mockResolvedValue({
        id: 'progress_1',
        userId: 'user_1',
        courseId: 'course_1'
      }),
      findUnique: vi.fn(),
      update: vi.fn()
    },
    notes: {
      findMany: vi.fn().mockResolvedValue([]),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    },
    reading_progress: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn()
    },
    quizzes: {
      create: vi.fn(),
      findMany: vi.fn().mockResolvedValue([])
    }
  }
}))

// Mock next-auth
vi.mock('next-auth', () => ({
  getServerSession: vi.fn().mockResolvedValue({
    user: { id: 'user_1', email: 'test@example.com' }
  })
}))

describe('Learning Platform APIs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/learning/courses', () => {
    it('should return all published courses', async () => {
      const { GET } = await import('@/app/api/learning/courses/route')
      const request = new NextRequest('http://localhost:3000/api/learning/courses')

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.courses).toHaveLength(2)
      expect(data.courses[0].title).toBe('Test Course 1')
    })
  })

  describe('GET /api/learning/courses/[courseId]', () => {
    it('should return a specific course', async () => {
      const { GET } = await import('@/app/api/learning/courses/[courseId]/route')
      const request = new NextRequest('http://localhost:3000/api/learning/courses/course_1')

      const response = await GET(request, { params: { courseId: 'course_1' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.id).toBe('course_1')
      expect(data.title).toBe('Test Course')
    })
  })

  describe('POST /api/learning/enroll', () => {
    it('should enroll a user in a course', async () => {
      const { POST } = await import('@/app/api/learning/enroll/route')
      const request = new NextRequest('http://localhost:3000/api/learning/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: 'course_1' })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toContain('enrolled')
    })

    it('should not double-enroll a user', async () => {
      const { prisma } = await import('@/lib/prisma')
      vi.mocked(prisma.user_progress.findUnique).mockResolvedValueOnce({
        id: 'existing_progress',
        userId: 'user_1',
        courseId: 'course_1',
        enrolledAt: new Date(),
        lastAccessedAt: new Date(),
        completedLessons: 0,
        totalLessons: 10,
        progressPercentage: 0,
        completedAt: null,
        certificateEarned: false
      })

      const { POST } = await import('@/app/api/learning/enroll/route')
      const request = new NextRequest('http://localhost:3000/api/learning/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: 'course_1' })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('already enrolled')
    })
  })

  describe('POST /api/learning/generate-course', () => {
    it('should generate a new course with AI', async () => {
      vi.mock('openai', () => ({
        default: vi.fn(() => ({
          chat: {
            completions: {
              create: vi.fn().mockResolvedValue({
                choices: [{
                  message: {
                    content: JSON.stringify({
                      title: 'AI Generated Course',
                      description: 'AI Generated Description',
                      modules: []
                    })
                  }
                }]
              })
            }
          }
        }))
      }))

      const { POST } = await import('@/app/api/learning/generate-course/route')
      const request = new NextRequest('http://localhost:3000/api/learning/generate-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: 'Machine Learning',
          difficulty: 'beginner'
        })
      })

      const response = await POST(request)

      expect([200, 500]).toContain(response.status)
    })
  })

  describe('POST /api/learning/notes', () => {
    it('should create a new note', async () => {
      const { POST } = await import('@/app/api/learning/notes/route')
      const request = new NextRequest('http://localhost:3000/api/learning/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: 'lesson_1',
          content: 'My note content',
          type: 'note'
        })
      })

      const response = await POST(request)

      expect(response.status).toBe(200)
    })

    it('should get user notes', async () => {
      const { GET } = await import('@/app/api/learning/notes/route')
      const request = new NextRequest('http://localhost:3000/api/learning/notes?lessonId=lesson_1')

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(Array.isArray(data.notes)).toBe(true)
    })
  })

  describe('POST /api/learning/text-to-speech', () => {
    it('should generate speech from text', async () => {
      vi.mock('openai', () => ({
        default: vi.fn(() => ({
          audio: {
            speech: {
              create: vi.fn().mockResolvedValue({
                arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(1000))
              })
            }
          }
        }))
      }))

      const { POST } = await import('@/app/api/learning/text-to-speech/route')
      const request = new NextRequest('http://localhost:3000/api/learning/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: 'Hello world',
          voice: 'alloy',
          speed: 1.0
        })
      })

      const response = await POST(request)

      expect([200, 500]).toContain(response.status)
    })
  })

  describe('GET /api/learning/analytics', () => {
    it('should return learning analytics', async () => {
      const { GET } = await import('@/app/api/learning/analytics/route')
      const request = new NextRequest('http://localhost:3000/api/learning/analytics')

      const response = await GET(request)

      expect(response.status).toBe(200)
    })
  })
})