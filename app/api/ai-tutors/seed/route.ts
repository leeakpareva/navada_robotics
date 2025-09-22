import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    const tutors = [
      {
        id: 'marcus-tutor',
        name: 'Marcus',
        specialization: 'Technical Specialist',
        description: 'Marcus specializes in technical subjects including programming, mathematics, and engineering concepts. Perfect for students looking to master STEM fields with detailed explanations and practical examples.',
        personality: 'Analytical, precise, and methodical. Marcus breaks down complex problems into manageable steps.',
        teachingStyle: 'Structured learning with emphasis on practical applications and hands-on exercises',
        elevenLabsAgentId: 'agent_7901k5q2bg6vfkwb7twqdf289crp',
        capabilities: {
          subjects: ['Programming', 'Mathematics', 'Engineering', 'Computer Science', 'Data Science'],
          features: ['Code execution', 'Problem solving', 'Step-by-step explanations', 'Interactive exercises']
        }
      },
      {
        id: 'laura-tutor',
        name: 'Laura',
        specialization: 'Learning Specialist',
        description: 'Laura focuses on personalized learning strategies, study techniques, and academic support across various subjects. Ideal for students seeking guidance on learning methodologies and educational planning.',
        personality: 'Empathetic, encouraging, and adaptive. Laura creates a supportive learning environment.',
        teachingStyle: 'Personalized approach with focus on learning strategies and metacognition',
        elevenLabsAgentId: 'agent_6501k5q5hn4zf9eteg70jwra0ekp',
        capabilities: {
          subjects: ['Study Skills', 'Academic Planning', 'Learning Strategies', 'Critical Thinking', 'Research Methods'],
          features: ['Personalized plans', 'Study techniques', 'Goal setting', 'Progress tracking']
        }
      }
    ];

    for (const tutor of tutors) {
      await prisma.aiTutor.upsert({
        where: { id: tutor.id },
        update: tutor,
        create: tutor
      });
    }

    return NextResponse.json({
      message: 'Tutors seeded successfully',
      tutors: await prisma.aiTutor.findMany()
    });
  } catch (error) {
    console.error('Error seeding tutors:', error);
    return NextResponse.json(
      { error: 'Failed to seed tutors' },
      { status: 500 }
    );
  }
}