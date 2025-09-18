import { NextRequest, NextResponse } from 'next/server'
import { runCodegenTask } from '@/lib/anthropic/codegenAnthropic'

export async function POST(request: NextRequest) {
  try {
    // Basic authentication - ensure this is called from Agent Lee
    const authHeader = request.headers.get('authorization')
    const internalKey = process.env.INTERNAL_API_KEY

    if (!internalKey) {
      console.error('[Codegen API] INTERNAL_API_KEY is not configured')
      return NextResponse.json(
        { error: 'Internal API key not configured' },
        { status: 500 }
      )
    }

    if (!authHeader || authHeader !== `Bearer ${internalKey}`) {
      return NextResponse.json(
        { error: 'Unauthorized access to code generation' },
        { status: 401 }
      )
    }

    const { instruction, model, sessionId } = await request.json()

    if (!instruction || typeof instruction !== 'string') {
      return NextResponse.json(
        { error: 'Instruction is required and must be a string' },
        { status: 400 }
      )
    }

    // Validate Anthropic API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Anthropic API key not configured' },
        { status: 500 }
      )
    }

    console.log(`[Codegen API] Starting code generation for session: ${sessionId}`)
    console.log(`[Codegen API] Instruction: ${instruction.substring(0, 100)}...`)

    const startTime = Date.now()
    const result = await runCodegenTask(instruction, model)
    const generationTime = Date.now() - startTime

    // Log analytics
    await logCodegenUsage({
      sessionId: sessionId || 'unknown',
      instruction: instruction.substring(0, 200), // Truncate for storage
      success: result.success,
      filesCreated: result.filesCreated.length,
      generationTime,
      model: model || 'claude-sonnet-4-20250514'
    })

    console.log(`[Codegen API] Generation completed in ${generationTime}ms`)
    console.log(`[Codegen API] Files created: ${result.filesCreated.length}`)

    return NextResponse.json({
      success: result.success,
      message: result.message,
      filesCreated: result.filesCreated,
      generationTime,
      error: result.error
    })

  } catch (error) {
    console.error('[Codegen API] Error:', error)
    return NextResponse.json(
      {
        error: 'Code generation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Analytics logging using the analytics system
async function logCodegenUsage(data: {
  sessionId: string
  instruction: string
  success: boolean
  filesCreated: number
  generationTime: number
  model: string
}) {
  try {
    // Use the analytics system to track code generation
    const { trackCodeGeneration } = await import('@/lib/analytics')

    trackCodeGeneration({
      timestamp: new Date(),
      instruction: data.instruction,
      success: data.success,
      generationTime: data.generationTime,
      model: data.model,
      filesCreated: data.filesCreated,
      sessionId: data.sessionId
    })

    console.log('[Codegen Analytics]', {
      session: data.sessionId,
      success: data.success,
      files: data.filesCreated,
      time: data.generationTime
    })

  } catch (error) {
    console.error('[Codegen Analytics] Failed to log usage:', error)
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'Anthropic Code Generation',
    status: 'active',
    supportedFileTypes: ['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.css', '.scss', '.html', '.txt', '.yml', '.yaml'],
    restrictions: ['No package.json modifications', 'No .env files', 'No database files', 'Workspace-confined only']
  })
}