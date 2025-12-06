'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface User {
  id: number;
  email: string;
}

export function AdminNavbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [version, setVersion] = useState<string>('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        } else {
          router.push('/admin/login');
        }
      })
      .catch(() => router.push('/admin/login'));

    fetch('/api/version')
      .then((res) => res.json())
      .then((data) => setVersion(data.version || ''));
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <nav className="border-b bg-white">
      <div className="flex h-16 items-center justify-between px-6">
        <h1 className="text-xl font-semibold">Hiring Platform</h1>
        <div className="flex items-center gap-4">
          {version && (
            <span className="text-sm text-gray-500">v{version}</span>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarFallback>{user ? getInitials(user.email) : 'A'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="px-2 py-1.5 text-sm">
                <div className="font-medium">{user?.email}</div>
                {version && (
                  <div className="text-xs text-gray-500">Version: {version}</div>
                )}
              </div>
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}

