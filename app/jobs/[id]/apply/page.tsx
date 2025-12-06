'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ApplyPage() {
  const router = useRouter();
  const params = useParams();
  const [jobId, setJobId] = useState<string>('');

  useEffect(() => {
    if (params?.id) {
      setJobId(typeof params.id === 'string' ? params.id : params.id[0]);
    }
  }, [params]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cover_message: '',
  });
  const [resume, setResume] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append('job_id', jobId);
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('cover_message', formData.cover_message);
    if (resume) {
      formDataToSend.append('resume', resume);
    }

    try {
      const res = await fetch('/api/applicants/apply', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Application failed');
        return;
      }

      alert('Application submitted successfully!');
      router.push(`/jobs/${jobId}`);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Apply for Job</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cover_message">Cover Message</Label>
                <Textarea
                  id="cover_message"
                  value={formData.cover_message}
                  onChange={(e) => setFormData({ ...formData, cover_message: e.target.value })}
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resume">Resume (PDF, max 5MB)</Label>
                <Input
                  id="resume"
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setResume(e.target.files?.[0] || null)}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Application'}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

