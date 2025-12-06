// GET /api/health
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Test database connection
    await query('SELECT 1');
    
    return Response.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return Response.json(
      {
        status: 'unhealthy',
        database: 'disconnected',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}

