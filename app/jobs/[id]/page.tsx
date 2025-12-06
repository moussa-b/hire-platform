'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  job_type: string;
  salary_min: number;
  salary_max: number;
}

export default function PublicJobPage({ params }: { params: Promise<{ id: string }> }) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [jobId, setJobId] = useState<string>('');

  useEffect(() => {
    params.then((p) => {
      setJobId(p.id);
      fetch(`/api/jobs/${p.id}/public`)
        .then((res) => res.json())
        .then((data) => {
          setJob(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    });
  }, [params]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!job) return <div className="p-8">Job not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{job.title}</CardTitle>
            <div className="flex gap-4 text-sm text-gray-600 mt-2">
              {job.location && <span>📍 {job.location}</span>}
              {job.job_type && <span>💼 {job.job_type}</span>}
              {job.salary_min && job.salary_max && (
                <span>💰 ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}</span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none mb-6">
              <p className="whitespace-pre-line">{job.description}</p>
            </div>
            <Link href={`/jobs/${job.id}/apply`}>
              <Button size="lg" className="w-full">Apply Now</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

