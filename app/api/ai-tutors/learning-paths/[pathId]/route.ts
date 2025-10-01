import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { pathId: string } }
) {
  try {
    // TEMPORARILY DISABLE AUTH FOR TESTING
    console.log('Learning Path DELETE - Auth disabled for testing');

    // Use test user for now
    const user = await prisma.users.findUnique({
      where: { email: 'test@tutors.ai' }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Test user not found' },
        { status: 404 }
      );
    }

    // Check if the learning path exists and belongs to the user
    const learningPath = await prisma.learningPath.findUnique({
      where: { id: params.pathId }
    });

    if (!learningPath) {
      return NextResponse.json(
        { error: 'Learning path not found' },
        { status: 404 }
      );
    }

    if (learningPath.userId !== user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Delete all related data in the correct order
    // First delete sessions
    await prisma.tutorSession.deleteMany({
      where: { learningPathId: params.pathId }
    });

    // Delete milestones
    await prisma.learningMilestone.deleteMany({
      where: { learningPathId: params.pathId }
    });

    // Delete resources
    await prisma.learningResource.deleteMany({
      where: { learningPathId: params.pathId }
    });

    // Finally delete the learning path
    await prisma.learningPath.delete({
      where: { id: params.pathId }
    });

    return NextResponse.json({
      success: true,
      message: 'Learning path deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting learning path:', error);
    return NextResponse.json(
      { error: 'Failed to delete learning path' },
      { status: 500 }
    );
  }
}