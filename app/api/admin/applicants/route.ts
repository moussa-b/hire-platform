// GET /api/admin/applicants - List applicants with filters
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
    const job_id = searchParams.get('job_id');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let sql = `
      SELECT a.*, j.title as job_title
      FROM applicants a
      JOIN jobs j ON a.job_id = j.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramCount = 0;

    if (job_id) {
      paramCount++;
      sql += ` AND a.job_id = $${paramCount}`;
      params.push(job_id);
    }

    if (status) {
      paramCount++;
      sql += ` AND a.status = $${paramCount}`;
      params.push(status);
    }

    if (search) {
      paramCount++;
      sql += ` AND (a.name ILIKE $${paramCount} OR a.email ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    sql += ' ORDER BY a.created_at DESC';

    const result = await query(sql, params);
    return Response.json(result.rows);
  } catch (error) {
    console.error('Error fetching applicants:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

