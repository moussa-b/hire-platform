// GET /api/version
import { getVersion } from '@/lib/version';

export async function GET() {
  const versionInfo = await getVersion();
  return Response.json(versionInfo);
}

