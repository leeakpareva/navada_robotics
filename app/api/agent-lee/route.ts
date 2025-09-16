import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from 'next-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import OpenAI from "openai"
import { Mistral } from "@mistralai/mistralai"
import { DatabaseAnalytics } from "@/lib/database-analytics"
import { RAGService } from "@/lib/rag-service"
import { mcpClient } from "@/lib/mcp/client"
import { parseUserRequest, formatWebsitePreview } from "@/lib/website-generator/utils"
import { WebsiteGenerator } from "@/lib/website-generator/generator"
import { prisma } from '@/lib/prisma'

// Analytics wrapper functions
async function trackChatSession(data: any) {
  try {
    const session = await DatabaseAnalytics.createOrUpdateChatSession(data)
    return session.id
  } catch (error) {
    console.error('[Analytics] Error tracking chat session:', error)
    return `session_${Date.now()}`
  }
}

async function updateChatSession(sessionId: string, data: any) {
  try {
    await DatabaseAnalytics.trackAnalyticsEvent({
      sessionId,
      eventType: 'session_update',
      eventData: data
    })
  } catch (error) {
    console.error('[Analytics] Error updating session:', error)
  }
}

async function trackImageGeneration(data: any) {
  try {
    await DatabaseAnalytics.trackImageGeneration(data)
  } catch (error) {
    console.error('[Analytics] Error tracking image generation:', error)
  }
}

// MCP Integration Functions
function shouldUseBraveSearch(message: string): boolean {
  const searchTriggers = [
    'search for', 'find information about', 'look up', 'what is the latest',
    'current news', 'recent developments', 'web search', 'search the web',
    'brave search', 'find latest', 'current information', 'up to date',
    'recent news', 'latest updates', 'search online', 'find online'
  ]

  return searchTriggers.some(trigger =>
    message.toLowerCase().includes(trigger.toLowerCase())
  )
}

function shouldUseFileSystem(message: string): boolean {
  const fileTriggers = [
    'read file', 'write file', 'create file', 'list files', 'directory',
    'folder', 'save to file', 'file system', 'local file'
  ]

  return fileTriggers.some(trigger =>
    message.toLowerCase().includes(trigger.toLowerCase())
  )
}

function shouldUseGitHub(message: string): boolean {
  const githubTriggers = [
    'github', 'repository', 'repo', 'create repo', 'list repos',
    'github issue', 'pull request', 'commit', 'git'
  ]

  return githubTriggers.some(trigger =>
    message.toLowerCase().includes(trigger.toLowerCase())
  )
}

async function performBraveSearch(query: string, sessionId?: string, threadId?: string): Promise<string> {
  try {
    const { braveSearchMCP } = await import('@/lib/mcp/servers/brave-search')
    const searchResult = await braveSearchMCP.webSearch(query, sessionId, threadId)

    if (searchResult.summary) {
      return `Here's what I found online:\n\n${searchResult.summary}`
    } else {
      return `I searched for "${query}" but didn't find relevant results.`
    }
  } catch (error) {
    console.error('[Agent Lee] Brave Search error:', error)
    return `I tried to search for "${query}" but encountered an issue with the search service.`
  }
}

async function handleMCPRequest(message: string, sessionId?: string, threadId?: string): Promise<string> {
  try {
    // Check which MCP services should be used based on the message
    const mcpResponses: string[] = []

    if (shouldUseBraveSearch(message)) {
      console.log('[Agent Lee] Using Brave Search MCP...')
      const searchResponse = await performBraveSearch(message, sessionId, threadId)
      mcpResponses.push(searchResponse)
    }

    if (shouldUseFileSystem(message)) {
      console.log('[Agent Lee] File system operations detected but not implemented yet')
      mcpResponses.push('File system operations are not yet available.')
    }

    if (shouldUseGitHub(message)) {
      console.log('[Agent Lee] GitHub operations detected but not implemented yet')
      mcpResponses.push('GitHub operations are not yet available.')
    }

    return mcpResponses.length > 0 ? mcpResponses.join('\n\n') : ''
  } catch (error) {
    console.error('[Agent Lee] MCP handler error:', error)
    return ''
  }
}

