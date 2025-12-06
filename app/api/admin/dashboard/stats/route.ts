// GET /api/admin/dashboard/stats - Dashboard KPIs
import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/middleware';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  
  if (authResult instanceof Response) {
    return authResult;
  }

  try {
    // Total applicants
    const totalResult = await query('SELECT COUNT(*) as count FROM applicants');
    const total_applicants = parseInt(totalResult.rows[0].count, 10);

    // Applicants by status
    const statusResult = await query(
      `SELECT status, COUNT(*) as count 
       FROM applicants 
       GROUP BY status`
    );
    
    const applicants_by_status = {
      pending: 0,
      yes: 0,
      maybe: 0,
      no: 0,
    };

    statusResult.rows.forEach((row: any) => {
      if (row.status in applicants_by_status) {
        applicants_by_status[row.status as keyof typeof applicants_by_status] = parseInt(row.count, 10);
      }
    });

    // Applicants by job
    const jobResult = await query(
      `SELECT j.id as job_id, j.title as job_title, COUNT(a.id) as count
       FROM jobs j
       LEFT JOIN applicants a ON j.id = a.job_id
       GROUP BY j.id, j.title
       ORDER BY count DESC`
    );

    const applicants_by_job = jobResult.rows.map((row: any) => ({
      job_id: row.job_id,
      job_title: row.job_title,
      count: parseInt(row.count, 10),
    }));

    return Response.json({
      total_applicants,
      applicants_by_status,
      applicants_by_job,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

