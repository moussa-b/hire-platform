# Hiring Platform (ATS-Lite)

> **Note**: This project was developed as a technical demonstration for the Upwork job posting: [https://www.upwork.com/jobs/~021997338779777640467](https://www.upwork.com/jobs/~021997338779777640467)

A lightweight hiring platform where companies can post jobs, receive applications, and make simple decisions (Yes / Maybe / No) with automated email responses.

## Features

- **Admin Dashboard**: Manage jobs, applicants, and email templates
- **Public Job Pages**: Applicants can view jobs and submit applications
- **Automated Emails**: Send automated responses based on applicant decisions
- **Version Management**: Automatic versioning with each push
- **Health & Version Endpoints**: Monitor application status

## Technical Stack

### Frontend

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router architecture
  - Server Components and Client Components
  - File-based routing system
  - Built-in API routes for backend functionality
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) with strict type checking
- **Styling**: 
  - [TailwindCSS 4](https://tailwindcss.com/) for utility-first CSS
  - [Shadcn UI](https://ui.shadcn.com/) component library built on Radix UI primitives
  - Custom CSS with CSS variables for theming
- **UI Components** (Radix UI primitives):
  - `@radix-ui/react-avatar` - Avatar components
  - `@radix-ui/react-dropdown-menu` - Dropdown menus
  - `@radix-ui/react-dialog` - Modal dialogs
  - `@radix-ui/react-label` - Form labels
  - `@radix-ui/react-select` - Select dropdowns
  - `@radix-ui/react-tabs` - Tab navigation
  - `@radix-ui/react-toast` - Toast notifications
- **Rich Text Editor**: [CKEditor 5](https://ckeditor.com/ckeditor-5/) with React integration (`@ckeditor/ckeditor5-react`)
- **Icons**: [Lucide React](https://lucide.dev/) - Modern icon library
- **Fonts**: Geist Sans and Geist Mono (via Next.js Google Fonts)

### Backend

- **Runtime**: Node.js 20+
- **Framework**: Next.js 16 API Routes (App Router)
  - RESTful API endpoints
  - Route handlers for server-side logic
  - Middleware for authentication and request handling
- **Database**: 
  - [PostgreSQL](https://www.postgresql.org/) - Relational database
  - [pg](https://node-postgres.com/) - PostgreSQL client for Node.js
  - Raw SQL queries (no ORM)
  - Connection pooling for performance
- **Authentication & Security**:
  - [JWT](https://jwt.io/) (jsonwebtoken) for stateless authentication
  - [bcryptjs](https://www.npmjs.com/package/bcryptjs) for password hashing
  - Cookie-based session management
- **File Handling**:
  - [Formidable](https://github.com/node-formidable/formidable) for multipart form data and file uploads
  - File storage in `/uploads` directory
- **Email Service**: 
  - [Mailgun](https://www.mailgun.com/) via `mailgun.js` SDK
  - Automated email responses based on applicant status
  - Customizable email templates
- **Data Export**: 
  - [csv-writer](https://www.npmjs.com/package/csv-writer) for CSV generation
  - Applicant data export functionality

### Infrastructure & DevOps

- **Containerization**: 
  - [Docker](https://www.docker.com/) for application containerization
  - [Docker Compose](https://docs.docker.com/compose/) for multi-container orchestration
  - Standalone Next.js output mode for optimized Docker builds
- **CI/CD**: 
  - [GitHub Actions](https://github.com/features/actions) for automated workflows
  - Automatic version bumping on commits
  - Docker image building and pushing to DockerHub
- **Database Management**: 
  - SQL initialization scripts
  - Database seeding scripts for development
  - Migration-ready structure

### Architecture Patterns

- **Full-Stack Monorepo**: Single Next.js application handling both frontend and backend
- **API-First Design**: RESTful API endpoints with clear separation of concerns
- **Server-Side Rendering (SSR)**: Next.js App Router for optimal performance
- **Type Safety**: End-to-end TypeScript for type safety across frontend and backend
- **Component-Based UI**: Reusable React components with Shadcn UI
- **Raw SQL Queries**: Direct database access without ORM overhead for performance and control

## Getting Started

### Prerequisites

- Node.js 20+
- Docker and Docker Compose
- PostgreSQL (or use Docker Compose)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hire-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:
   ```env
   DATABASE_URL=postgresql://hire_user:hire_password@localhost:5432/hire_platform
   JWT_SECRET=your-secret-key
   MAILGUN_API_KEY=your-mailgun-api-key
   MAILGUN_DOMAIN=your-mailgun-domain
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Start PostgreSQL with Docker Compose**
   ```bash
   docker-compose up -d postgres
   ```

5. **Initialize the database**
   ```bash
   # Run the init script
   psql -h localhost -U hire_user -d hire_platform -f scripts/init-db.sql
   
   # Optionally seed with dummy data
   psql -h localhost -U hire_user -d hire_platform -f scripts/seed-dummy-data.sql
   ```

6. **Create an admin user**
   ```bash
   # You'll need to hash a password. You can use Node.js:
   node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your-password', 10).then(hash => console.log(hash))"
   
   # Then insert into database:
   psql -h localhost -U hire_user -d hire_platform -c "INSERT INTO users (email, password_hash) VALUES ('admin@company.com', '<hashed-password>');"
   ```

7. **Run the development server**
   ```bash
   npm run dev
   ```

8. **Access the application**
   - Admin: http://localhost:3000/admin/login
   - Public job page: http://localhost:3000/jobs/[job-id]

### Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Initialize database** (first time only)
   ```bash
   docker-compose exec postgres psql -U hire_user -d hire_platform -f /docker-entrypoint-initdb.d/init-db.sql
   ```

3. **Seed dummy data** (optional)
   ```bash
   docker-compose exec postgres psql -U hire_user -d hire_platform -f /docker-entrypoint-initdb.d/seed-dummy-data.sql
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### System
- `GET /api/health` - Health check
- `GET /api/version` - Get application version

### Jobs
- `GET /api/jobs` - List jobs (admin)
- `POST /api/jobs` - Create job (admin)
- `GET /api/jobs/:id` - Get job (admin)
- `PUT /api/jobs/:id` - Update job (admin)
- `DELETE /api/jobs/:id` - Delete job (admin)
- `GET /api/jobs/:id/public` - Get public job details

### Applicants
- `POST /api/applicants/apply` - Submit application (public)
- `GET /api/admin/applicants` - List applicants (admin)
- `GET /api/admin/applicants/:id` - Get applicant details (admin)
- `PUT /api/admin/applicants/:id/status` - Update status (admin)
- `POST /api/admin/applicants/:id/notes` - Add notes (admin)
- `GET /api/admin/applicants/export` - Export CSV (admin)

### Email Templates
- `GET /api/admin/templates/:job_id` - Get templates (admin)
- `PUT /api/admin/templates/:job_id` - Update template (admin)

### Dashboard
- `GET /api/admin/dashboard/stats` - Get dashboard statistics (admin)

## Version Management

The application uses automatic versioning with the pattern `YYYY.MM.DD.XX` (e.g., `2025.01.05.01`).

- Version is automatically incremented on each push to main/master
- If the date changes, version resets to `.01`
- If the same date, build number increments
- Version is displayed in the admin UI (account menu)

## GitHub Actions

The workflow automatically:
1. Increments the version in `package.json`
2. Commits the version bump
3. Builds a Docker image
4. Pushes to DockerHub

### Required Secrets

- `DOCKERHUB_USERNAME` - Your DockerHub username
- `DOCKERHUB_TOKEN` - Your DockerHub access token

## Database Schema

- **users**: Admin users
- **jobs**: Job postings
- **applicants**: Job applications
- **email_templates**: Email templates for automated responses
- **activity_logs**: Activity tracking

See `scripts/init-db.sql` for the complete schema.

## License

Private project