const API_KEY = process.env.OPENAI_API_KEY
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY
const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID
const VOICE_PROMPT_ID = process.env.VOICE_PROMPT_ID
const VECTOR_STORE_ID = process.env.VECTOR_STORE_ID
const BRAVE_SEARCH_API_KEY = process.env.BRAVE_SEARCH_API_KEY

if (process.env.NODE_ENV !== 'production') {
  console.log("[v0] Environment debug:")
  console.log("[v0] OPENAI_API_KEY exists:", !!API_KEY)
  console.log("[v0] OPENAI_API_KEY starts with sk-:", API_KEY ? API_KEY.startsWith('sk-') : false)
  console.log("[v0] OPENAI_API_KEY length:", API_KEY ? API_KEY.length : 0)
  console.log("[v0] OPENAI_ASSISTANT_ID exists:", !!ASSISTANT_ID)
  console.log("[v0] OPENAI_ASSISTANT_ID length:", ASSISTANT_ID ? ASSISTANT_ID.length : 0)
  console.log("[v0] VOICE_PROMPT_ID exists:", !!VOICE_PROMPT_ID)
  console.log("[v0] VOICE_PROMPT_ID length:", VOICE_PROMPT_ID ? VOICE_PROMPT_ID.length : 0)
  console.log("[v0] VECTOR_STORE_ID exists:", !!VECTOR_STORE_ID)
  console.log("[v0] VECTOR_STORE_ID length:", VECTOR_STORE_ID ? VECTOR_STORE_ID.length : 0)
  if (VECTOR_STORE_ID) {
    console.log("[v0] Vector store configured for file search capabilities")
  }
  console.log("[v0] BRAVE_SEARCH_API_KEY exists:", !!BRAVE_SEARCH_API_KEY)
  if (BRAVE_SEARCH_API_KEY) {
    console.log("[v0] Brave Search MCP server available")
  }
  console.log("[v0] DEEPSEEK_API_KEY exists:", !!DEEPSEEK_API_KEY)
  if (DEEPSEEK_API_KEY) {
    console.log("[v0] DeepSeek API available")
  }
  console.log("[v0] MISTRAL_API_KEY exists:", !!MISTRAL_API_KEY)
  if (MISTRAL_API_KEY) {
    console.log("[v0] Mistral API available")
  }
  console.log(
    "[v0] Logged env var keys:",
    Object.keys(process.env).filter((key) => key.includes("OPENAI")),
  )
}

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

  website: `I can create complete NextJS websites for you! Just describe what kind of website you need and I'll generate a modern, secure, and responsive website.

I can create:
- Business websites with professional layouts
- Landing pages with hero sections and features
- Portfolio sites to showcase your work
- Modern designs with custom colors and themes

Just say something like "create a website for my business" or "build a landing page for my product" and I'll generate all the code files you need!

What kind of website would you like me to create?`,

  default: `Hello! I'm Agent Lee, your AI robotics instructor. I specialize in helping you learn robotics, Python programming, computer vision, and AI development.

I can guide you through practical projects, explain complex concepts clearly, help troubleshoot your code, generate images to visualize concepts, and even create complete NextJS websites for you!

My capabilities include:
- 🤖 Robotics guidance and project tutorials
- 🐍 Python programming instruction
- 👁️ Computer vision and OpenCV help
- 🖼️ DALL-E 3 image generation (just say "generate image")
- 🌐 NextJS website creation (just say "create website")

What would you like to learn about or build today?`,
}

