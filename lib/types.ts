// Type definitions for the hiring platform

export interface User {
  id: number;
  email: string;
  password_hash: string;
  created_at: Date;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  location: string | null;
  job_type: string | null;
  salary_min: number | null;
  salary_max: number | null;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface Applicant {
  id: number;
  job_id: number;
  name: string;
  email: string;
  cover_message: string | null;
  resume_path: string | null;
  status: 'pending' | 'yes' | 'maybe' | 'no';
  decision_notes: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface EmailTemplate {
  id: number;
  job_id: number | null;
  status: 'yes' | 'maybe' | 'no';
  subject: string;
  body: string;
  created_at: Date;
  updated_at: Date;
}

export interface ActivityLog {
  id: number;
  applicant_id: number;
  action: string;
  timestamp: Date;
}

export interface DashboardStats {
  total_applicants: number;
  applicants_by_status: {
    pending: number;
    yes: number;
    maybe: number;
    no: number;
  };
  applicants_by_job: Array<{
    job_id: number;
    job_title: string;
    count: number;
  }>;
}

export interface JWTPayload {
  userId: number;
  email: string;
}

