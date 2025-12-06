'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Applicant {
  id: number;
  name: string;
  email: string;
  cover_message: string;
  status: string;
  decision_notes: string;
  resume_path: string;
  job_title: string;
  created_at: string;
  activity_logs: Array<{ action: string; timestamp: string }>;
}

export default function ApplicantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [applicantId, setApplicantId] = useState<string>('');
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (params?.id) {
      const id = typeof params.id === 'string' ? params.id : params.id[0];
      setApplicantId(id);
      fetch(`/api/admin/applicants/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setApplicant(data);
          setStatus(data.status);
          setNotes(data.decision_notes || '');
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [params]);

  const handleStatusUpdate = async () => {
    const res = await fetch(`/api/admin/applicants/${applicantId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      router.refresh();
      window.location.reload();
    }
  };

  const handleNotesUpdate = async () => {
    const res = await fetch(`/api/admin/applicants/${applicantId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes }),
    });

    if (res.ok) {
      router.refresh();
      window.location.reload();
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!applicant) return <div>Applicant not found</div>;

  return (
    <div className="space-y-6">
      <div>
        <Button variant="outline" onClick={() => router.back()}>Back</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{applicant.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p>{applicant.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Job</p>
            <p>{applicant.job_title}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="maybe">Maybe</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleStatusUpdate} className="mt-2">Update Status</Button>
          </div>
          {applicant.cover_message && (
            <div>
              <p className="text-sm text-gray-500">Cover Message</p>
              <p className="whitespace-pre-line">{applicant.cover_message}</p>
            </div>
          )}
          {applicant.resume_path && (
            <div>
              <p className="text-sm text-gray-500">Resume</p>
              <a href={applicant.resume_path} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                View Resume
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Decision Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
            <Button onClick={handleNotesUpdate}>Save Notes</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {applicant.activity_logs.map((log, idx) => (
              <div key={idx} className="text-sm border-b pb-2">
                <p>{log.action}</p>
                <p className="text-gray-500">{new Date(log.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

