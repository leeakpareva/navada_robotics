import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
// import GoogleProvider from "next-auth/providers/google"
// import GitHubProvider from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const dynamic = 'force-dynamic'

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log("Missing credentials")
            return null
          }

          const user = await prisma.users.findUnique({
            where: {
              email: credentials.email
            }
          })

          if (!user || !user.password) {
            console.log("User not found or no password")
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            console.log("Invalid password")
            return null
          }

          console.log("User authenticated successfully")
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    }),
    // OAuth providers disabled for testing
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID || "",
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    // }),
    // GitHubProvider({
    //   clientId: process.env.GITHUB_CLIENT_ID || "",
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    // }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)

// App Router handlers for Next.js 15
export async function GET(
  request: Request,
  { params }: { params: Promise<{ nextauth: string[] }> }
) {
  // Await the params as required by Next.js 15
  const resolvedParams = await params

  // Create a new request with the resolved params
  const modifiedRequest = new Request(request.url, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    // @ts-ignore - NextAuth expects query params
    query: { nextauth: resolvedParams.nextauth }
  })

  return handler(modifiedRequest as any, { params: { nextauth: resolvedParams.nextauth } } as any)
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ nextauth: string[] }> }
) {
  // Await the params as required by Next.js 15
  const resolvedParams = await params

  // Create a new request with the resolved params
  const modifiedRequest = new Request(request.url, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    // @ts-ignore - NextAuth expects query params
    query: { nextauth: resolvedParams.nextauth }
  })

  return handler(modifiedRequest as any, { params: { nextauth: resolvedParams.nextauth } } as any)
}

export { authOptions }