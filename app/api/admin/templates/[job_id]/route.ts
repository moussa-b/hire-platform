// GET /api/admin/templates/[job_id], PUT /api/admin/templates/[job_id]
import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/middleware';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ job_id: string }> }
) {
  const authResult = await requireAuth(request);
  
  if (authResult instanceof Response) {
    return authResult;
  }

  try {
    const { job_id } = await params;
    const result = await query(
      'SELECT * FROM email_templates WHERE job_id = $1 ORDER BY status',
      [job_id]
    );

    return Response.json(result.rows);
  } catch (error) {
    console.error('Error fetching templates:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ job_id: string }> }
) {
  const authResult = await requireAuth(request);
  
  if (authResult instanceof Response) {
    return authResult;
  }

  try {
    const { job_id } = await params;
    const body = await request.json();
    const { status, subject, body: templateBody } = body;

    if (!status || !subject || !templateBody) {
      return Response.json(
        { error: 'Status, subject, and body are required' },
        { status: 400 }
      );
    }

    if (!['yes', 'maybe', 'no'].includes(status)) {
      return Response.json(
        { error: 'Status must be yes, maybe, or no' },
        { status: 400 }
      );
    }

    // Upsert template
    const result = await query(
      `INSERT INTO email_templates (job_id, status, subject, body)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (job_id, status)
       DO UPDATE SET subject = $3, body = $4, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [job_id, status, subject, templateBody]
    );

    return Response.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating template:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

