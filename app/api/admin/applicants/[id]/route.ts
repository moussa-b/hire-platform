// GET /api/admin/applicants/[id] - Get applicant details
import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/middleware';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth(request);
  
  if (authResult instanceof Response) {
    return authResult;
  }

  try {
    const { id } = await params;
    // Get applicant with job details
    const applicantResult = await query(
      `SELECT a.*, j.title as job_title, j.description as job_description
       FROM applicants a
       JOIN jobs j ON a.job_id = j.id
       WHERE a.id = $1`,
      [id]
    );

    if (applicantResult.rows.length === 0) {
      return Response.json(
        { error: 'Applicant not found' },
        { status: 404 }
      );
    }

    // Get activity logs
    const logsResult = await query(
      'SELECT * FROM activity_logs WHERE applicant_id = $1 ORDER BY timestamp DESC',
      [id]
    );

    return Response.json({
      ...applicantResult.rows[0],
      activity_logs: logsResult.rows,
    });
  } catch (error) {
    console.error('Error fetching applicant:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

