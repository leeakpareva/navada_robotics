const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const prisma = new PrismaClient()

const testUsers = [
  {
    name: 'Alice Johnson',
    email: 'alice@navada.com',
    password: 'Alice123!'
  },
  {
    name: 'Bob Smith',
    email: 'bob@navada.com',
    password: 'Bob123!'
  },
  {
    name: 'Carol Davis',
    email: 'carol@navada.com',
    password: 'Carol123!'
  },
  {
    name: 'David Wilson',
    email: 'david@navada.com',
    password: 'David123!'
  },
  {
    name: 'Emma Taylor',
    email: 'emma@navada.com',
    password: 'Emma123!'
  }
]

async function createAdditionalTestUsers() {
  console.log('🚀 Creating 5 additional test users...\n')

  for (const userData of testUsers) {
    try {
      // Check if user already exists
      const existingUser = await prisma.users.findUnique({
        where: { email: userData.email }
      })

      if (existingUser) {
        console.log(`⚠️  User ${userData.email} already exists! Skipping...`)
        continue
      }

      // Create test user
      const hashedPassword = await bcrypt.hash(userData.password, 12)

      const user = await prisma.users.create({
        data: {
          id: crypto.randomUUID(),
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          subscriptionTier: 'free',
          subscriptionStatus: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      })

      console.log(`✅ ${userData.name} created successfully!`)
      console.log(`   Email: ${userData.email}`)
      console.log(`   Password: ${userData.password}`)
      console.log(`   User ID: ${user.id}\n`)

    } catch (error) {
      console.error(`❌ Error creating user ${userData.email}:`, error)
    }
  }

  console.log('🎉 All test users creation process completed!')
  console.log('\n📋 Summary of all test accounts:')
  console.log('1. test@navada.com - Test123!')
  console.log('2. alice@navada.com - Alice123!')
  console.log('3. bob@navada.com - Bob123!')
  console.log('4. carol@navada.com - Carol123!')
  console.log('5. david@navada.com - David123!')
  console.log('6. emma@navada.com - Emma123!')
}

async function main() {
  try {
    await createAdditionalTestUsers()
  } catch (error) {
    console.error('Fatal error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()