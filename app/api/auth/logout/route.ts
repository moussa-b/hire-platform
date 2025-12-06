// POST /api/auth/logout
import { clearAuthResponse } from '@/lib/middleware';

export async function POST() {
  return clearAuthResponse();
}

