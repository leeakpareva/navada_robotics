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
    if (!session || session.user?.email !== "leeakpareva@gmail.com") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, difficulty, duration, category, isFreeTier, documentContext } = body

    if (!title) {
      return NextResponse.json(
        { error: "Course title is required" },
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

    // Generate comprehensive course content using Mistral AI
    const prompt = `Create a comprehensive course curriculum for: "${title}"

Course Parameters:
- Difficulty Level: ${difficulty}
- Duration: ${duration}
- Category: ${category}
- Tier: ${isFreeTier ? "Free" : "Paid"}${documentContext || ""}

Please generate:
1. A short description (max 150 characters)
2. A detailed description (300-500 words)
3. Prerequisites (if any)
4. 5-7 detailed learning outcomes
5. 6-8 course modules with:
   - Module title
   - Module description
   - Duration for each module
   - Detailed content outline (500+ words per module)
   - Lesson type (text, video, quiz, assignment)

Format the response as valid JSON with the following structure:
{
  "shortDescription": "...",
  "description": "...",
  "prerequisites": "...",
  "learningOutcomes": "...",
  "modules": [
    {
      "title": "...",
      "description": "...",
      "duration": "...",
      "content": "...",
      "lessonType": "...",
      "orderIndex": 0
    }
  ]
}`

    console.log("[Course Generation] Generating content for:", title)

    const response = await mistral.chat.complete({
      model: "mistral-large-latest",
      messages: [
        {
          role: "system",
          content: "You are an expert curriculum designer specializing in AI, robotics, and technical education. Generate comprehensive, practical, and engaging course content. Return valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      maxTokens: 4000,
      temperature: 0.7,
      responseFormat: { type: "json_object" }
    })

    if (!response.choices || !response.choices[0] || !response.choices[0].message) {
      throw new Error("No response from Mistral API")
    }

    const generatedContent = response.choices[0].message.content
    console.log("[Course Generation] Content generated successfully")

    // Parse the JSON response
    let courseData
    try {
      courseData = JSON.parse(generatedContent || "{}")
    } catch (parseError) {
      console.error("[Course Generation] Failed to parse Mistral response:", parseError)
      // Fallback to basic structure
      courseData = {
        shortDescription: `Learn ${title} with expert guidance`,
        description: `This comprehensive course covers all aspects of ${title}. You'll gain practical skills and theoretical knowledge through hands-on projects and real-world applications.`,
        prerequisites: difficulty === "Beginner" ? "No prior experience required" : "Basic programming knowledge recommended",
        learningOutcomes: `Master the fundamentals of ${title}\nBuild practical projects\nGain industry-relevant skills`,
        modules: []
      }
    }

    // Ensure all required fields exist
    const validatedData = {
      shortDescription: courseData.shortDescription || `Master ${title} in ${duration}`,
      description: courseData.description || `Comprehensive ${title} course`,
      prerequisites: courseData.prerequisites || "",
      learningOutcomes: courseData.learningOutcomes || "",
      modules: Array.isArray(courseData.modules) ? courseData.modules.map((module: any, index: number) => ({
        title: module.title || `Module ${index + 1}`,
        description: module.description || "",
        duration: module.duration || "1 week",
        content: module.content || "",
        lessonType: module.lessonType || "text",
        orderIndex: index
      })) : []
    }

    return NextResponse.json(validatedData)

  } catch (error) {
    console.error("[Course Generation] Error:", error)
    return NextResponse.json(
      { error: "Failed to generate course content", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}