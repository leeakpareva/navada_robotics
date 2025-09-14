import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { trackChatSession, updateChatSession } from "@/lib/analytics"

const API_KEY = process.env.OPENAI_API_KEY
const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID
const VOICE_PROMPT_ID = process.env.VOICE_PROMPT_ID
const VECTOR_STORE_ID = process.env.VECTOR_STORE_ID

console.log("[v0] Environment debug:")
console.log("[v0] OPENAI_API_KEY exists:", !!API_KEY)
console.log("[v0] OPENAI_API_KEY starts with sk-:", API_KEY ? API_KEY.startsWith('sk-') : false)
console.log("[v0] OPENAI_API_KEY length:", API_KEY ? API_KEY.length : 0)
console.log("[v0] OPENAI_ASSISTANT_ID exists:", !!ASSISTANT_ID)
console.log("[v0] OPENAI_ASSISTANT_ID value:", ASSISTANT_ID || "Not set")
console.log("[v0] VOICE_PROMPT_ID exists:", !!VOICE_PROMPT_ID)
console.log("[v0] VECTOR_STORE_ID exists:", !!VECTOR_STORE_ID)
console.log("[v0] VECTOR_STORE_ID value:", VECTOR_STORE_ID || "Not set")
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

  image: `I can generate images for you! Just ask me to "generate image" or "create image" followed by what you'd like to see. For example, you could say "generate image of a robot" or "create image of a circuit diagram".

I use DALL-E 3 to create high-quality images that can help visualize robotics concepts, circuit designs, or any other educational content you need.

What image would you like me to generate?`,

  default: `Hello! I'm Agent Lee, your AI robotics instructor. I specialize in helping you learn robotics, Python programming, computer vision, and AI development.

I can guide you through practical projects, explain complex concepts clearly, help troubleshoot your code, and even generate images to visualize concepts! Just ask me to "generate image" if you need visual aids.

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

  // Check for image generation requests first
  if (detectImageGenerationRequest(message)) {
    baseResponse = mockResponses.image
  } else if (lowerMessage.includes("robot") || lowerMessage.includes("robotic")) {
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

function detectImageGenerationRequest(message: string): boolean {
  const lowerMessage = message.toLowerCase()
  const imageGenerationKeywords = [
    "generate image", "create image", "make image", "draw image",
    "generate picture", "create picture", "make picture", "draw picture",
    "generate photo", "create photo", "make photo", "draw photo",
    "generate pic", "create pic", "make pic", "draw pic",
    "can you generate", "can you create", "can you make", "can you draw",
    "generate an image", "create an image", "make an image", "draw an image",
    "generate a pic", "create a pic", "make a pic", "draw a pic",
  ]

  // Exclude analysis keywords
  const analysisKeywords = [
    "describe this", "analyze this", "what is this", "tell me about this",
    "explain this", "what do you see", "describe the", "analyze the"
  ]

  const hasGenerationKeyword = imageGenerationKeywords.some(keyword => lowerMessage.includes(keyword))
  const hasAnalysisKeyword = analysisKeywords.some(keyword => lowerMessage.includes(keyword))

  // Only trigger generation if it has generation keywords but not analysis keywords
  return hasGenerationKeyword && !hasAnalysisKeyword
}

function detectImageAnalysisRequest(message: string): boolean {
  const lowerMessage = message.toLowerCase()
  const analysisKeywords = [
    "describe this image", "analyze this image", "what is this image",
    "describe the image", "analyze the image", "what's in the image",
    "tell me about this image", "explain this image", "what do you see",
    "describe this", "analyze this", "what is this", "tell me about this",
    "explain this", "what's in this", "describe it", "analyze it"
  ]

  return analysisKeywords.some(keyword => lowerMessage.includes(keyword))
}

async function generateImage(prompt: string, openai: OpenAI): Promise<string> {
  try {
    console.log("[v0] Calling OpenAI DALL-E with prompt:", prompt)

    // Try with a smaller size first to avoid potential size issues
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024", // Smaller size for better compatibility
      response_format: "b64_json"
    })

    console.log("[v0] OpenAI DALL-E response received")
    console.log("[v0] Response data exists:", !!response.data)
    console.log("[v0] Data array length:", response.data?.length)

    if (response.data && response.data[0]) {
      console.log("[v0] First data item exists:", !!response.data[0])
      console.log("[v0] b64_json exists:", !!response.data[0].b64_json)

      if (response.data[0].b64_json) {
        const base64Length = response.data[0].b64_json.length
        console.log("[v0] Image generated successfully, base64 length:", base64Length)

        // Validate base64 data
        if (base64Length < 100) {
          throw new Error(`Base64 data too short: ${base64Length} characters`)
        }

        const dataUrl = `data:image/png;base64,${response.data[0].b64_json}`
        console.log("[v0] Returning data URL with total length:", dataUrl.length)
        console.log("[v0] Data URL starts with:", dataUrl.substring(0, 50))
        return dataUrl
      }
    }

    console.error("[v0] No image data in response structure:", {
      hasData: !!response.data,
      dataLength: response.data?.length,
      firstItem: response.data?.[0] ? Object.keys(response.data[0]) : 'none'
    })
    throw new Error("No image data received from OpenAI")
  } catch (error) {
    console.error("[v0] Image generation error:", error)
    if (error instanceof Error) {
      console.error("[v0] Error message:", error.message)
      console.error("[v0] Error stack:", error.stack)
    }
    throw error
  }
}

async function analyzeImage(imageUrl: string, prompt: string, openai: OpenAI): Promise<string> {
  try {
    console.log("[v0] Analyzing image with Vision API, prompt:", prompt)
    console.log("[v0] Image URL length:", imageUrl.length)

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Use GPT-4 with vision capabilities
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt || "Please describe this image in detail."
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl
              }
            }
          ]
        }
      ],
      max_tokens: 1000
    })

    if (response.choices && response.choices[0] && response.choices[0].message) {
      const analysisResult = response.choices[0].message.content
      console.log("[v0] Image analysis completed, response length:", analysisResult?.length)
      return analysisResult || "I was unable to analyze the image."
    } else {
      throw new Error("No analysis result received from OpenAI")
    }
  } catch (error) {
    console.error("[v0] Image analysis error:", error)
    if (error instanceof Error) {
      console.error("[v0] Error message:", error.message)
    }
    throw error
  }
}

let openai: OpenAI | null = null
try {
  if (API_KEY) {
    openai = new OpenAI({
      apiKey: API_KEY,
    })
  }
} catch (initError) {
  console.error("[v0] Failed to initialize OpenAI client:", initError)
  openai = null
}

export async function POST(request: NextRequest) {
  const requestStartTime = Date.now()
  let sessionId: string | null = null

  try {
    console.log("[v0] Agent Lee API called")

    const { message, threadId, lastImage } = await request.json()
    console.log("[v0] Received message:", message, "threadId:", threadId)
    console.log("[v0] Has last image for context:", !!lastImage)

    // Track new chat session
    sessionId = trackChatSession({
      threadId,
      startTime: new Date(),
      messageCount: 1,
      responseTime: 0,
      status: 'active'
    })

    if (!message || typeof message !== "string") {
      console.log("[v0] Invalid message format")
      return NextResponse.json({ error: "Message is required and must be a string" }, { status: 400 })
    }

    console.log("[v0] Checking if message is image generation request:", message)

    // Check if this is an image analysis request first
    if (detectImageAnalysisRequest(message) && lastImage) {
      console.log("[v0] Image analysis request detected for message:", message)

      if (!openai || !API_KEY) {
        console.error("[v0] OpenAI configuration missing for image analysis")
        return NextResponse.json({
          error: "OpenAI configuration missing for image analysis",
          details: {
            hasApiKey: !!API_KEY,
            clientInitialized: !!openai
          }
        }, { status: 500 })
      }

      try {
        console.log("[v0] Analyzing image with prompt:", message)
        const analysisResult = await analyzeImage(lastImage, message, openai)
        const responseTime = Date.now() - requestStartTime

        // Update session with completion data
        if (sessionId) {
          updateChatSession(sessionId, {
            endTime: new Date(),
            responseTime,
            status: 'completed'
          })
        }

        console.log("[v0] Image analysis completed successfully, returning response")
        return NextResponse.json({
          message: analysisResult,
          threadId: threadId || "analysis_" + Date.now(),
          timestamp: new Date().toISOString(),
          responseTime
        })
      } catch (analysisError) {
        console.error("[v0] Image analysis failed:", analysisError)

        // Update session with error status
        if (sessionId) {
          updateChatSession(sessionId, {
            endTime: new Date(),
            responseTime: Date.now() - requestStartTime,
            status: 'error'
          })
        }

        return NextResponse.json({
          error: "Failed to analyze image",
          details: analysisError instanceof Error ? analysisError.message : "Unknown error"
        }, { status: 500 })
      }
    }

    // Check if this is an image generation request
    if (detectImageGenerationRequest(message)) {
      console.log("[v0] Image generation request detected for message:", message)

      if (!openai || !API_KEY) {
        console.error("[v0] OpenAI configuration missing for image generation")
        return NextResponse.json({
          error: "OpenAI configuration missing for image generation",
          details: {
            hasApiKey: !!API_KEY,
            clientInitialized: !!openai
          }
        }, { status: 500 })
      }

      try {
        console.log("[v0] Generating image with prompt:", message)
        const imageDataUrl = await generateImage(message, openai)
        const responseTime = Date.now() - requestStartTime

        // Update session with completion data
        if (sessionId) {
          updateChatSession(sessionId, {
            endTime: new Date(),
            responseTime,
            status: 'completed'
          })
        }

        console.log("[v0] Image generated successfully, returning response")
        return NextResponse.json({
          message: "I've generated an image for you:",
          image: imageDataUrl,
          threadId: threadId || "image_" + Date.now(),
          timestamp: new Date().toISOString(),
          responseTime
        })
      } catch (imageError) {
        console.error("[v0] Image generation failed:", imageError)

        // Update session with error status
        if (sessionId) {
          updateChatSession(sessionId, {
            endTime: new Date(),
            responseTime: Date.now() - requestStartTime,
            status: 'error'
          })
        }

        return NextResponse.json({
          error: "Failed to generate image",
          details: imageError instanceof Error ? imageError.message : "Unknown error"
        }, { status: 500 })
      }
    } else {
      console.log("[v0] Not an image generation request, proceeding with assistant")
    }

    // Validate configuration
    if (!openai || !ASSISTANT_ID || !API_KEY) {
      console.error("[v0] OpenAI configuration missing:")
      console.error("[v0] - API Key exists:", !!API_KEY)
      console.error("[v0] - Assistant ID exists:", !!ASSISTANT_ID)
      console.error("[v0] - OpenAI client initialized:", !!openai)
      
      return NextResponse.json({
        error: "OpenAI configuration missing. Please check environment variables.",
        details: {
          hasApiKey: !!API_KEY,
          hasAssistantId: !!ASSISTANT_ID,
          clientInitialized: !!openai
        }
      }, { status: 500 })
    }

    let currentThreadId = threadId
    if (!currentThreadId) {
      try {
        const thread = await openai.beta.threads.create()
        currentThreadId = thread.id
        console.log("[v0] Created new thread:", currentThreadId)
      } catch (threadError: any) {
        console.error("[v0] Failed to create thread:", threadError)
        console.error("[v0] Thread error details:", {
          message: threadError?.message,
          status: threadError?.status,
          type: threadError?.type,
          code: threadError?.code,
        })
        return NextResponse.json({ 
          error: "Failed to create conversation thread",
          details: threadError?.message 
        }, { status: 500 })
      }
    }

    console.log("[v0] Using thread ID:", currentThreadId)

    try {
      await openai.beta.threads.messages.create(currentThreadId, {
        role: "user",
        content: message,
      })
      console.log("[v0] Message added to thread")
    } catch (messageError: any) {
      console.error("[v0] Failed to add message:", messageError)
      console.error("[v0] Message error details:", {
        message: messageError?.message,
        status: messageError?.status,
        type: messageError?.type,
      })
      return NextResponse.json({ 
        error: "Failed to add message to conversation",
        details: messageError?.message 
      }, { status: 500 })
    }

    let run
    try {
      run = await openai.beta.threads.runs.create(currentThreadId, {
        assistant_id: ASSISTANT_ID,
      })
      console.log("[v0] Created run:", run.id, "for thread:", currentThreadId)
    } catch (runError: any) {
      console.error("[v0] Failed to create run:", runError)
      console.error("[v0] Run error details:", {
        message: runError?.message,
        status: runError?.status,
        type: runError?.type,
        code: runError?.code,
      })
      return NextResponse.json({ 
        error: "Failed to start assistant processing",
        details: runError?.message 
      }, { status: 500 })
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
        runStatus = await openai.beta.threads.runs.retrieve(run.id, currentThreadId)
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
          runStatus = await openai.beta.threads.runs.retrieve(run.id, currentThreadId)
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

          // Check if the assistant's response suggests it should generate an image
          // This catches cases where the original message was asking for image generation
          // but the assistant responded with instructions instead
          if (detectImageGenerationRequest(message) &&
              (response.includes("I don't have the capability") ||
               response.includes("I can guide you") ||
               response.includes("matplotlib") ||
               response.includes("programming"))) {
            console.log("[v0] Assistant gave programming instructions instead of generating image, triggering image generation")

            try {
              const imageDataUrl = await generateImage(message, openai)
              const responseTime = Date.now() - requestStartTime

              // Update session with completion data
              if (sessionId) {
                updateChatSession(sessionId, {
                  endTime: new Date(),
                  responseTime,
                  status: 'completed'
                })
              }

              return NextResponse.json({
                message: "I've generated an image for you:",
                image: imageDataUrl,
                threadId: currentThreadId,
                timestamp: new Date().toISOString(),
                responseTime
              })
            } catch (imageError) {
              console.error("[v0] Fallback image generation failed:", imageError)
              // Fall through to return the original response
            }
          }

          // Update session with completion data
          const responseTime = Date.now() - requestStartTime
          if (sessionId) {
            updateChatSession(sessionId, {
              endTime: new Date(),
              responseTime,
              status: 'completed'
            })
          }

          return NextResponse.json({
            message: response,
            threadId: currentThreadId,
            timestamp: new Date().toISOString(),
            responseTime
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

    // Update session with error status
    if (sessionId) {
      updateChatSession(sessionId, {
        endTime: new Date(),
        responseTime: Date.now() - requestStartTime,
        status: 'error'
      })
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
