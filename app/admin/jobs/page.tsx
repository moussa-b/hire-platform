'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Job } from '@/lib/types';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/jobs')
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setJobs(jobs.filter((j) => j.id !== id));
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Jobs</h1>
          <p className="text-gray-500">Manage job postings</p>
        </div>
        <Link href="/admin/jobs/new">
          <Button>Create Job</Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {jobs.map((job) => (
          <Card key={job.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{job.title}</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    {job.location} • {job.job_type}
                    {job.salary_min && job.salary_max && (
                      <> • ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}</>
                    )}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/jobs/${job.id}`}>
                    <Button variant="outline">Edit</Button>
                  </Link>
                  <Button variant="destructive" onClick={() => handleDelete(job.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{job.description.substring(0, 200)}...</p>
              <div className="mt-4">
                <span className={`text-xs px-2 py-1 rounded ${job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {job.status}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

