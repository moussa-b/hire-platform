// Authentication middleware
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromCookie } from './auth';
import { query } from './db';

export async function requireAuth(request: NextRequest) {
  const token = getTokenFromCookie(request.headers.get('cookie'));
  
  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  const payload = verifyToken(token);
  
  if (!payload) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
  
  // Verify user still exists
  const result = await query('SELECT id, email FROM users WHERE id = $1', [payload.userId]);
  
  if (result.rows.length === 0) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 401 }
    );
  }
  
  return { user: result.rows[0], payload };
}

export function createAuthResponse(token: string, data: any) {
  const response = NextResponse.json(data);
  response.cookies.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return response;
}

export function clearAuthResponse() {
  const response = NextResponse.json({ message: 'Logged out' });
  response.cookies.delete('auth-token');
  return response;
}

