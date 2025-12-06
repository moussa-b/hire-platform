import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { query } from '@/lib/db';
import { AdminNavbar } from '@/components/admin/AdminNavbar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;
  
  if (!token) {
    return null;
  }
  
  const payload = verifyToken(token);
  
  if (!payload) {
    return null;
  }
  
  // Verify user still exists
  const result = await query('SELECT id, email FROM users WHERE id = $1', [payload.userId]);
  
  if (result.rows.length === 0) {
    return null;
  }
  
  return { user: result.rows[0], payload };
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  // Get the pathname from the middleware header
  const pathname = headersList.get('x-pathname') || '';
  const isLoginPage = pathname === '/admin/login';
  
  // Skip auth check for login page
  if (isLoginPage) {
    return <>{children}</>;
  }
  
  const auth = await checkAuth();
  
  // If not authenticated, redirect to login
  if (!auth) {
    redirect('/admin/login');
  }
  
  return (
    <div className="flex h-screen flex-col">
      <AdminNavbar />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

