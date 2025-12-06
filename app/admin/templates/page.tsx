'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Template {
  id: number;
  job_id: number;
  status: string;
  subject: string;
  body: string;
}

export default function TemplatesPage() {
  const [jobId, setJobId] = useState('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const loadTemplates = async () => {
    if (!jobId) return;
    const res = await fetch(`/api/admin/templates/${jobId}`);
    const data = await res.json();
    setTemplates(data);
  };

  useEffect(() => {
    if (jobId) {
      loadTemplates();
    }
  }, [jobId]);

  const handleSave = async (status: string) => {
    if (!jobId || !subject || !body) {
      alert('Please fill in all fields');
      return;
    }

    const res = await fetch(`/api/admin/templates/${jobId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, subject, body }),
    });

    if (res.ok) {
      loadTemplates();
      setEditingTemplate(null);
      setSubject('');
      setBody('');
    }
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    setSubject(template.subject);
    setBody(template.body);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Email Templates</h1>
        <p className="text-gray-500">Manage email templates for automated responses</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <Label htmlFor="job_id">Job ID</Label>
            <div className="flex gap-2">
              <Input
                id="job_id"
                type="number"
                value={jobId}
                onChange={(e) => setJobId(e.target.value)}
                placeholder="Enter job ID"
              />
              <Button onClick={loadTemplates}>Load Templates</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {templates.length > 0 && (
        <Tabs defaultValue="yes">
          <TabsList>
            <TabsTrigger value="yes">Yes</TabsTrigger>
            <TabsTrigger value="maybe">Maybe</TabsTrigger>
            <TabsTrigger value="no">No</TabsTrigger>
          </TabsList>

          {['yes', 'maybe', 'no'].map((status) => {
            const template = templates.find((t) => t.status === status);
            return (
              <TabsContent key={status} value={status}>
                <Card>
                  <CardHeader>
                    <CardTitle>Template for {status}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <Input
                        value={editingTemplate?.status === status ? subject : template?.subject || ''}
                        onChange={(e) => setSubject(e.target.value)}
                        onFocus={() => template && handleEdit(template)}
                        placeholder="Email subject"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Body (HTML)</Label>
                      <Textarea
                        value={editingTemplate?.status === status ? body : template?.body || ''}
                        onChange={(e) => {
                          setBody(e.target.value);
                          if (template) handleEdit(template);
                        }}
                        onFocus={() => template && handleEdit(template)}
                        rows={10}
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-gray-500">
                        Use {'{'}{'{'}name{'}'}{'}'} and {'{'}{'{'}job_title{'}'}{'}'} as placeholders. HTML is supported.
                      </p>
                    </div>
                    <Button onClick={() => handleSave(status)}>Save Template</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            );
          })}
        </Tabs>
      )}
    </div>
  );
}

