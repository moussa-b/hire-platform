// GET /api/jobs, POST /api/jobs
import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/middleware';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  
  if (authResult instanceof Response) {
    return authResult;
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let sql = 'SELECT * FROM jobs';
    const params: any[] = [];

    if (status) {
      sql += ' WHERE status = $1';
      params.push(status);
    }

    sql += ' ORDER BY created_at DESC';

    const result = await query(sql, params);
    return Response.json(result.rows);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAuth(request);
  
  if (authResult instanceof Response) {
    return authResult;
  }

  try {
    const body = await request.json();
    const { title, description, location, job_type, salary_min, salary_max, status } = body;

    if (!title || !description) {
      return Response.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO jobs (title, description, location, job_type, salary_min, salary_max, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, description, location || null, job_type || null, salary_min || null, salary_max || null, status || 'active']
    );

    return Response.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