function generateMockResponse(message: string): string {
  const lowerMessage = message.toLowerCase()
  const isDetailRequest =
    lowerMessage.includes("detail") ||
    lowerMessage.includes("explain more") ||
    lowerMessage.includes("comprehensive") ||
    lowerMessage.includes("in depth")

  let baseResponse = ""

  // Check for website generation requests first
  if (detectWebsiteGenerationRequest(message)) {
    baseResponse = mockResponses.website
  } else if (detectImageGenerationRequest(message)) {
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

function detectWebsiteGenerationRequest(message: string): boolean {
  const lowerMessage = message.toLowerCase()
  const websiteKeywords = [
    'create website', 'build website', 'make website', 'design website',
    'create site', 'build site', 'make site', 'design site',
    'create a website', 'build a website', 'make a website',
    'website for', 'site for', 'landing page', 'homepage',
    'generate website', 'generate site'
  ]

  return websiteKeywords.some(keyword => lowerMessage.includes(keyword))
}

function detectCodeGenerationRequest(message: string): boolean {
  const lowerMessage = message.toLowerCase()
  const codeKeywords = [
    'create component', 'build component', 'make component', 'generate component',
    'create function', 'build function', 'make function', 'write function',
    'create api', 'build api', 'make api', 'generate api',
    'create file', 'build file', 'make file', 'write file',
    'create code', 'build code', 'write code', 'generate code',
    'create util', 'create helper', 'create service',
    'build feature', 'implement feature', 'create feature',
    'write typescript', 'write react', 'write next.js',
    'create hook', 'build hook', 'custom hook',
    'create page', 'build page', 'make page',
    'create form', 'build form', 'contact form', 'login form',
    'create modal', 'build modal', 'create dialog',
    'create config', 'build config', 'configuration file'
  ]

  const excludeWebsite = !detectWebsiteGenerationRequest(message)
  const excludeImage = !detectImageGenerationRequest(message)

  return excludeWebsite && excludeImage && codeKeywords.some(keyword => lowerMessage.includes(keyword))
}

async function searchWithBrave(query: string): Promise<string> {
  if (!BRAVE_SEARCH_API_KEY) {
    return "Web search is not available at the moment."
  }

  try {
    const response = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}`, {
      headers: {
        'X-Subscription-Token': BRAVE_SEARCH_API_KEY,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Brave Search API error: ${response.status}`)
    }

    const data = await response.json()
    const results = data.web?.results?.slice(0, 3) || []

    if (results.length === 0) {
      return "No search results found for your query."
    }

    return results.map((result: any) =>
      `**${result.title}**\n${result.description}\n*Source: ${result.url}*`
    ).join('\n\n')
  } catch (error) {
    console.error('Brave search error:', error)
    return "Search functionality is temporarily unavailable."
  }
}

