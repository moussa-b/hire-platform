// File upload handler for resumes
import { IncomingMessage } from 'http';
import formidable from 'formidable';
import fs from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Ensure upload directory exists
export async function ensureUploadDir() {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
}

export interface UploadResult {
  filepath: string;
  originalFilename: string;
  size: number;
}

export async function handleFileUpload(
  req: IncomingMessage
): Promise<UploadResult | null> {
  await ensureUploadDir();

  const form = formidable({
    uploadDir: UPLOAD_DIR,
    keepExtensions: true,
    maxFileSize: MAX_FILE_SIZE,
    filter: (part) => {
      return part.mimetype === 'application/pdf';
    },
  });

  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }

      const file = Array.isArray(files.resume) ? files.resume[0] : files.resume;
      
      if (!file) {
        resolve(null);
        return;
      }

      // Validate file type
      if (file.mimetype !== 'application/pdf') {
        reject(new Error('Only PDF files are allowed'));
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        reject(new Error('File size exceeds 5MB limit'));
        return;
      }

      // Generate unique filename
      const timestamp = Date.now();
      const sanitizedFilename = file.originalFilename?.replace(/[^a-zA-Z0-9.-]/g, '_') || 'resume.pdf';
      const newFilename = `${timestamp}_${sanitizedFilename}`;
      const newFilepath = path.join(UPLOAD_DIR, newFilename);

      // Rename file
      try {
        await fs.rename(file.filepath, newFilepath);
        resolve({
          filepath: `/uploads/${newFilename}`,
          originalFilename: file.originalFilename || 'resume.pdf',
          size: file.size,
        });
      } catch (error) {
        reject(error);
      }
    });
  });
}

