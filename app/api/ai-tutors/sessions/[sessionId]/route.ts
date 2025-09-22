import { NextResponse, NextRequest } from 'next/server';
import { getCustomSession } from '@/lib/auth-helper';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const session = await getCustomSession(request);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await prisma.users.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const tutorSession = await prisma.tutorSession.findUnique({
      where: {
        id: params.sessionId,
        userId: user.id
      },
      include: {
        tutor: true,
        learningPath: {
          include: {
            milestones: true,
            resources: true
          }
        },
        messages: {
          orderBy: { timestamp: 'asc' }
        },
        interactions: {
          orderBy: { timestamp: 'desc' },
          take: 10
        }
      }
    });

    if (!tutorSession) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ session: tutorSession });
  } catch (error) {
    console.error('Error fetching tutor session:', error);
    return NextResponse.json(
      { error: 'Failed to fetch session' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const session = await getCustomSession(request);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await prisma.users.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const { status, sessionSummary, learningPathId } = await request.json();

    const tutorSession = await prisma.tutorSession.findUnique({
      where: {
        id: params.sessionId,
        userId: user.id
      }
    });

    if (!tutorSession) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    const updatedSession = await prisma.tutorSession.update({
      where: { id: params.sessionId },
      data: {
        ...(status && { status }),
        ...(sessionSummary && { sessionSummary }),
        ...(learningPathId && { learningPathId }),
        ...(status === 'completed' && { endTime: new Date() }),
        lastActivity: new Date()
      },
      include: {
        tutor: true,
        learningPath: true,
        messages: {
          orderBy: { timestamp: 'asc' }
        }
      }
    });

    return NextResponse.json({ session: updatedSession });
  } catch (error) {
    console.error('Error updating tutor session:', error);
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    );
  }
}