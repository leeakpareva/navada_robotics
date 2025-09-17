import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import Stripe from 'stripe'

// Mock Stripe
vi.mock('stripe', () => {
  const StripeMock = vi.fn(() => ({
    checkout: {
      sessions: {
        create: vi.fn(),
        retrieve: vi.fn()
      }
    },
    billingPortal: {
      sessions: {
        create: vi.fn()
      }
    },
    customers: {
      create: vi.fn(),
      retrieve: vi.fn(),
      update: vi.fn()
    },
    subscriptions: {
      create: vi.fn(),
      retrieve: vi.fn(),
      update: vi.fn(),
      cancel: vi.fn(),
      list: vi.fn()
    },
    webhookEndpoints: {
      create: vi.fn(),
      list: vi.fn()
    },
    webhooks: {
      constructEvent: vi.fn()
    }
  }))
  return { default: StripeMock }
})

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    users: {
      findUnique: vi.fn(),
      update: vi.fn()
    },
    subscriptions: {
      create: vi.fn(),
      update: vi.fn(),
      findUnique: vi.fn()
    },
    stripe_activities: {
      create: vi.fn()
    }
  }
}))

// Mock next-auth
vi.mock('next-auth', () => ({
  getServerSession: vi.fn().mockResolvedValue({
    user: { id: 'user_123', email: 'test@example.com' }
  })
}))

