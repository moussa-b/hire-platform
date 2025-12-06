// POST /api/admin/applicants/[id]/notes - Add notes to applicant
import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/middleware';
import { query, getClient } from '@/lib/db';

export async function POST(
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
    const { notes } = body;

    const client = await getClient();
    try {
      await client.query('BEGIN');

      // Update notes
      const result = await client.query(
        'UPDATE applicants SET decision_notes = $1 WHERE id = $2 RETURNING *',
        [notes || null, id]
      );

      if (result.rows.length === 0) {
        await client.query('ROLLBACK');
        return Response.json(
          { error: 'Applicant not found' },
          { status: 404 }
        );
      }

      // Log activity
      await client.query(
        'INSERT INTO activity_logs (applicant_id, action) VALUES ($1, $2)',
        [id, 'Note added: ' + (notes || 'Note cleared')]
      );

      await client.query('COMMIT');
      return Response.json(result.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error updating notes:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

