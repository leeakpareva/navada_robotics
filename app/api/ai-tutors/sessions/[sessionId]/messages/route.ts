import { NextResponse, NextRequest } from 'next/server';
import { getCustomSession } from '@/lib/auth-helper';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    // TEMPORARILY DISABLE AUTH FOR TESTING
    console.log('Messages POST - Auth disabled for testing');

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

    const tutorSession = await prisma.tutorSession.findUnique({
      where: {
        id: params.sessionId,
        userId: user.id
      },
      include: {
        tutor: true
      }
    });

    if (!tutorSession) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    const {
      role,
      content,
      messageType = 'text',
      codeSnippet,
      imageUrl,
      audioUrl,
      metadata
    } = await request.json();

    if (!role || !content) {
      return NextResponse.json(
        { error: 'Role and content are required' },
        { status: 400 }
      );
    }

    const message = await prisma.tutorMessage.create({
      data: {
        sessionId: params.sessionId,
        role,
        content,
        messageType,
        codeSnippet,
        imageUrl,
        audioUrl,
        metadata
      }
    });

    // Update session message count and last activity
    await prisma.tutorSession.update({
      where: { id: params.sessionId },
      data: {
        messageCount: { increment: 1 },
        lastActivity: new Date()
      }
    });

    // If this is a user message, generate a tutor response
    if (role === 'user') {
      try {
        // Get recent messages for context
        const recentMessages = await prisma.tutorMessage.findMany({
          where: { sessionId: params.sessionId },
          orderBy: { timestamp: 'desc' },
          take: 10
        });

        // Get learning path context if available
        const learningPath = tutorSession.learningPathId
          ? await prisma.learningPath.findUnique({
              where: { id: tutorSession.learningPathId },
              include: {
                milestones: true,
                resources: true
              }
            })
          : null;

        // Get all user's learning paths for broader context
        const userLearningPaths = await prisma.learningPath.findMany({
          where: { userId: user.id },
          include: {
            milestones: true,
            resources: true
          },
          orderBy: { createdAt: 'desc' },
          take: 3
        });

        // Get user's recent sessions across all tutors for context
        const recentSessions = await prisma.tutorSession.findMany({
          where: { userId: user.id },
          include: {
            tutor: true,
            messages: {
              orderBy: { timestamp: 'desc' },
              take: 3
            }
          },
          orderBy: { lastActivity: 'desc' },
          take: 5
        });

        // Create enhanced context for AI response
        const context = {
          tutor: tutorSession.tutor,
          recentMessages: recentMessages.reverse(),
          learningPath,
          userLearningPaths,
          recentSessions,
          sessionType: tutorSession.sessionType,
          user: {
            id: user.id,
            name: user.name,
            subscriptionTier: user.subscriptionTier
          }
        };

        // Generate AI response using OpenAI (you can replace with your preferred AI service)
        const aiResponse = await generateTutorResponse(content, context);

        if (aiResponse) {
          const tutorMessage = await prisma.tutorMessage.create({
            data: {
              sessionId: params.sessionId,
              role: 'assistant',
              content: aiResponse.content,
              messageType: aiResponse.messageType || 'text',
              codeSnippet: aiResponse.codeSnippet,
              metadata: aiResponse.metadata
            }
          });

          // Update message count again
          await prisma.tutorSession.update({
            where: { id: params.sessionId },
            data: {
              messageCount: { increment: 1 },
              lastActivity: new Date()
            }
          });

          return NextResponse.json({
            userMessage: message,
            tutorMessage
          });
        }
      } catch (aiError) {
        console.error('Error generating AI response:', aiError);
        // Continue without AI response
      }
    }

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
}

async function generateTutorResponse(userMessage: string, context: any) {
  try {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = `You are ${context.tutor.name}, a ${context.tutor.specialization}.

Your personality: ${context.tutor.personality}
Your teaching style: ${context.tutor.teachingStyle}
Your specialization: ${context.tutor.specialization}

STUDENT CONTEXT:
- Name: ${context.user.name}
- Subscription: ${context.user.subscriptionTier}

${context.learningPath ? `
CURRENT LEARNING PATH: "${context.learningPath.title}"
- Learning objectives: ${JSON.stringify(context.learningPath.objectives)}
- Topics: ${JSON.stringify(context.learningPath.topics)}
- Current progress: ${context.learningPath.progress}%
- Difficulty: ${context.learningPath.difficulty}
${context.learningPath.milestones?.length > 0 ? `
- Milestones: ${context.learningPath.milestones.map(m => `${m.title} (${m.completed ? 'completed' : 'pending'})`).join(', ')}` : ''}
` : ''}

${context.userLearningPaths?.length > 0 ? `
STUDENT'S OTHER LEARNING PATHS:
${context.userLearningPaths.map(lp => `- "${lp.title}" (${lp.progress}% complete, ${lp.difficulty} level)`).join('\n')}
` : ''}

${context.recentSessions?.length > 0 ? `
RECENT LEARNING ACTIVITY:
${context.recentSessions.map(session => `- Worked with ${session.tutor.name} on ${session.sessionType} (${session.messageCount} messages)`).join('\n')}
` : ''}

Based on this context, respond as ${context.tutor.name} would, providing personalized guidance that considers the student's current learning journey, past progress, and goals. Reference their learning paths and previous work when relevant.

Remember to:
- Stay in character as ${context.tutor.name}
- Provide educational value tailored to their learning paths
- Be encouraging and reference their progress
- Connect concepts across their different learning paths when applicable
- Offer practical examples relevant to their current topics
- Ask follow-up questions that advance their learning goals`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...context.recentMessages.slice(-5).map((msg: any) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      })),
      { role: 'user', content: userMessage }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Check if response contains code
    const codeMatch = content.match(/```(\w+)?\n([\s\S]*?)```/);

    return {
      content: content,
      messageType: codeMatch ? 'code' : 'text',
      codeSnippet: codeMatch ? codeMatch[2] : null,
      metadata: {
        model: 'gpt-3.5-turbo',
        generated: true
      }
    };
  } catch (error) {
    console.error('Error generating tutor response:', error);
    return null;
  }
}