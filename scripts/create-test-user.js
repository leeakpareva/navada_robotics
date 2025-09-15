const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const prisma = new PrismaClient()

async function createTestUser() {
  try {
    // Check if test user already exists
    const existingUser = await prisma.users.findUnique({
      where: { email: 'test@navada.com' }
    })

    if (existingUser) {
      console.log('Test user already exists!')
      console.log('Email: test@navada.com')
      console.log('Password: Test123!')
      return
    }

    // Create test user
    const hashedPassword = await bcrypt.hash('Test123!', 12)

    const user = await prisma.users.create({
      data: {
        id: crypto.randomUUID(),
        name: 'Test User',
        email: 'test@navada.com',
        password: hashedPassword,
        subscriptionTier: 'free',
        subscriptionStatus: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    })

    console.log('✅ Test user created successfully!')
    console.log('Email: test@navada.com')
    console.log('Password: Test123!')
    console.log('User ID:', user.id)
  } catch (error) {
    console.error('Error creating test user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser()