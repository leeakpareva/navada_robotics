import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

export async function POST(
  request: NextRequest,
  { params }: { params: { moduleId: string } }
) {
  try {
    // TEMPORARILY DISABLE AUTH FOR TESTING
    console.log('Module Content POST - Auth disabled for testing');

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

    // Get the module
    const module = await prisma.learningMilestone.findUnique({
      where: { id: params.moduleId },
      include: {
        learningPath: {
          include: {
            tutor: true
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

    // Generate detailed course content using Mistral AI
    const contentPrompt = `Create comprehensive course content for this learning module:

Module Title: ${module.title}
Module Description: ${module.description}
Learning Path: ${module.learningPath.title}
Difficulty: ${module.learningPath.difficulty}
Tutor Specialization: ${module.learningPath.tutor.specialization}

${module.metadata?.objectives ? `Learning Objectives: ${module.metadata.objectives.join(', ')}` : ''}
${module.metadata?.duration ? `Estimated Duration: ${module.metadata.duration} hours` : ''}

Create detailed course content including:
1. Introduction and overview
2. Key concepts and explanations
3. Practical examples and code snippets (if applicable)
4. Step-by-step exercises
5. Real-world applications
6. Summary and key takeaways

Format as JSON with this structure:
{
  "introduction": "Course introduction text",
  "sections": [
    {
      "title": "Section Title",
      "content": "Detailed content",
      "examples": ["example 1", "example 2"],
      "exercises": [
        {
          "title": "Exercise Title",
          "description": "What to do",
          "solution": "Expected solution or approach"
        }
      ]
    }
  ],
  "summary": "Key takeaways and summary",
  "estimatedTime": "30-45 minutes"
}

Make the content engaging, practical, and appropriate for ${module.learningPath.difficulty} level learners.`;

    let generatedContent = null;

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
            messages: [{ role: 'user', content: contentPrompt }],
            max_tokens: 4000,
            temperature: 0.7
          })
        });

        if (mistralResponse.ok) {
          const mistralData = await mistralResponse.json();
          const content = mistralData.choices[0]?.message?.content;

          if (content) {
            try {
              generatedContent = JSON.parse(content);
            } catch (parseError) {
              console.log('Failed to parse Mistral content JSON, using fallback');
            }
          }
        }
      } catch (error) {
        console.log('Mistral content generation failed, using fallback');
      }
    }

    // Fallback content if Mistral fails
    if (!generatedContent) {
      generatedContent = {
        introduction: `Welcome to ${module.title}. This module will cover the essential concepts and practical applications you need to master this topic.`,
        sections: [
          {
            title: "Core Concepts",
            content: `In this section, we'll explore the fundamental concepts of ${module.title}. Understanding these basics is crucial for your learning journey.`,
            examples: ["Basic example", "Practical application"],
            exercises: [
              {
                title: "Practice Exercise",
                description: "Apply what you've learned in this hands-on exercise",
                solution: "Work through the problem step by step"
              }
            ]
          }
        ],
        summary: `You've completed ${module.title}! You should now understand the key concepts and be ready to apply them in practice.`,
        estimatedTime: `${module.metadata?.duration || 1} hour(s)`
      };
    }

    // Save content to database
    const updatedModule = await prisma.learningMilestone.update({
      where: { id: params.moduleId },
      data: {
        metadata: {
          ...module.metadata,
          hasContent: true,
          content: generatedContent,
          contentGeneratedAt: new Date().toISOString()
        }
      }
    });

    return NextResponse.json({
      module: updatedModule,
      content: generatedContent
    });

  } catch (error) {
    console.error('Error generating module content:', error);
    return NextResponse.json(
      { error: 'Failed to generate module content' },
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
    console.log('Module Content GET - Auth disabled for testing');

    const module = await prisma.learningMilestone.findUnique({
      where: { id: params.moduleId },
      include: {
        learningPath: true
      }
    });

    if (!module) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      );
    }

    const content = module.metadata?.content || null;
    const hasContent = module.metadata?.hasContent || false;

    return NextResponse.json({
      module,
      content,
      hasContent
    });

  } catch (error) {
    console.error('Error fetching module content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch module content' },
      { status: 500 }
    );
  }
}