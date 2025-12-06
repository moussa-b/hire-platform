// PUT /api/admin/applicants/[id]/status - Update applicant status and send email
import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/middleware';
import { query, getClient } from '@/lib/db';
import { sendEmail, replaceTemplateVariables } from '@/lib/email';

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
    const { status } = body;

    if (!status || !['pending', 'yes', 'maybe', 'no'].includes(status)) {
      return Response.json(
        { error: 'Valid status is required (pending, yes, maybe, no)' },
        { status: 400 }
      );
    }

    const client = await getClient();
    try {
      await client.query('BEGIN');

      // Get applicant with job details
      const applicantResult = await client.query(
        `SELECT a.*, j.title as job_title
         FROM applicants a
         JOIN jobs j ON a.job_id = j.id
         WHERE a.id = $1`,
        [id]
      );

      if (applicantResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return Response.json(
          { error: 'Applicant not found' },
          { status: 404 }
        );
      }

      const applicant = applicantResult.rows[0];

      // Update status
      const updateResult = await client.query(
        'UPDATE applicants SET status = $1 WHERE id = $2 RETURNING *',
        [status, id]
      );

      // Log activity
      await client.query(
        'INSERT INTO activity_logs (applicant_id, action) VALUES ($1, $2)',
        [id, `Status changed to: ${status}`]
      );

      // Send email if status changed to yes, maybe, or no
      if (['yes', 'maybe', 'no'].includes(status)) {
        // Get email template
        const templateResult = await client.query(
          'SELECT * FROM email_templates WHERE job_id = $1 AND status = $2',
          [applicant.job_id, status]
        );

        if (templateResult.rows.length > 0) {
          const template = templateResult.rows[0];
          const emailBody = replaceTemplateVariables(template.body, {
            name: applicant.name,
            job_title: applicant.job_title,
          });

          await sendEmail({
            to: applicant.email,
            subject: replaceTemplateVariables(template.subject, {
              name: applicant.name,
              job_title: applicant.job_title,
            }),
            html: emailBody,
          });
        }
      }

      await client.query('COMMIT');
      return Response.json(updateResult.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error updating applicant status:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

