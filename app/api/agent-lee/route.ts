import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const API_KEY = process.env.OPENAI_API_KEY
const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID
const VOICE_PROMPT_ID = process.env.VOICE_PROMPT_ID

console.log("[v0] Environment debug:")
console.log("[v0] OPENAI_API_KEY exists:", !!API_KEY)
console.log("[v0] OPENAI_ASSISTANT_ID exists:", !!ASSISTANT_ID)
console.log("[v0] VOICE_PROMPT_ID exists:", !!VOICE_PROMPT_ID)
console.log(
  "[v0] All env vars:",
  Object.keys(process.env).filter((key) => key.includes("OPENAI")),
)

const mockResponses = {
  robotics: `Getting started with robotics is exciting! The Raspberry Pi 4 makes an excellent foundation for your first robot. You'll want to begin with basic sensors like ultrasonic distance sensors and a camera module for vision.

Python is the ideal programming language for beginners because of its extensive robotics libraries. Start with simple projects like obstacle avoidance or line following robots to build your skills gradually.

Would you like specific guidance on any particular aspect of robotics?`,

  python: `Python is perfect for robotics development! Start with the fundamentals like variables, loops, and functions, then move into robotics-specific libraries like RPi.GPIO for hardware control and OpenCV for computer vision.

The key is building practical projects as you learn. Try creating a sensor data logger first, then progress to motor control systems and computer vision applications.

What specific Python concept would you like to explore?`,

  "computer vision": `Computer vision enables robots to see and understand their environment. OpenCV is the primary library you'll use, starting with basic image processing like filtering and edge detection.

For robotics applications, focus on object detection and tracking. These skills are essential for autonomous navigation and manipulation tasks.

Which computer vision application interests you most?`,

  "deep learning": `Deep learning transforms robotics by enabling intelligent decision making. Start with convolutional neural networks for image recognition, then explore reinforcement learning for autonomous behavior.

TensorFlow and PyTorch are the main frameworks. TensorFlow Lite is particularly useful for deploying models on Raspberry Pi and other edge devices.

What deep learning application would you like to implement?`,

  "raspberry pi": `The Raspberry Pi 4 is an excellent robotics platform with its quad-core processor and extensive GPIO capabilities. It can handle computer vision, motor control, and sensor integration simultaneously.

Start with basic GPIO programming to control LEDs and read sensors, then progress to more complex projects like autonomous robots or robotic arms.

What type of Pi-based project are you planning?`,

  default: `Hello! I'm Agent Lee, your AI robotics instructor. I specialize in helping you learn robotics, Python programming, computer vision, and AI development.

I can guide you through practical projects, explain complex concepts clearly, and help troubleshoot your code. My teaching approach focuses on hands-on learning with real-world applications.

What would you like to learn about today?`,
}

function generateMockResponse(message: string): string {
  const lowerMessage = message.toLowerCase()
  const isDetailRequest =
    lowerMessage.includes("detail") ||
    lowerMessage.includes("explain more") ||
    lowerMessage.includes("comprehensive") ||
    lowerMessage.includes("in depth")

  let baseResponse = ""

  if (lowerMessage.includes("robot") || lowerMessage.includes("robotic")) {
    baseResponse = mockResponses.robotics
  } else if (lowerMessage.includes("python") || lowerMessage.includes("programming")) {
    baseResponse = mockResponses.python
  } else if (
    lowerMessage.includes("computer vision") ||
    lowerMessage.includes("opencv") ||
    lowerMessage.includes("camera")
  ) {
    baseResponse = mockResponses["computer vision"]
  } else if (
    lowerMessage.includes("deep learning") ||
    lowerMessage.includes("neural network") ||
    lowerMessage.includes("ai")
  ) {
    baseResponse = mockResponses["deep learning"]
  } else if (lowerMessage.includes("raspberry pi") || lowerMessage.includes("pi 4") || lowerMessage.includes("gpio")) {
    baseResponse = mockResponses["raspberry pi"]
  } else {
    baseResponse = mockResponses.default
  }

  return baseResponse
}

