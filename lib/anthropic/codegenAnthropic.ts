import Anthropic from "@anthropic-ai/sdk";
import fs from "node:fs/promises";
import fssync from "node:fs";
import path from "node:path";

const WORKSPACE = path.resolve(process.env.WORKSPACE || process.cwd());
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

function safeJoin(rel: string) {
  const full = path.resolve(WORKSPACE, rel);
  if (!full.startsWith(WORKSPACE)) throw new Error("Path escapes workspace");
  return full;
}

// Enhanced security: restrict file types and locations
const ALLOWED_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.css', '.scss', '.html', '.txt', '.yml', '.yaml'];
const BLOCKED_PATHS = ['node_modules', '.git', '.env', 'prisma/dev.db', 'package.json', 'package-lock.json'];

function validatePath(relativePath: string): void {
  // Check for blocked paths
  if (BLOCKED_PATHS.some(blocked => relativePath.includes(blocked))) {
    throw new Error(`Access denied: ${relativePath} is in a restricted location`);
  }

  // Check file extension
  const ext = path.extname(relativePath).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    throw new Error(`Unsupported file type: ${ext}. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`);
  }

  // Additional safety checks
  if (relativePath.includes('..') || relativePath.startsWith('/') || relativePath.includes('\\')) {
    throw new Error("Invalid path: contains dangerous characters");
  }
}

const tools = [
  {
    name: "write_file",
    description: "Create or overwrite a UTF-8 text file inside the workspace. Restricted to safe file types and locations.",
    input_schema: {
      type: "object",
      required: ["relativePath", "content"],
      properties: {
        relativePath: {
          type: "string",
          description: "Relative path from project root. Must be a safe file type (.ts, .tsx, .js, .jsx, .json, .md, .css, etc.)"
        },
        content: {
          type: "string",
          description: "UTF-8 text content for the file"
        }
      }
    }
  }
];

export interface CodegenResult {
  success: boolean;
  message: string;
  filesCreated: string[];
  error?: string;
  details?: any;
}

export async function runCodegenTask(
  userInstruction: string,
  model = "claude-sonnet-4-20250514"
): Promise<CodegenResult> {
  try {
    const messages: any[] = [{
      role: "user",
      content: `${userInstruction}

IMPORTANT GUIDELINES:
- Only create safe file types (.ts, .tsx, .js, .jsx, .json, .md, .css, etc.)
- Follow Next.js/React best practices
- Use TypeScript when appropriate
- Include proper imports and exports
- Add basic error handling
- Follow the existing project structure
- Do not modify package.json, .env files, or database files`
    }];

    const filesCreated: string[] = [];
    let iterations = 0;
    const maxIterations = 10; // Prevent infinite loops

    while (iterations < maxIterations) {
      iterations++;

      const msg = await client.messages.create({
        model,
        max_tokens: 4000,
        messages,
        tools: tools as any,
      });

      const toolUses = msg.content.filter((b: any) => b.type === "tool_use") as any[];

      if (!toolUses.length) {
        const text = msg.content
          .filter((b: any) => b.type === "text")
          .map((b: any) => b.text)
          .join("\n");

        return {
          success: true,
          message: text.trim() || "Code generation completed successfully!",
          filesCreated
        };
      }

      const results = [];
      for (const t of toolUses) {
        if (t.name === "write_file") {
          try {
            const { relativePath, content } = t.input as { relativePath: string; content: string };

            // Validate path safety
            validatePath(relativePath);

            const full = safeJoin(relativePath);

            // Check if file exists and warn
            const exists = fssync.existsSync(full);
            if (exists) {
              console.warn(`[Codegen] Overwriting existing file: ${relativePath}`);
            }

            await fs.mkdir(path.dirname(full), { recursive: true });
            await fs.writeFile(full, content, "utf8");

            filesCreated.push(relativePath);
            console.log(`[Codegen] Created file: ${relativePath}`);

            results.push({
              type: "tool_result",
              tool_use_id: (t as any).id,
              content: JSON.stringify({
                ok: true,
                path: relativePath,
                exists: exists ? "overwritten" : "created"
              })
            });
          } catch (error) {
            console.error(`[Codegen] Error creating file:`, error);
            results.push({
              type: "tool_result",
              tool_use_id: (t as any).id,
              content: JSON.stringify({
                error: error instanceof Error ? error.message : "Unknown error"
              })
            });
          }
        } else {
          results.push({
            type: "tool_result",
            tool_use_id: (t as any).id,
            content: JSON.stringify({ error: "unknown tool" })
          });
        }
      }

      // Continue conversation
      messages.push({ role: "assistant", content: msg.content });
      messages.push({ role: "user", content: results });
    }

    return {
      success: false,
      message: "Code generation exceeded maximum iterations",
      filesCreated,
      error: "MAX_ITERATIONS_EXCEEDED"
    };

  } catch (error) {
    console.error("[Codegen] Task failed:", error);
    return {
      success: false,
      message: "Code generation failed",
      filesCreated: [],
      error: error instanceof Error ? error.message : "Unknown error",
      details: error
    };
  }
}