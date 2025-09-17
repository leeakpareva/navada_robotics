import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST as registerPOST } from '@/app/api/auth/register/route'
import * as bcryptjs from 'bcryptjs'

// Mock bcryptjs
vi.mock('bcryptjs', () => ({
  hash: vi.fn().mockResolvedValue('hashed_password'),
  compare: vi.fn().mockResolvedValue(true)
}))

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    users: {
      findUnique: vi.fn(),
      create: vi.fn().mockResolvedValue({
        id: 'user_123',
        email: 'test@example.com',
        name: 'Test User'
      })
    }
  }
}))

describe('Authentication API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('User Registration', () => {
    it('should register a new user successfully', async () => {
      const { prisma } = await import('@/lib/prisma')
      vi.mocked(prisma.users.findUnique).mockResolvedValueOnce(null)

      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'newuser@example.com',
          password: 'SecurePassword123!',
          name: 'New User'
        })
      })

      const response = await registerPOST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.user.email).toBe('test@example.com')
    })

    it('should reject registration with existing email', async () => {
      const { prisma } = await import('@/lib/prisma')
      vi.mocked(prisma.users.findUnique).mockResolvedValueOnce({
        id: 'existing_user',
        email: 'existing@example.com',
        name: 'Existing User',
        password: 'hashed',
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        subscriptionTier: 'free',
        subscriptionStatus: 'inactive',
        stripeCustomerId: null,
        role: 'student'
      })

      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'existing@example.com',
          password: 'Password123!',
          name: 'Another User'
        })
      })

      const response = await registerPOST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('already')
    })

    it('should reject registration with invalid email', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'invalid-email',
          password: 'Password123!',
          name: 'Test User'
        })
      })

      const response = await registerPOST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('email')
    })

    it('should reject registration with weak password', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: '123',
          name: 'Test User'
        })
      })

      const response = await registerPOST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBeDefined()
    })
  })
})