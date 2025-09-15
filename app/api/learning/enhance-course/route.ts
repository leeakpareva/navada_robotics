import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { courseTitle, courseDescription, level } = await request.json()

    if (!courseTitle || !courseDescription) {
      return NextResponse.json(
        { error: 'Missing course title or description' },
        { status: 400 }
      )
    }

    const prompt = `As an expert in AI and machine learning education, enhance this course outline:

Course Title: ${courseTitle}
Course Description: ${courseDescription}
Level: ${level}

Please provide a comprehensive enhancement with:

1. Detailed Learning Outcomes (5-6 specific, measurable outcomes)
2. Course Modules (6-8 modules with titles, duration, and brief descriptions)
3. Enhanced Course Description (2-3 paragraphs explaining what students will learn and build)
4. Recommended Prerequisites (if any)
5. Real-world Projects students will complete
6. Key Technologies and Tools they'll master

Format the response as a JSON object with these exact keys:
- enhancedDescription
- learningOutcomes (array)
- courseModules (array with title, duration, description, lessons)
- prerequisites (array)
- projects (array)
- technologies (array)

Focus on practical, hands-on learning with real-world applications.`

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })

    const content = message.content[0]
    if (content.type === 'text') {
      try {
        const enhancedCourse = JSON.parse(content.text)
        return NextResponse.json({ success: true, data: enhancedCourse })
      } catch (parseError) {
        // If JSON parsing fails, return the raw text
        return NextResponse.json({
          success: true,
          data: { rawResponse: content.text }
        })
      }
    }

    return NextResponse.json(
      { error: 'Unexpected response format from AI' },
      { status: 500 }
    )

  } catch (error) {
    console.error('Error enhancing course:', error)
    return NextResponse.json(
      { error: 'Failed to enhance course content' },
      { status: 500 }
    )
  }
}