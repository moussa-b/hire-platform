// POST /api/applicants/apply - Public application endpoint
import { NextRequest } from 'next/server';
import { query, getClient } from '@/lib/db';
import { handleFileUpload } from '@/lib/file-upload';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const job_id = formData.get('job_id');
    const name = formData.get('name');
    const email = formData.get('email');
    const cover_message = formData.get('cover_message');
    const resume = formData.get('resume') as File | null;

    if (!job_id || !name || !email) {
      return Response.json(
        { error: 'Job ID, name, and email are required' },
        { status: 400 }
      );
    }

    // Verify job exists and is active
    const jobResult = await query('SELECT id FROM jobs WHERE id = $1 AND status = $2', [job_id, 'active']);
    if (jobResult.rows.length === 0) {
      return Response.json(
        { error: 'Job not found or not active' },
        { status: 404 }
      );
    }

    let resume_path = null;

    // Handle file upload if provided
    if (resume && resume.size > 0) {
      try {
        // Convert File to a format formidable can handle
        const bytes = await resume.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Create a mock IncomingMessage-like object
        const mockReq = {
          headers: {
            'content-type': `multipart/form-data; boundary=----WebKitFormBoundary`,
          },
        } as any;

        // Save file directly
        const fs = await import('fs/promises');
        const path = await import('path');
        const uploadDir = path.join(process.cwd(), 'uploads');
        await fs.mkdir(uploadDir, { recursive: true });
        
        const timestamp = Date.now();
        const sanitizedFilename = resume.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${timestamp}_${sanitizedFilename}`;
        const filepath = path.join(uploadDir, filename);
        
        await fs.writeFile(filepath, buffer);
        resume_path = `/uploads/${filename}`;
      } catch (error) {
        console.error('File upload error:', error);
        return Response.json(
          { error: 'Failed to upload resume' },
          { status: 500 }
        );
      }
    }

    // Insert applicant
    const client = await getClient();
    try {
      await client.query('BEGIN');
      
      const result = await client.query(
        `INSERT INTO applicants (job_id, name, email, cover_message, resume_path, status)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [job_id, name, email, cover_message || null, resume_path, 'pending']
      );

      // Log activity
      await client.query(
        'INSERT INTO activity_logs (applicant_id, action) VALUES ($1, $2)',
        [result.rows[0].id, 'Application submitted']
      );

      await client.query('COMMIT');
      
      return Response.json(result.rows[0], { status: 201 });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error creating application:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

