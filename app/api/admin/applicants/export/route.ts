// GET /api/admin/applicants/export - Export applicants as CSV
import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/middleware';
import { query } from '@/lib/db';
import { createObjectCsvWriter } from 'csv-writer';

export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  
  if (authResult instanceof Response) {
    return authResult;
  }

  try {
    const { searchParams } = new URL(request.url);
    const job_id = searchParams.get('job_id');
    const status = searchParams.get('status');

    let sql = `
      SELECT a.id, a.name, a.email, a.cover_message, a.status, 
             a.decision_notes, a.created_at, j.title as job_title
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

    sql += ' ORDER BY a.created_at DESC';

    const result = await query(sql, params);

    // Create CSV
    const csvWriter = createObjectCsvWriter({
      path: '/tmp/applicants.csv',
      header: [
        { id: 'id', title: 'ID' },
        { id: 'name', title: 'Name' },
        { id: 'email', title: 'Email' },
        { id: 'job_title', title: 'Job Title' },
        { id: 'status', title: 'Status' },
        { id: 'cover_message', title: 'Cover Message' },
        { id: 'decision_notes', title: 'Notes' },
        { id: 'created_at', title: 'Applied At' },
      ],
    });

    await csvWriter.writeRecords(result.rows);

    // Read and return CSV file
    const fs = await import('fs/promises');
    const csvContent = await fs.readFile('/tmp/applicants.csv', 'utf-8');

    return new Response(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="applicants.csv"',
      },
    });
  } catch (error) {
    console.error('Error exporting applicants:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

