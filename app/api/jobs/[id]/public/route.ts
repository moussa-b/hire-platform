// GET /api/jobs/[id]/public - Public job details (no auth required)
import { NextRequest } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await query(
      'SELECT id, title, description, location, job_type, salary_min, salary_max, created_at FROM jobs WHERE id = $1 AND status = $2',
      [id, 'active']
    );

    if (result.rows.length === 0) {
      return Response.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    return Response.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching public job:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

