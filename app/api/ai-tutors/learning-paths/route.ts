import { NextResponse, NextRequest } from 'next/server';
import { getCustomSession } from '@/lib/auth-helper';
import { prisma } from '@/lib/prisma';

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

export async function GET(request: NextRequest) {
  try {
    // TEMPORARILY DISABLE AUTH FOR TESTING
    console.log('Learning Paths GET - Auth disabled for testing');

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

    const { searchParams } = new URL(request.url);
    const tutorId = searchParams.get('tutorId');

    const learningPaths = await prisma.learningPath.findMany({
      where: {
        userId: user.id,
        ...(tutorId && { tutorId })
      },
      include: {
        tutor: true,
        milestones: {
          orderBy: { orderIndex: 'asc' }
        },
        resources: {
          orderBy: { orderIndex: 'asc' }
        },
        _count: {
          select: { sessions: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ learningPaths });
  } catch (error) {
    console.error('Error fetching learning paths:', error);
    return NextResponse.json(
      { error: 'Failed to fetch learning paths' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // TEMPORARILY DISABLE AUTH FOR TESTING
    console.log('Learning Paths POST - Auth disabled for testing');

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

    // Check if user has reached the 3 learning paths limit
    const existingPathsCount = await prisma.learningPath.count({
      where: { userId: user.id }
    });

    if (existingPathsCount >= 3) {
      return NextResponse.json(
        { error: 'You have reached the maximum of 3 learning paths. Please delete an existing path to create a new one.' },
        { status: 400 }
      );
    }

    const {
      tutorId,
      topic,
      difficulty = 'intermediate',
      duration,
      objectives,
      useMistralAI = true
    } = await request.json();

    if (!tutorId || !topic) {
      return NextResponse.json(
        { error: 'Tutor ID and topic are required' },
        { status: 400 }
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

    let learningPathData;

    if (useMistralAI && MISTRAL_API_KEY) {
      try {
        const prompt = `Create a comprehensive learning path for "${topic}" at ${difficulty} level. The learning path should be designed for ${tutor.specialization} and match the teaching style: ${tutor.teachingStyle}.

Please provide a structured learning path with:
1. A clear title and description
2. 5-8 specific learning objectives
3. Key topics to cover (as an array)
4. Prerequisites (if any)
5. 4-6 learning milestones with descriptions
6. Learning resources for each milestone

Format the response as JSON with this structure:
{
  "title": "Learning path title",
  "description": "Detailed description",
  "objectives": ["objective1", "objective2", ...],
  "topics": ["topic1", "topic2", ...],
  "prerequisites": ["prereq1", "prereq2", ...],
  "milestones": [
    {
      "title": "Milestone title",
      "description": "Milestone description",
      "orderIndex": 0
    }
  ],
  "resources": [
    {
      "title": "Resource title",
      "type": "article|video|exercise|quiz",
      "content": "Resource description or content",
      "orderIndex": 0,
      "isRequired": true
    }
  ]
}`;

        const mistralResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${MISTRAL_API_KEY}`
          },
          body: JSON.stringify({
            model: 'mistral-medium',
            messages: [
              {
                role: 'user',
                content: prompt
              }
            ],
            max_tokens: 2000,
            temperature: 0.7
          })
        });

        if (mistralResponse.ok) {
          const mistralData = await mistralResponse.json();
          const content = mistralData.choices[0]?.message?.content;

          if (content) {
            try {
              learningPathData = JSON.parse(content);
              learningPathData.mistralGenerated = true;
              learningPathData.generationPrompt = prompt;
            } catch (parseError) {
              console.error('Error parsing Mistral response:', parseError);
              // Fall back to manual creation
            }
          }
        }
      } catch (mistralError) {
        console.error('Error calling Mistral API:', mistralError);
        // Fall back to manual creation
      }
    }

    // Fallback to manual creation if Mistral fails
    if (!learningPathData) {
      learningPathData = {
        title: `${topic} Learning Path`,
        description: `A comprehensive learning path for ${topic} designed by ${tutor.name}`,
        objectives: objectives || [`Master the fundamentals of ${topic}`, `Apply concepts practically`, `Build confidence in ${topic}`],
        topics: [topic],
        prerequisites: [],
        mistralGenerated: false
      };
    }

    // Determine number of modules based on difficulty
    const moduleCount = difficulty === 'beginner' ? 5 : difficulty === 'intermediate' ? 10 : 15;

    // Generate agenda modules using Mistral AI
    const agendaPrompt = `Create a structured learning agenda for "${topic}" at ${difficulty} level with exactly ${moduleCount} modules.

    For each module, provide:
    1. Module title (concise, descriptive)
    2. Learning objectives (2-3 specific goals)
    3. Estimated duration in hours
    4. Brief description of what will be covered
    5. Prerequisites (if any)

    Format as JSON with this structure:
    {
      "modules": [
        {
          "title": "Module Title",
          "objectives": ["objective 1", "objective 2"],
          "duration": 2,
          "description": "What this module covers",
          "prerequisites": ["prerequisite if any"],
          "orderIndex": 1
        }
      ]
    }

    Topic: ${topic}
    Difficulty: ${difficulty}
    Target modules: ${moduleCount}
    Student objectives: ${objectives || 'General understanding'}`;

    let agendaModules = [];
    if (useMistralAI && MISTRAL_API_KEY) {
      try {
        const agendaResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${MISTRAL_API_KEY}`
          },
          body: JSON.stringify({
            model: 'mistral-medium',
            messages: [{ role: 'user', content: agendaPrompt }],
            max_tokens: 3000,
            temperature: 0.7
          })
        });

        if (agendaResponse.ok) {
          const agendaData = await agendaResponse.json();
          const agendaContent = agendaData.choices[0]?.message?.content;
          if (agendaContent) {
            try {
              const parsedAgenda = JSON.parse(agendaContent);
              agendaModules = parsedAgenda.modules || [];
            } catch (parseError) {
              console.log('Failed to parse agenda JSON, using fallback');
            }
          }
        }
      } catch (error) {
        console.log('Mistral agenda generation failed, using fallback');
      }
    }

    // Fallback agenda generation if Mistral fails
    if (agendaModules.length === 0) {
      for (let i = 1; i <= moduleCount; i++) {
        agendaModules.push({
          title: `${topic} - Module ${i}`,
          objectives: [`Learn key concepts of module ${i}`, `Apply knowledge practically`],
          duration: difficulty === 'beginner' ? 1 : difficulty === 'intermediate' ? 2 : 3,
          description: `Comprehensive coverage of ${topic} concepts for module ${i}`,
          prerequisites: i === 1 ? [] : [`Completion of Module ${i-1}`],
          orderIndex: i
        });
      }
    }

    const learningPath = await prisma.learningPath.create({
      data: {
        userId: user.id,
        tutorId: tutor.id,
        title: learningPathData.title,
        description: learningPathData.description,
        objectives: learningPathData.objectives,
        difficulty,
        estimatedDuration: duration,
        topics: learningPathData.topics,
        prerequisites: learningPathData.prerequisites || [],
        mistralGenerated: learningPathData.mistralGenerated || false,
        generationPrompt: learningPathData.generationPrompt,
        status: 'active'
      }
    });

    // Create agenda modules as milestones
    const createdModules = [];
    for (const module of agendaModules) {
      const createdModule = await prisma.learningMilestone.create({
        data: {
          learningPathId: learningPath.id,
          title: module.title,
          description: module.description,
          orderIndex: module.orderIndex,
          completed: false,
          points: 10,
          metadata: {
            objectives: module.objectives,
            duration: module.duration,
            prerequisites: module.prerequisites,
            moduleType: 'agenda',
            hasContent: false,
            hasQuiz: false
          }
        }
      });
      createdModules.push(createdModule);
    }

    // Create traditional milestones if provided by Mistral
    if (learningPathData.milestones) {
      for (const milestone of learningPathData.milestones) {
        await prisma.learningMilestone.create({
          data: {
            learningPathId: learningPath.id,
            title: milestone.title,
            description: milestone.description,
            orderIndex: milestone.orderIndex + agendaModules.length,
            points: 100,
            metadata: {
              moduleType: 'milestone'
            }
          }
        });
      }
    }

    // Create resources if provided
    if (learningPathData.resources) {
      for (const resource of learningPathData.resources) {
        await prisma.learningResource.create({
          data: {
            learningPathId: learningPath.id,
            title: resource.title,
            type: resource.type || 'article',
            content: resource.content,
            orderIndex: resource.orderIndex,
            isRequired: resource.isRequired !== false
          }
        });
      }
    }

    const createdPath = await prisma.learningPath.findUnique({
      where: { id: learningPath.id },
      include: {
        tutor: true,
        milestones: {
          orderBy: { orderIndex: 'asc' }
        },
        resources: {
          orderBy: { orderIndex: 'asc' }
        }
      }
    });

    return NextResponse.json({ learningPath: createdPath });
  } catch (error) {
    console.error('Error creating learning path:', error);
    return NextResponse.json(
      { error: 'Failed to create learning path' },
      { status: 500 }
    );
  }
}