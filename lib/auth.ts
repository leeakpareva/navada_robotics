import { getServerSession } from 'next-auth'
import type { Session } from 'next-auth'

import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export class AdminAuthorizationError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'AdminAuthorizationError'
    this.status = status
  }
}

function getConfiguredAdminEmails(): string[] {
  const configured = process.env.ADMIN_EMAILS
    ?.split(',')
    .map((email) => email.trim())
    .filter(Boolean)

  if (configured && configured.length > 0) {
    return configured
  }

  return ['leeakpareva@gmail.com']
}

export async function requireAdmin(): Promise<Session> {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    throw new AdminAuthorizationError('Authentication required', 401)
  }

  const adminEmails = getConfiguredAdminEmails()

  if (!adminEmails.includes(session.user.email)) {
    throw new AdminAuthorizationError('Forbidden', 403)
  }

  return session
}
