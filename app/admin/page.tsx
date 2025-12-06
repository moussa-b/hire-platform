'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats } from '@/lib/types';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard/stats')
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!stats) {
    return <div>Error loading dashboard</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Overview of your hiring platform</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Applicants</CardTitle>
            <CardDescription>All time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total_applicants}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending</CardTitle>
            <CardDescription>Awaiting review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.applicants_by_status.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Yes</CardTitle>
            <CardDescription>Accepted</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.applicants_by_status.yes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Maybe</CardTitle>
            <CardDescription>Under consideration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.applicants_by_status.maybe}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Applicants by Job</CardTitle>
          <CardDescription>Distribution across job postings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.applicants_by_job.map((job) => (
              <div key={job.job_id} className="flex items-center justify-between">
                <span className="text-sm">{job.job_title}</span>
                <span className="font-semibold">{job.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

