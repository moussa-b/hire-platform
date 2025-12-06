// GET /api/auth/me
import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/middleware';

export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  
  if (authResult instanceof Response) {
    return authResult;
  }
  
  return Response.json({
    user: {
      id: authResult.user.id,
      email: authResult.user.email,
    },
  });
}

