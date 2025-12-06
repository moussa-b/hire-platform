'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Applicant {
  id: number;
  name: string;
  email: string;
  status: string;
  job_title: string;
  created_at: string;
}

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ job_id: '', status: 'all', search: '' });

  useEffect(() => {
    loadApplicants();
  }, [filters]);

  const loadApplicants = () => {
    const params = new URLSearchParams();
    if (filters.job_id) params.append('job_id', filters.job_id);
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);

    fetch(`/api/admin/applicants?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setApplicants(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Applicants</h1>
        <p className="text-gray-500">Manage job applications</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4">
            <Input
              placeholder="Search by name or email..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            <Select
              value={filters.status}
              onValueChange={(value) => setFilters({ ...filters, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="maybe">Maybe</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => window.open('/api/admin/applicants/export', '_blank')}>
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {applicants.map((applicant) => (
          <Card key={applicant.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Link href={`/admin/applicants/${applicant.id}`} className="font-semibold hover:underline">
                    {applicant.name}
                  </Link>
                  <p className="text-sm text-gray-500">{applicant.email}</p>
                  <p className="text-sm text-gray-600">{applicant.job_title}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    applicant.status === 'yes' ? 'bg-green-100 text-green-800' :
                    applicant.status === 'maybe' ? 'bg-yellow-100 text-yellow-800' :
                    applicant.status === 'no' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {applicant.status}
                  </span>
                  <Link href={`/admin/applicants/${applicant.id}`}>
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

