import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const API_KEY = process.env.OPENAI_API_KEY
const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID
const VOICE_PROMPT_ID = "pmpt_68b4975074d0819087217d0b0717bb1b0c32a4ef223cc971"

const openai = API_KEY
  ? new OpenAI({
      apiKey: API_KEY,
    })
  : null

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    if (!openai || !API_KEY) {
      return NextResponse.json(
        {
          fallback: true,
          message: "Using browser TTS - OpenAI TTS not configured",
        },
        { status: 200 },
      )
    }

    const mp3 = await openai.audio.speech.create({
      model: "tts-1-hd",
      voice: "nova",
      input: text,
      speed: 1.0,
      response_format: "mp3",
      voice_prompt_id: VOICE_PROMPT_ID,
    })

    const buffer = Buffer.from(await mp3.arrayBuffer())

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": buffer.length.toString(),
      },
    })
  } catch (error) {
    console.error("[v0] TTS API error:", error)
    return NextResponse.json(
      {
        fallback: true,
        message: "OpenAI TTS failed - using browser TTS",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 200 },
    )
  }
}
