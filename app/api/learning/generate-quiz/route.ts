import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { Mistral } from "@mistralai/mistralai"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { lessonTitle, lessonContent, difficulty = "medium", questionCount = 3 } = body

    if (!lessonTitle || !lessonContent) {
      return NextResponse.json(
        { error: "Lesson title and content are required" },
        { status: 400 }
      )
    }

    if (!MISTRAL_API_KEY) {
      return NextResponse.json(
        { error: "Mistral API not configured" },
        { status: 500 }
      )
    }

    const mistral = new Mistral({
      apiKey: MISTRAL_API_KEY,
    })

    // Generate quiz questions using Mistral AI
    const prompt = `Based on the following lesson content, generate ${questionCount} multiple-choice quiz questions to test student understanding:

Lesson Title: "${lessonTitle}"
Lesson Content: "${lessonContent.substring(0, 2000)}"
Difficulty Level: ${difficulty}

Requirements:
1. Create ${questionCount} multiple-choice questions that test key concepts from the lesson
2. Each question should have 4 options (A, B, C, D)
3. Questions should be relevant to the lesson content and appropriate for ${difficulty} level
4. Provide clear explanations for the correct answers
5. Questions should be practical and test real understanding, not just memorization

Format the response as valid JSON with the following structure:
{
  "questions": [
    {
      "id": "q1",
      "question": "Clear, specific question text",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "correctAnswer": 0,
      "explanation": "Detailed explanation of why this answer is correct"
    }
  ]
}`

    console.log("[Quiz Generation] Generating questions for:", lessonTitle)

    const response = await mistral.chat.complete({
      model: "mistral-large-latest",
      messages: [
        {
          role: "system",
          content: "You are an expert educational content creator specializing in generating high-quality quiz questions. Create engaging, clear, and educationally valuable questions that test real understanding. Return valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      maxTokens: 2000,
      temperature: 0.7,
      responseFormat: { type: "json_object" }
    })

    if (!response.choices || !response.choices[0] || !response.choices[0].message) {
      throw new Error("No response from Mistral API")
    }

    const generatedContent = response.choices[0].message.content
    console.log("[Quiz Generation] Questions generated successfully")

    // Parse the JSON response
    let quizData
    try {
      quizData = JSON.parse(generatedContent || "{}")
    } catch (parseError) {
      console.error("[Quiz Generation] Failed to parse Mistral response:", parseError)
      // Fallback to basic questions
      quizData = {
        questions: [
          {
            id: "q1",
            question: `What is a key concept from the lesson "${lessonTitle}"?`,
            options: [
              "A) First fundamental concept",
              "B) Second important principle",
              "C) Third essential element",
              "D) Fourth critical aspect"
            ],
            correctAnswer: 0,
            explanation: "This represents the primary learning objective of the lesson."
          },
          {
            id: "q2",
            question: `How would you apply the concepts from "${lessonTitle}" in practice?`,
            options: [
              "A) Through hands-on implementation",
              "B) By memorizing definitions",
              "C) By reading more theory",
              "D) By avoiding practical application"
            ],
            correctAnswer: 0,
            explanation: "Practical application is essential for mastering the concepts."
          },
          {
            id: "q3",
            question: `What is the most important takeaway from "${lessonTitle}"?`,
            options: [
              "A) Understanding the core principles",
              "B) Memorizing all details",
              "C) Skipping practical exercises",
              "D) Focusing only on theory"
            ],
            correctAnswer: 0,
            explanation: "Understanding core principles enables practical application and deeper learning."
          }
        ]
      }
    }

    // Ensure all required fields exist and are properly formatted
    const validatedQuestions = Array.isArray(quizData.questions) ? quizData.questions.map((q: any, index: number) => ({
      id: q.id || `q${index + 1}`,
      question: q.question || `Sample question ${index + 1} about ${lessonTitle}`,
      options: Array.isArray(q.options) && q.options.length === 4 ? q.options : [
        "A) Option 1",
        "B) Option 2",
        "C) Option 3",
        "D) Option 4"
      ],
      correctAnswer: typeof q.correctAnswer === 'number' && q.correctAnswer >= 0 && q.correctAnswer <= 3 ? q.correctAnswer : 0,
      explanation: q.explanation || "This is the correct answer based on the lesson content."
    })).slice(0, questionCount) : []

    return NextResponse.json({
      success: true,
      questions: validatedQuestions
    })

  } catch (error) {
    console.error("[Quiz Generation] Error:", error)
    return NextResponse.json(
      { error: "Failed to generate quiz questions", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}