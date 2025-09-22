import { NextResponse, NextRequest } from 'next/server';
import { getCustomSession } from '@/lib/auth-helper';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('AI Tutors GET - Starting request');

    // TEMPORARILY DISABLE AUTH FOR TESTING
    console.log('AI Tutors GET - Auth disabled for testing, proceeding');

    const tutors = await prisma.aiTutor.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { sessions: true }
        }
      }
    });

    return NextResponse.json({ tutors });
  } catch (error) {
    console.error('Error fetching tutors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tutors' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // TEMPORARILY DISABLE AUTH FOR TESTING
    console.log('AI Tutors POST - Auth disabled for testing');

    const { tutorId, sessionType = 'chat' } = await request.json();

    if (!tutorId) {
      return NextResponse.json(
        { error: 'Tutor ID is required' },
        { status: 400 }
      );
    }

    // Use test user for now
    const user = await prisma.users.findUnique({
      where: { email: 'test@tutors.ai' }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const tutor = await prisma.aiTutor.findUnique({
      where: { id: tutorId }
    });

    if (!tutor) {
      return NextResponse.json(
        { error: 'Tutor not found' },
        { status: 404 }
      );
    }

    const tutorSession = await prisma.tutorSession.create({
      data: {
        userId: user.id,
        tutorId: tutor.id,
        sessionType,
        status: 'active'
      },
      include: {
        tutor: true,
        messages: true
      }
    });

    return NextResponse.json({ session: tutorSession });
  } catch (error) {
    console.error('Error creating tutor session:', error);
    return NextResponse.json(
      { error: 'Failed to create tutor session' },
      { status: 500 }
    );
  }
}