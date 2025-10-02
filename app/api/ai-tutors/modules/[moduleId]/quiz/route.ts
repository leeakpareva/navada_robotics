import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

export async function POST(
  request: NextRequest,
  { params }: { params: { moduleId: string } }
) {
  try {
    // TEMPORARILY DISABLE AUTH FOR TESTING
    console.log('Module Quiz POST - Auth disabled for testing');

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

    // Get the module with content
    const moduleData = await prisma.learningMilestone.findUnique({
      where: { id: params.moduleId },
      include: {
        learningPath: {
          include: {
            tutor: true
          }
        }
      }
    });

    if (!moduleItem) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      );
    }

    // Check if user owns this learning path
    if (moduleData.learningPath.userId !== user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Check if module is completed
    if (!moduleData.completed) {
      return NextResponse.json(
        { error: 'Module must be completed before generating quiz' },
        { status: 400 }
      );
    }

    // Get module content for quiz generation
    const moduleContent = moduleData.metadata?.content;
    if (!moduleContent) {
      return NextResponse.json(
        { error: 'Module content not found. Generate content first.' },
        { status: 400 }
      );
    }

    // Generate quiz using Mistral AI
    const quizPrompt = `Create a multiple choice quiz based on this module content:

Module Title: ${moduleData.title}
Learning Path: ${moduleData.learningPath.title}
Difficulty: ${moduleData.learningPath.difficulty}

Module Content Summary:
${moduleContent.introduction}
${moduleContent.sections?.map(s => `${s.title}: ${s.content}`).join('\n') || ''}
${moduleContent.summary}

Create a quiz with 5-8 multiple choice questions that test:
1. Understanding of key concepts
2. Practical application
3. Problem-solving abilities
4. Real-world scenarios

Format as JSON with this structure:
{
  "title": "Quiz: ${moduleData.title}",
  "description": "Test your knowledge of the concepts covered in this module",
  "questions": [
    {
      "id": 1,
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Why this answer is correct"
    }
  ],
  "passingScore": 70,
  "timeLimit": 15
}

Make questions challenging but fair for ${moduleData.learningPath.difficulty} level learners.`;

    let generatedQuiz = null;

    if (MISTRAL_API_KEY) {
      try {
        const mistralResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${MISTRAL_API_KEY}`
          },
          body: JSON.stringify({
            model: 'mistral-medium',
            messages: [{ role: 'user', content: quizPrompt }],
            max_tokens: 3000,
            temperature: 0.7
          })
        });

        if (mistralResponse.ok) {
          const mistralData = await mistralResponse.json();
          const content = mistralData.choices[0]?.message?.content;

          if (content) {
            try {
              generatedQuiz = JSON.parse(content);
            } catch (parseError) {
              console.log('Failed to parse Mistral quiz JSON, using fallback');
            }
          }
        }
      } catch (error) {
        console.log('Mistral quiz generation failed, using fallback');
      }
    }

    // Fallback quiz if Mistral fails
    if (!generatedQuiz) {
      generatedQuiz = {
        title: `Quiz: ${moduleData.title}`,
        description: "Test your knowledge of the concepts covered in this module",
        questions: [
          {
            id: 1,
            question: `What is the main objective of ${moduleData.title}?`,
            options: [
              "To understand basic concepts",
              "To apply practical skills",
              "To complete the module",
              "All of the above"
            ],
            correctAnswer: 3,
            explanation: "The module aims to provide both understanding and practical application."
          },
          {
            id: 2,
            question: `Which difficulty level is this module designed for?`,
            options: [
              "Beginner",
              "Intermediate",
              "Advanced",
              moduleData.learningPath.difficulty
            ],
            correctAnswer: 3,
            explanation: `This module is specifically designed for ${moduleData.learningPath.difficulty} level learners.`
          }
        ],
        passingScore: 70,
        timeLimit: 10
      };
    }

    // Save quiz to database
    const updatedModule = await prisma.learningMilestone.update({
      where: { id: params.moduleId },
      data: {
        metadata: {
          ...moduleData.metadata,
          hasQuiz: true,
          quiz: generatedQuiz,
          quizGeneratedAt: new Date().toISOString()
        }
      }
    });

    return NextResponse.json({
      module: updatedModule,
      quiz: generatedQuiz
    });

  } catch (error) {
    console.error('Error generating module quiz:', error);
    return NextResponse.json(
      { error: 'Failed to generate module quiz' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { moduleId: string } }
) {
  try {
    // TEMPORARILY DISABLE AUTH FOR TESTING
    console.log('Module Quiz GET - Auth disabled for testing');

    const moduleItem = await prisma.learningMilestone.findUnique({
      where: { id: params.moduleId },
      include: {
        learningPath: true
      }
    });

    if (!moduleItem) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      );
    }

    const quiz = moduleData.metadata?.quiz || null;
    const hasQuiz = moduleData.metadata?.hasQuiz || false;

    return NextResponse.json({
      module,
      quiz,
      hasQuiz
    });

  } catch (error) {
    console.error('Error fetching module quiz:', error);
    return NextResponse.json(
      { error: 'Failed to fetch module quiz' },
      { status: 500 }
    );
  }
}