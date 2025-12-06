// GET /api/jobs/[id], PUT /api/jobs/[id], DELETE /api/jobs/[id]
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
    const result = await query('SELECT * FROM jobs WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return Response.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    return Response.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching job:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth(request);
  
  if (authResult instanceof Response) {
    return authResult;
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, location, job_type, salary_min, salary_max, status } = body;

    const result = await query(
      `UPDATE jobs 
       SET title = $1, description = $2, location = $3, job_type = $4, 
           salary_min = $5, salary_max = $6, status = $7
       WHERE id = $8
       RETURNING *`,
      [title, description, location || null, job_type || null, salary_min || null, salary_max || null, status, id]
    );

    if (result.rows.length === 0) {
      return Response.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    return Response.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating job:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth(request);
  
  if (authResult instanceof Response) {
    return authResult;
  }

  try {
    const { id } = await params;
    const result = await query('DELETE FROM jobs WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return Response.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    return Response.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

