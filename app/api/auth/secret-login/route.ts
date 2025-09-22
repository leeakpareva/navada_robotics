import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const VALID_SECRET = '54321';

export async function POST(request: Request) {
  try {
    const { secret } = await request.json();

    if (!secret) {
      return NextResponse.json(
        { error: 'Secret is required' },
        { status: 400 }
      );
    }

    if (secret !== VALID_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      );
    }

    // Create or find a test user
    const testUser = await prisma.users.upsert({
      where: { email: 'test@tutors.ai' },
      update: {
        name: 'Test User',
        updatedAt: new Date()
      },
      create: {
        id: 'test-user-id',
        email: 'test@tutors.ai',
        name: 'Test User',
        role: 'student',
        subscriptionTier: 'premium',
        subscriptionStatus: 'active',
        updatedAt: new Date()
      }
    });

    // Create a session token for the user
    const sessionToken = `test-session-${Date.now()}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

    await prisma.sessions.create({
      data: {
        id: `session-${Date.now()}`,
        sessionToken,
        userId: testUser.id,
        expires: expiresAt
      }
    });

    return NextResponse.json({
      success: true,
      user: {
        id: testUser.id,
        email: testUser.email,
        name: testUser.name
      },
      sessionToken
    });
  } catch (error) {
    console.error('Error in secret login:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}