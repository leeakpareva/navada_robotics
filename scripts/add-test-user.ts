import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

const prisma = new PrismaClient()

async function main() {
  const email = 'test@test.com'
  const password = 'password123'

  // Check if test user already exists
  const existingUser = await prisma.users.findUnique({
    where: { email }
  })

  if (existingUser) {
    console.log('Test user already exists')
    return
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12)

  // Create test user
  const user = await prisma.users.create({
    data: {
      id: crypto.randomUUID(),
      name: 'Test User',
      email,
      password: hashedPassword,
      subscriptionTier: 'free',
      subscriptionStatus: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  })

  console.log('Test user created successfully!')
  console.log('Email:', email)
  console.log('Password:', password)
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })