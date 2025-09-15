import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import OpenAI from "openai"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { text, voice = "alloy", speed = 1.0 } = body

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      )
    }

    // Limit text length to prevent excessive API costs
    if (text.length > 4000) {
      return NextResponse.json(
        { error: "Text is too long. Maximum 4000 characters allowed." },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API not configured" },
        { status: 500 }
      )
    }

    console.log("[TTS] Generating speech for text length:", text.length)

    // Generate speech using OpenAI TTS
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice as "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer",
      input: text,
      speed: speed,
      response_format: "mp3"
    })

    // Convert the response to a buffer
    const buffer = Buffer.from(await mp3.arrayBuffer())

    console.log("[TTS] Speech generated successfully, size:", buffer.length)

    // Return the audio file
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      }
    })

  } catch (error) {
    console.error("[TTS] Error generating speech:", error)

    if (error instanceof Error && error.message.includes('rate_limit')) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { error: "Failed to generate speech", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}