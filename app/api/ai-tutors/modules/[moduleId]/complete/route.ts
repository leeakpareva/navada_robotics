import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { moduleId: string } }
) {
  try {
    // TEMPORARILY DISABLE AUTH FOR TESTING
    console.log('Module Complete POST - Auth disabled for testing');

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

    const { quizResults } = await request.json();

    // Get the module
    const module = await prisma.learningMilestone.findUnique({
      where: { id: params.moduleId },
      include: {
        learningPath: {
          include: {
            milestones: {
              orderBy: { orderIndex: 'asc' }
            }
          }
        }
      }
    });

    if (!module) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      );
    }

    // Check if user owns this learning path
    if (module.learningPath.userId !== user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Validate quiz results if provided
    let quizPassed = true;
    if (quizResults) {
      const quiz = module.metadata?.quiz;
      if (quiz) {
        const score = (quizResults.correctAnswers / quiz.questions.length) * 100;
        quizPassed = score >= quiz.passingScore;
      }
    }

    if (!quizPassed) {
      return NextResponse.json(
        { error: 'Quiz must be passed to complete module' },
        { status: 400 }
      );
    }

    // Mark module as completed
    const updatedModule = await prisma.learningMilestone.update({
      where: { id: params.moduleId },
      data: {
        completed: true,
        completedAt: new Date(),
        metadata: {
          ...module.metadata,
          quizResults: quizResults || null,
          completedAt: new Date().toISOString()
        }
      }
    });

    // Calculate learning path progress
    const totalModules = module.learningPath.milestones.length;
    const completedModules = module.learningPath.milestones.filter(m =>
      m.completed || m.id === params.moduleId
    ).length;
    const progress = Math.round((completedModules / totalModules) * 100);

    // Update learning path progress
    await prisma.learningPath.update({
      where: { id: module.learningPathId },
      data: {
        progress: progress,
        ...(progress === 100 && {
          status: 'completed',
          completedAt: new Date()
        })
      }
    });

    // Get updated learning path with all milestones
    const updatedLearningPath = await prisma.learningPath.findUnique({
      where: { id: module.learningPathId },
      include: {
        milestones: {
          orderBy: { orderIndex: 'asc' }
        },
        tutor: true
      }
    });

    return NextResponse.json({
      module: updatedModule,
      learningPath: updatedLearningPath,
      progress: progress,
      isCompleted: progress === 100
    });

  } catch (error) {
    console.error('Error completing module:', error);
    return NextResponse.json(
      { error: 'Failed to complete module' },
      { status: 500 }
    );
  }
}