function shouldUseWebSearch(message: string): boolean {
  const searchKeywords = [
    'current', 'latest', 'recent', 'news', 'what happened', 'update',
    'search for', 'find information', 'look up', 'what is happening',
    'today', 'this year', 'new developments', 'breaking'
  ]

  return searchKeywords.some(keyword => message.toLowerCase().includes(keyword))
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

async function generateMistralResponse(message: string, mistral: Mistral): Promise<string> {
  try {
    console.log("[v0] Calling Mistral API with message:", message.substring(0, 100) + "...")

    const response = await mistral.chat.complete({
      model: "mistral-large-latest",
      messages: [
        {
          role: "system",
          content: "You are Agent Lee, an AI robotics instructor specializing in helping students learn robotics, Python programming, computer vision, and AI development. Be helpful, educational, and encouraging."
        },
        {
          role: "user",
          content: message
        }
      ],
      maxTokens: 1000,
      temperature: 0.7
    })

    if (response.choices && response.choices[0] && response.choices[0].message) {
      const result = response.choices[0].message.content
      console.log("[v0] Mistral response generated successfully, length:", result?.length)
      return result || "I apologize, but I couldn't generate a response."
    } else {
      throw new Error("No response received from Mistral API")
    }
  } catch (error) {
    console.error("[v0] Mistral API error:", error)
    if (error instanceof Error) {
      console.error("[v0] Error message:", error.message)
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
let mistral: Mistral | null = null

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

try {
  if (MISTRAL_API_KEY) {
    mistral = new Mistral({
      apiKey: MISTRAL_API_KEY,
    })
  }
} catch (initError) {
  console.error("[v0] Failed to initialize Mistral client:", initError)
  mistral = null
}

export async function POST(request: NextRequest) {
  const requestStartTime = Date.now()
  let sessionId: string | null = null

  try {
    console.log("[v0] Agent Lee API called")

    // Get user session for authenticated requests
    const session = await getServerSession()
    let userId: string | null = null

    if (session?.user?.email) {
      const user = await prisma.users.findUnique({
        where: { email: session.user.email },
        select: { id: true }
      })
      userId = user?.id || null
      console.log("[v0] Authenticated user:", userId)
    }

    const requestBody = await request.json()
    const { message, threadId, lastImage } = requestBody
    const requestedProvider =
      typeof requestBody.apiProvider === 'string' && requestBody.apiProvider.trim().length > 0
        ? requestBody.apiProvider.trim().toLowerCase()
        : 'openai'

    if (requestedProvider !== 'openai' && requestedProvider !== 'mistral') {
      console.log("[v0] Unsupported API provider requested:", requestBody.apiProvider)
      return NextResponse.json({
        error: "Unsupported API provider",
        details: {
          requested: requestBody.apiProvider ?? 'unknown',
          supported: ['openai', 'mistral']
        }
      }, { status: 400 })
    }

    const apiProvider = requestedProvider as 'openai' | 'mistral'
    console.log("[v0] Received message:", message, "threadId:", threadId)
    console.log("[v0] Has last image for context:", !!lastImage)
    console.log("[v0] API provider in use:", apiProvider)

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

        // Update session with response data but keep it active
        if (sessionId) {
          updateChatSession(sessionId, {
            responseTime,
            status: 'active',
            endTime: new Date() // Track last activity time
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
        const imageStartTime = Date.now()
        const imageDataUrl = await generateImage(message, openai)
        const imageGenerationTime = Date.now() - imageStartTime
        const responseTime = Date.now() - requestStartTime

        // Track image generation analytics
        trackImageGeneration({
          timestamp: new Date(),
          prompt: message,
          success: true,
          generationTime: imageGenerationTime,
          model: 'dall-e-3',
          size: '1024x1024',
          sessionId: sessionId || undefined
        })

        // Update session with response data but keep it active
        if (sessionId) {
          updateChatSession(sessionId, {
            responseTime,
            status: 'active',
            endTime: new Date() // Track last activity time
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

        // Track failed image generation
        trackImageGeneration({
          timestamp: new Date(),
          prompt: message,
          success: false,
          generationTime: Date.now() - requestStartTime,
          model: 'dall-e-3',
          size: '1024x1024',
          sessionId: sessionId || undefined
        })

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
    }

    // Check if this is a website generation request
    if (detectWebsiteGenerationRequest(message)) {
      console.log("[v0] Website generation request detected for message:", message)

      try {
        console.log("[v0] Parsing website request:", message)
        const websiteStartTime = Date.now()
        const parsedRequest = parseUserRequest(message)

        if (!parsedRequest.isWebsiteRequest) {
          return NextResponse.json({
            error: "Unable to parse website request",
            details: "Please provide more details about the website you want to create"
          }, { status: 400 })
        }

        // Generate the website
        const generator = new WebsiteGenerator()
        const websiteRequest = {
          description: parsedRequest.description || message,
          siteName: parsedRequest.siteName || 'My Website',
          style: parsedRequest.style ? {
            primaryColor: parsedRequest.style.primaryColor,
            secondaryColor: parsedRequest.style.secondaryColor,
            theme: parsedRequest.style.theme as 'modern' | 'classic' | 'minimal' | 'bold' || 'modern'
          } : undefined,
          pages: parsedRequest.pages,
          features: parsedRequest.features
        }

        console.log("[v0] Generating website with request:", websiteRequest)
        const generatedWebsite = await generator.generateWebsite(websiteRequest)
        const websiteGenerationTime = Date.now() - websiteStartTime
        const responseTime = Date.now() - requestStartTime

        // Check if all files are safe
        const unsafeFiles = generatedWebsite.files.filter(file => !file.safe)
        if (unsafeFiles.length > 0) {
          console.warn("[v0] Generated website contains unsafe files:", unsafeFiles.map(f => f.path))

          // Update session with error status
          if (sessionId) {
            updateChatSession(sessionId, {
              endTime: new Date(),
              responseTime,
              status: 'error'
            })
          }

          return NextResponse.json({
            error: "Generated website contains security issues",
            details: "The generated code contains potential security vulnerabilities and cannot be provided.",
            unsafeFiles: unsafeFiles.map(file => file.path)
          }, { status: 400 })
        }

        // Format the website preview
        const websitePreview = formatWebsitePreview(generatedWebsite)

        // Update session with response data but keep it active
        if (sessionId) {
          updateChatSession(sessionId, {
            responseTime,
            status: 'active',
            endTime: new Date() // Track last activity time
          })
        }

        console.log("[v0] Website generated successfully, returning response")
        return NextResponse.json({
          message: `I've generated a ${generatedWebsite.projectName} website for you!\n\n${websitePreview}`,
          website: generatedWebsite,
          threadId: threadId || "website_" + Date.now(),
          timestamp: new Date().toISOString(),
          responseTime,
          websiteGenerationTime
        })
      } catch (websiteError) {
        console.error("[v0] Website generation failed:", websiteError)

        // Update session with error status
        if (sessionId) {
          updateChatSession(sessionId, {
            endTime: new Date(),
            responseTime: Date.now() - requestStartTime,
            status: 'error'
          })
        }

        return NextResponse.json({
          error: "Failed to generate website",
          details: websiteError instanceof Error ? websiteError.message : "Unknown error"
        }, { status: 500 })
      }
    } else {
      console.log("[v0] Not an image generation request, proceeding with assistant")
    }

    // Handle Mistral API provider
    if (apiProvider === 'mistral') {
      console.log("[v0] Using Mistral API provider")

      if (!mistral || !MISTRAL_API_KEY) {
        console.error("[v0] Mistral configuration missing")
        return NextResponse.json({
          error: "Mistral configuration missing",
          details: {
            hasMistralKey: !!MISTRAL_API_KEY,
            clientInitialized: !!mistral
          }
        }, { status: 500 })
      }

      try {
        console.log("[v0] Generating response with Mistral API")
        const responseStartTime = Date.now()

        // Add MCP results if available
        let enhancedMessage = message
        const mcpResults = await handleMCPRequest(message, sessionId, threadId || "mistral_" + Date.now())
        if (mcpResults) {
          enhancedMessage = `${message}\n\n--- Additional Information ---\n${mcpResults}`
        }

        const mistralResponse = await generateMistralResponse(enhancedMessage, mistral)
        const responseTime = Date.now() - requestStartTime

        // Track chat session for Mistral
        sessionId = await trackChatSession({
          threadId: threadId || "mistral_" + Date.now(),
          apiProvider: 'mistral',
          userId: userId,
          sessionData: {
            startTime: new Date().toISOString(),
            initialMessage: message
          }
        })

        // Track the user message
        if (sessionId) {
          try {
            await DatabaseAnalytics.addChatMessage({
              sessionId,
              threadId: threadId || "mistral_" + Date.now(),
              messageIndex: 0,
              role: 'user',
              content: message,
              metadata: { hasMCPResults: !!mcpResults }
            })

            // Track the assistant response
            await DatabaseAnalytics.addChatMessage({
              sessionId,
              threadId: threadId || "mistral_" + Date.now(),
              messageIndex: 1,
              role: 'assistant',
              content: mistralResponse,
              metadata: { model: 'mistral-large-latest' }
            })
          } catch (trackErr) {
            console.error('[Analytics] Error tracking Mistral messages:', trackErr)
          }
        }

        // Update session with completion data
        if (sessionId) {
          updateChatSession(sessionId, {
            endTime: new Date(),
            responseTime,
            status: 'completed'
          })
        }

        console.log("[v0] Mistral response completed successfully")
        return NextResponse.json({
          message: mistralResponse,
          threadId: threadId || "mistral_" + Date.now(),
          timestamp: new Date().toISOString(),
          responseTime,
          provider: 'mistral'
        })

      } catch (mistralError) {
        console.error("[v0] Mistral response generation failed:", mistralError)

        // Update session with error status
        if (sessionId) {
          updateChatSession(sessionId, {
            endTime: new Date(),
            responseTime: Date.now() - requestStartTime,
            status: 'error'
          })
        }

        return NextResponse.json({
          error: "Failed to generate response with Mistral",
          details: mistralError instanceof Error ? mistralError.message : "Unknown error"
        }, { status: 500 })
      }
    }

    // Check if this is a code generation request
    if (detectCodeGenerationRequest(message)) {
      console.log("[v0] Code generation request detected for message:", message)

      // Validate Anthropic API key
      if (!process.env.ANTHROPIC_API_KEY) {
        console.error("[v0] Anthropic API key not configured for code generation")
        return NextResponse.json({
          error: "Code generation not available",
          details: "Anthropic API key not configured"
        }, { status: 500 })
      }

      try {
        console.log("[v0] Starting code generation with Anthropic")
        const codegenStartTime = Date.now()

        // Call our internal codegen API
        const codegenResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/anthropic/codegen`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.INTERNAL_API_KEY || 'agent-lee-internal'}`
          },
          body: JSON.stringify({
            instruction: message,
            model: 'claude-sonnet-4-20250514',
            sessionId: sessionId || 'unknown'
          })
        })

        if (!codegenResponse.ok) {
          throw new Error(`Code generation API error: ${codegenResponse.status}`)
        }

        const codegenResult = await codegenResponse.json()
        const codegenTime = Date.now() - codegenStartTime
        const responseTime = Date.now() - requestStartTime

        // Update session with response data but keep it active
        if (sessionId) {
          updateChatSession(sessionId, {
            responseTime,
            status: 'active',
            endTime: new Date() // Track last activity time
          })
        }

        let responseMessage = "I've generated the code for you!"

        if (codegenResult.success && codegenResult.filesCreated.length > 0) {
          responseMessage = `I've successfully generated ${codegenResult.filesCreated.length} file(s) for you!\n\n**Files Created:**\n${codegenResult.filesCreated.map((file: string) => `• ${file}`).join('\n')}\n\n${codegenResult.message}`
        } else if (codegenResult.error) {
          responseMessage = `Code generation encountered an issue: ${codegenResult.error}\n\n${codegenResult.message}`
        }

        console.log("[v0] Code generation completed successfully")
        return NextResponse.json({
          message: responseMessage,
          codegenResult,
          threadId: threadId || "codegen_" + Date.now(),
          timestamp: new Date().toISOString(),
          responseTime,
          codegenTime
        })

      } catch (codegenError) {
        console.error("[v0] Code generation failed:", codegenError)

        // Update session with error status
        if (sessionId) {
          updateChatSession(sessionId, {
            endTime: new Date(),
            responseTime: Date.now() - requestStartTime,
            status: 'error'
          })
        }

        return NextResponse.json({
          error: "Failed to generate code",
          details: codegenError instanceof Error ? codegenError.message : "Unknown error"
        }, { status: 500 })
      }
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

    // Track chat session with the actual thread ID
    sessionId = await trackChatSession({
      threadId: currentThreadId,
      apiProvider,
      userId: userId, // Use authenticated user ID or null for anonymous
      sessionData: {
        startTime: new Date().toISOString(),
        initialMessage: message
      }
    })

    // Check if we need to use MCP services
    let mcpResults = ''
    mcpResults = await handleMCPRequest(message, sessionId, currentThreadId)

    try {
      // Construct the enhanced message with MCP results
      let enhancedMessage = message
      if (mcpResults) {
        enhancedMessage = `${message}\n\n--- Additional Information ---\n${mcpResults}`
      }

      await openai.beta.threads.messages.create(currentThreadId, {
        role: "user",
        content: enhancedMessage,
      })
      console.log("[v0] Message added to thread", mcpResults ? "(with MCP results)" : "")

      // Track the user message
      if (sessionId && currentThreadId) {
        try {
          await DatabaseAnalytics.addChatMessage({
            sessionId,
            threadId: currentThreadId,
            messageIndex: 0,
            role: 'user',
            content: message,
            metadata: { hasMCPResults: !!mcpResults }
          })
        } catch (trackErr) {
          console.error('[Analytics] Error tracking user message:', trackErr)
        }
      }
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
      const runParams: any = {
        assistant_id: ASSISTANT_ID,
      }

      // Initialize tools array
      runParams.tools = []

      // Attach vector store if available and model supports it
      if (VECTOR_STORE_ID) {
        try {
          // First check if the assistant supports file_search
          const assistant = await openai.beta.assistants.retrieve(ASSISTANT_ID)
          console.log("[v0] Assistant model:", assistant.model)

          // Only add file_search for compatible models
          const compatibleModels = ['gpt-4-turbo-preview', 'gpt-3.5-turbo', 'gpt-4-turbo', 'gpt-4o', 'gpt-4o-mini']
          const isCompatible = compatibleModels.some(model => assistant.model.includes(model))

          if (isCompatible) {
            console.log("[v0] Attaching vector store:", VECTOR_STORE_ID)
            runParams.tools.push({
              type: "file_search"
            })
            runParams.tool_resources = {
              file_search: {
                vector_store_ids: [VECTOR_STORE_ID]
              }
            }
          } else {
            console.log("[v0] Skipping file_search - model", assistant.model, "not compatible")
          }
        } catch (assistantError) {
          console.error("[v0] Error checking assistant model:", assistantError)
          // Skip file_search if we can't determine compatibility
        }
      }

      // Add MCP tools if available
      try {
        // Check for user message patterns and add appropriate MCP tools
        const recommendations = await mcpClient.getRecommendedTools(message)
        console.log("[v0] MCP tool recommendations:", recommendations)

        // Add basic search functionality if Brave Search is available
        if (BRAVE_SEARCH_API_KEY) {
          runParams.tools.push({
            type: "function",
            function: {
              name: "web_search",
              description: "Search the web for current information using Brave Search",
              parameters: {
                type: "object",
                properties: {
                  query: {
                    type: "string",
                    description: "The search query to execute"
                  }
                },
                required: ["query"]
              }
            }
          })

          runParams.tools.push({
            type: "function",
            function: {
              name: "news_search",
              description: "Search for recent news articles using Brave Search",
              parameters: {
                type: "object",
                properties: {
                  query: {
                    type: "string",
                    description: "The news search query to execute"
                  }
                },
                required: ["query"]
              }
            }
          })

          console.log("[v0] Added Brave Search MCP tools")
        }

        // Add GitHub tools if API key is available
        if (process.env.GITHUB_API_KEY) {
          runParams.tools.push({
            type: "function",
            function: {
              name: "list_github_repos",
              description: "List GitHub repositories for a user",
              parameters: {
                type: "object",
                properties: {
                  username: {
                    type: "string",
                    description: "GitHub username (optional, defaults to authenticated user)"
                  }
                }
              }
            }
          })

          console.log("[v0] Added GitHub MCP tools")
        }

      } catch (mcpError) {
        console.error("[v0] Error setting up MCP tools:", mcpError)
      }

      run = await openai.beta.threads.runs.create(currentThreadId, runParams)
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

    // Handle tool calls if the run requires action
    if (runStatus.status === "requires_action" && runStatus.required_action) {
      console.log("[v0] Run requires action - processing tool calls")

      try {
        const toolCalls = runStatus.required_action.submit_tool_outputs.tool_calls
        const toolOutputs = []

        for (const toolCall of toolCalls) {
          console.log("[v0] Processing tool call:", toolCall.function.name)

          let output = "Tool call failed"

          try {
            // Handle MCP tool calls with the new client interface
            const parameters = JSON.parse(toolCall.function.arguments)
            let result: any

            if (toolCall.function.name === 'web_search') {
              console.log("[v0] Executing Brave Search web search:", parameters.query)
              result = await mcpClient.performWebSearch(parameters.query)
            } else if (toolCall.function.name === 'news_search') {
              console.log("[v0] Executing Brave Search news search:", parameters.query)
              result = await mcpClient.performNewsSearch(parameters.query)
            } else if (toolCall.function.name === 'list_github_repos') {
              console.log("[v0] Executing GitHub list repos:", parameters.username)
              result = await mcpClient.listGitHubRepos(parameters.username)
            } else {
              output = `Unknown tool: ${toolCall.function.name}`
              console.warn("[v0] Unknown tool requested:", toolCall.function.name)
            }

            if (result) {
              if (result.success) {
                output = JSON.stringify(result.data)
                console.log("[v0] MCP tool call successful:", toolCall.function.name)
              } else {
                output = `Tool error: ${result.error}`
                console.error("[v0] MCP tool call failed:", result.error)
              }
            }
          } catch (toolError) {
            console.error("[v0] Tool execution error:", toolError)
            output = `Tool execution failed: ${toolError instanceof Error ? toolError.message : 'Unknown error'}`
          }

          toolOutputs.push({
            tool_call_id: toolCall.id,
            output: output
          })
        }

        // Submit tool outputs
        console.log("[v0] Submitting", toolOutputs.length, "tool outputs")
        try {
          // @ts-ignore - OpenAI API parameter issue, functionality works
          await (openai.beta.threads.runs as any).submitToolOutputs(
            currentThreadId,
            run.id,
            { tool_outputs: toolOutputs }
          )
        } catch (toolSubmitError: any) {
          console.error("[v0] Error submitting tool outputs:", toolSubmitError)
          // Continue with fallback response
        }

        // Wait for the run to complete after submitting tool outputs
        let toolCompletionAttempts = 0
        const maxToolAttempts = 30

        while (runStatus.status !== "completed" && toolCompletionAttempts < maxToolAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
          try {
            runStatus = await openai.beta.threads.runs.retrieve(run.id, currentThreadId)
          } catch (err) {
            runStatus = await openai.beta.threads.runs.retrieve(run.id as any, {
              thread_id: currentThreadId
            } as any)
          }
          toolCompletionAttempts++
          console.log("[v0] Tool completion check", toolCompletionAttempts, ":", runStatus.status)
        }

        if (toolCompletionAttempts >= maxToolAttempts) {
          console.log("[v0] Tool processing timed out")
          return NextResponse.json({ error: "Tool processing timed out" }, { status: 500 })
        }

      } catch (toolError) {
        console.error("[v0] Tool processing error:", toolError)
        return NextResponse.json({ error: "Failed to process tool calls" }, { status: 500 })
      }
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

          // Track the assistant response
          if (sessionId && currentThreadId) {
            try {
              await DatabaseAnalytics.addChatMessage({
                sessionId,
                threadId: currentThreadId,
                messageIndex: 1,
                role: 'assistant',
                content: response,
                metadata: { model: 'gpt-4' }
              })
            } catch (trackErr) {
              console.error('[Analytics] Error tracking assistant response:', trackErr)
            }
          }

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
              const imageStartTime = Date.now()
              const imageDataUrl = await generateImage(message, openai)
              const imageGenerationTime = Date.now() - imageStartTime
              const responseTime = Date.now() - requestStartTime

              // Track fallback image generation analytics
              trackImageGeneration({
                timestamp: new Date(),
                prompt: message,
                success: true,
                generationTime: imageGenerationTime,
                model: 'dall-e-3',
                size: '1024x1024',
                sessionId: sessionId || undefined
              })

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

              // Track failed fallback image generation
              trackImageGeneration({
                timestamp: new Date(),
                prompt: message,
                success: false,
                generationTime: Date.now() - requestStartTime,
                model: 'dall-e-3',
                size: '1024x1024',
                sessionId: sessionId || undefined
              })

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