const openai = API_KEY
  ? new OpenAI({
      apiKey: API_KEY,
    })
  : null

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Agent Lee API called")

    const { message, threadId } = await request.json()
    console.log("[v0] Received message:", message, "threadId:", threadId)

    if (!message || typeof message !== "string") {
      console.log("[v0] Invalid message format")
      return NextResponse.json({ error: "Message is required and must be a string" }, { status: 400 })
    }

    if (!openai || !ASSISTANT_ID) {
      console.log("[v0] Using mock response - OpenAI not configured")

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

      const mockResponse = generateMockResponse(message)
      const mockThreadId = threadId || `mock_thread_${Date.now()}`

      return NextResponse.json({
        message: mockResponse,
        threadId: mockThreadId,
        timestamp: new Date().toISOString(),
        source: "mock", // Indicate this is a mock response
      })
    }

    let currentThreadId = threadId
    if (!currentThreadId) {
      try {
        const thread = await openai.beta.threads.create()
        currentThreadId = thread.id
        console.log("[v0] Created new thread:", currentThreadId)
      } catch (threadError) {
        console.error("[v0] Failed to create thread:", threadError)
        return NextResponse.json({ error: "Failed to create conversation thread" }, { status: 500 })
      }
    }

    console.log("[v0] Using thread ID:", currentThreadId)

    try {
      await openai.beta.threads.messages.create(currentThreadId, {
        role: "user",
        content: message,
      })
      console.log("[v0] Message added to thread")
    } catch (messageError) {
      console.error("[v0] Failed to add message:", messageError)
      return NextResponse.json({ error: "Failed to add message to conversation" }, { status: 500 })
    }

    let run
    try {
      run = await openai.beta.threads.runs.create(currentThreadId, {
        assistant_id: ASSISTANT_ID,
      })
      console.log("[v0] Created run:", run.id, "for thread:", currentThreadId)
    } catch (runError) {
      console.error("[v0] Failed to create run:", runError)
      return NextResponse.json({ error: "Failed to start assistant processing" }, { status: 500 })
    }

    let runStatus
    let attempts = 0
    const maxAttempts = 30 // 30 seconds timeout

    try {
      if (!currentThreadId || !run.id) {
        throw new Error(`Invalid parameters: threadId=${currentThreadId}, runId=${run.id}`)
      }

      // Try both method signatures for compatibility
      try {
        // New SDK signature: retrieve(threadId, runId)
        runStatus = await openai.beta.threads.runs.retrieve(currentThreadId, run.id)
      } catch (err) {
        // Fallback to alternative signature: retrieve(runId, { thread_id })
        runStatus = await openai.beta.threads.runs.retrieve(run.id as any, { 
          thread_id: currentThreadId 
        } as any)
      }
      console.log("[v0] Initial run status:", runStatus.status)

      while ((runStatus.status === "queued" || runStatus.status === "in_progress") && attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        try {
          // New SDK signature: retrieve(threadId, runId)
          runStatus = await openai.beta.threads.runs.retrieve(currentThreadId, run.id)
        } catch (err) {
          // Fallback to alternative signature: retrieve(runId, { thread_id })
          runStatus = await openai.beta.threads.runs.retrieve(run.id as any, { 
            thread_id: currentThreadId 
          } as any)
        }
        attempts++
        console.log("[v0] Run status check", attempts, ":", runStatus.status)
      }
    } catch (statusError) {
      console.error("[v0] Failed to check run status:", statusError)
      return NextResponse.json({ error: "Failed to check assistant processing status" }, { status: 500 })
    }

    if (attempts >= maxAttempts) {
      console.log("[v0] Run timed out after", maxAttempts, "seconds")
      return NextResponse.json({ error: "Assistant response timed out" }, { status: 500 })
    }

    if (runStatus.status === "completed") {
      try {
        const messages = await openai.beta.threads.messages.list(currentThreadId)
        const lastMessage = messages.data[0]

        if (lastMessage.role === "assistant" && lastMessage.content[0].type === "text") {
          const rawResponse = lastMessage.content[0].text.value
          // Remove markdown bold formatting (**text**)
          const response = rawResponse.replace(/\*\*(.*?)\*\*/g, '$1')
          console.log("[v0] Generated response:", response.substring(0, 100) + "...")

          return NextResponse.json({
            message: response,
            threadId: currentThreadId,
            timestamp: new Date().toISOString(),
          })
        } else {
          console.log("[v0] Unexpected message format:", lastMessage)
          return NextResponse.json({ error: "Unexpected response format from assistant" }, { status: 500 })
        }
      } catch (retrieveError) {
        console.error("[v0] Failed to retrieve messages:", retrieveError)
        return NextResponse.json({ error: "Failed to retrieve assistant response" }, { status: 500 })
      }
    } else {
      console.log("[v0] Run failed with status:", runStatus.status)
      if (runStatus.last_error) {
        console.log("[v0] Run error details:", JSON.stringify(runStatus.last_error, null, 2))
      }
      console.log("[v0] Full run status object:", JSON.stringify(runStatus, null, 2))
      return NextResponse.json(
        {
          error: `Assistant processing failed with status: ${runStatus.status}`,
          details: runStatus.last_error?.message || "Unknown error",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("[v0] Agent Lee API Error:", error)
    if (error instanceof Error) {
      console.error("[v0] Error message:", error.message)
      console.error("[v0] Error stack:", error.stack)
    }
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