describe('Stripe Payment Processing', () => {
  let stripeMock: any

  beforeEach(() => {
    vi.clearAllMocks()
    const StripeConstructor = require('stripe').default
    stripeMock = new StripeConstructor()
  })

  describe('POST /api/stripe/create-checkout-session', () => {
    it('should create a checkout session for subscription', async () => {
      stripeMock.checkout.sessions.create.mockResolvedValue({
        id: 'cs_test_123',
        url: 'https://checkout.stripe.com/pay/cs_test_123'
      })

      const { POST } = await import('@/app/api/stripe/create-checkout-session/route')
      const request = new NextRequest('http://localhost:3000/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: 'price_123',
          tier: 'pro',
          successUrl: 'http://localhost:3000/success',
          cancelUrl: 'http://localhost:3000/cancel'
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.url).toBeDefined()
    })

    it('should handle missing price ID', async () => {
      const { POST } = await import('@/app/api/stripe/create-checkout-session/route')
      const request = new NextRequest('http://localhost:3000/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: 'pro'
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Price ID')
    })

    it('should create checkout with existing customer', async () => {
      const { prisma } = await import('@/lib/prisma')
      vi.mocked(prisma.users.findUnique).mockResolvedValue({
        id: 'user_123',
        email: 'test@example.com',
        name: 'Test User',
        password: null,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        subscriptionTier: 'free',
        subscriptionStatus: 'inactive',
        stripeCustomerId: 'cus_existing',
        role: 'student'
      })

      stripeMock.checkout.sessions.create.mockResolvedValue({
        id: 'cs_test_456',
        url: 'https://checkout.stripe.com/pay/cs_test_456'
      })

      const { POST } = await import('@/app/api/stripe/create-checkout-session/route')
      const request = new NextRequest('http://localhost:3000/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: 'price_123',
          tier: 'pro'
        })
      })

      const response = await POST(request)

      expect(response.status).toBe(200)
      expect(stripeMock.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          customer: 'cus_existing'
        })
      )
    })
  })

  describe('POST /api/stripe/create-portal-session', () => {
    it('should create a billing portal session', async () => {
      const { prisma } = await import('@/lib/prisma')
      vi.mocked(prisma.users.findUnique).mockResolvedValue({
        id: 'user_123',
        email: 'test@example.com',
        name: 'Test User',
        password: null,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        subscriptionTier: 'pro',
        subscriptionStatus: 'active',
        stripeCustomerId: 'cus_123',
        role: 'student'
      })

      stripeMock.billingPortal.sessions.create.mockResolvedValue({
        id: 'bps_123',
        url: 'https://billing.stripe.com/session/bps_123'
      })

      const { POST } = await import('@/app/api/stripe/create-portal-session/route')
      const request = new NextRequest('http://localhost:3000/api/stripe/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          returnUrl: 'http://localhost:3000/dashboard'
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.url).toBeDefined()
    })

    it('should reject portal session for non-customer', async () => {
      const { prisma } = await import('@/lib/prisma')
      vi.mocked(prisma.users.findUnique).mockResolvedValue({
        id: 'user_123',
        email: 'test@example.com',
        name: 'Test User',
        password: null,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        subscriptionTier: 'free',
        subscriptionStatus: 'inactive',
        stripeCustomerId: null,
        role: 'student'
      })

      const { POST } = await import('@/app/api/stripe/create-portal-session/route')
      const request = new NextRequest('http://localhost:3000/api/stripe/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('customer')
    })
  })

  describe('POST /api/stripe/webhook', () => {
    it('should handle checkout.session.completed event', async () => {
      const event = {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_123',
            customer: 'cus_123',
            subscription: 'sub_123',
            metadata: {
              userId: 'user_123',
              tier: 'pro'
            }
          }
        }
      }

      stripeMock.webhooks.constructEvent.mockReturnValue(event)

      const { POST } = await import('@/app/api/stripe/webhook/route')
      const request = new NextRequest('http://localhost:3000/api/stripe/webhook', {
        method: 'POST',
        headers: {
          'stripe-signature': 'test_signature'
        },
        body: JSON.stringify(event)
      })

      const response = await POST(request)

      expect(response.status).toBe(200)
    })

    it('should handle subscription updated event', async () => {
      const event = {
        type: 'customer.subscription.updated',
        data: {
          object: {
            id: 'sub_123',
            customer: 'cus_123',
            status: 'active',
            items: {
              data: [
                {
                  price: {
                    metadata: {
                      tier: 'enterprise'
                    }
                  }
                }
              ]
            }
          }
        }
      }

      stripeMock.webhooks.constructEvent.mockReturnValue(event)

      const { POST } = await import('@/app/api/stripe/webhook/route')
      const request = new NextRequest('http://localhost:3000/api/stripe/webhook', {
        method: 'POST',
        headers: {
          'stripe-signature': 'test_signature'
        },
        body: JSON.stringify(event)
      })

      const response = await POST(request)

      expect(response.status).toBe(200)
    })

    it('should handle subscription cancelled event', async () => {
      const event = {
        type: 'customer.subscription.deleted',
        data: {
          object: {
            id: 'sub_123',
            customer: 'cus_123'
          }
        }
      }

      stripeMock.webhooks.constructEvent.mockReturnValue(event)

      const { POST } = await import('@/app/api/stripe/webhook/route')
      const request = new NextRequest('http://localhost:3000/api/stripe/webhook', {
        method: 'POST',
        headers: {
          'stripe-signature': 'test_signature'
        },
        body: JSON.stringify(event)
      })

      const response = await POST(request)

      expect(response.status).toBe(200)
    })

    it('should reject invalid webhook signature', async () => {
      stripeMock.webhooks.constructEvent.mockImplementation(() => {
        throw new Error('Invalid signature')
      })

      const { POST } = await import('@/app/api/stripe/webhook/route')
      const request = new NextRequest('http://localhost:3000/api/stripe/webhook', {
        method: 'POST',
        headers: {
          'stripe-signature': 'invalid_signature'
        },
        body: JSON.stringify({})
      })

      const response = await POST(request)

      expect(response.status).toBe(400)
    })
  })

  describe('Subscription Management', () => {
    it('should track subscription activity', async () => {
      const { prisma } = await import('@/lib/prisma')

      await prisma.stripe_activities.create({
        data: {
          userId: 'user_123',
          stripeCustomerId: 'cus_123',
          stripeSubscriptionId: 'sub_123',
          eventType: 'subscription.created',
          eventSource: 'webhook',
          amount: 29.99,
          currency: 'usd',
          status: 'succeeded'
        }
      })

      expect(prisma.stripe_activities.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            eventType: 'subscription.created'
          })
        })
      )
    })

    it('should update user subscription status', async () => {
      const { prisma } = await import('@/lib/prisma')

      await prisma.users.update({
        where: { stripeCustomerId: 'cus_123' },
        data: {
          subscriptionTier: 'pro',
          subscriptionStatus: 'active'
        }
      })

      expect(prisma.users.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            subscriptionTier: 'pro',
            subscriptionStatus: 'active'
          })
        })
      )
    })
  })
})