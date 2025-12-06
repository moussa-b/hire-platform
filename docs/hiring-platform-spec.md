# MVP Specification --- Hiring Platform (ATS-Lite)

A lightweight hiring platform where companies can post jobs, receive
applications, and make simple decisions (Yes / Maybe / No) with
automated email responses.

https://www.upwork.com/jobs/~021997338779777640467

## 1. Functional Specifications

### 1.1. User Roles

#### Admin (Company Manager)

-   Authenticate via email + password
-   Create, edit, archive job postings
-   Share public job links
-   View and filter applicants
-   Mark applicants as: Yes, Maybe, No
-   Edit email templates (per decision)
-   Add internal notes
-   View activity logs
-   Export applicants (CSV)

#### Applicant

-   View job details on a public page
-   Submit application with:
    -   Full name
    -   Email
    -   Optional cover message
    -   Resume (PDF upload)
-   Receive automated email based on decision

## 2. Functional Requirements

### 2.1 Authentication

-   Admin-only login system
-   Email + password
-   Password hashing (bcrypt)
-   JWT-based authentication (HTTP-only cookies)

### 2.2 Job Management

Admins can: - Create a job posting - Edit job details - Archive/activate
jobs - Delete jobs - Copy/share public job URL

Job Fields: - Title - Description - Location - Job type - Salary range -
Status

### 2.3 Applicant Management

Applicants submit: - Name - Email - Cover message - Resume PDF upload -
Job ID

Admin capabilities: - Filter applicants by job - Filter by status -
Search - View details - Decision assignment - Notes - Activity log

### 2.4 Automated Email Responses

Triggered by decisions: - Yes → interest email - Maybe → delay email -
No → rejection email

Admins can edit templates.

### 2.5 Resume Storage

-   Local filesystem (/uploads)
-   Path stored in database

### 2.6 Dashboard KPIs

-   Total applicants
-   Applicants by status
-   Applicants by job

## 3. Technical Specifications

### Tech Stack

Backend: NextJS + Raw PostgreSQL no ORM

Frontend: - React - TailwindCSS - Shadcn

Hosting: Docker compose

## 4. Database Schema (PostgreSQL)

Users: - id, email, password_hash, created_at

Jobs: - id, title, description, location, job_type, salary_min,
salary_max, status, timestamps

Applicants: - id, job_id, name, email, cover_message, resume_path,
status, decision_notes, timestamps

Email Templates: - id, job_id, status, subject, body, updated_at

Activity Logs: - id, applicant_id, action, timestamp

## 5. API Endpoints

Authentication: - POST /auth/login - POST /auth/logout

Jobs: - GET /jobs - POST /jobs - GET /jobs/:id - PUT /jobs/:id - DELETE
/jobs/:id - GET /jobs/:id/public

Applicants: - POST /applicants/apply - GET /admin/applicants - GET
/admin/applicants/:id - PUT /admin/applicants/:id/status - POST
/admin/applicants/:id/notes

Email Templates: - GET /admin/templates/:job_id - PUT
/admin/templates/:template_id

## 6. UI Structure

Admin: - Login - Dashboard - Jobs - Applicants - Applicant Detail -
Email Templates

Applicant: - Public Job Page - Apply Form
