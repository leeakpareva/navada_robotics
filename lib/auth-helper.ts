import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function getCustomSession(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const xSessionToken = request.headers.get('X-Session-Token');

    console.log('Auth Debug - Authorization header:', authHeader);
    console.log('Auth Debug - X-Session-Token header:', xSessionToken);

    const sessionToken = authHeader?.replace('Bearer ', '') || xSessionToken;

    if (!sessionToken) {
      console.log('Auth Debug - No session token found');
      return null;
    }

    console.log('Auth Debug - Using session token:', sessionToken.substring(0, 20) + '...');

    const session = await prisma.sessions.findFirst({
      where: {
        sessionToken,
        expires: {
          gt: new Date()
        }
      },
      include: {
        user: true
      }
    });

    if (!session || !session.user) {
      return null;
    }

    return {
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role
      }
    };
  } catch (error) {
    console.error('Error validating custom session:', error);
    return null;
  }
}