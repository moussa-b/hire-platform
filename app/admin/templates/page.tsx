'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmailTemplate } from '@/lib/types';

interface Template extends EmailTemplate {
  job_id: number;
}

export default function TemplatesPage() {
  const [jobId, setJobId] = useState('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewName, setPreviewName] = useState('John Doe');
  const [previewJobTitle, setPreviewJobTitle] = useState('Software Engineer');

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
      alert('Template saved successfully!');
    } else {
      alert('Failed to save template');
    }
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    setSubject(template.subject);
    setBody(template.body);
  };

  const replaceVariables = (text: string) => {
    return text
      .replace(/\{\{name\}\}/g, previewName)
      .replace(/\{\{job_title\}\}/g, previewJobTitle);
  };

  const getCurrentSubject = (status: string) => {
    if (editingTemplate?.status === status) return subject;
    const template = templates.find((t) => t.status === status);
    return template?.subject || '';
  };

  const getCurrentBody = (status: string) => {
    if (editingTemplate?.status === status) return body;
    const template = templates.find((t) => t.status === status);
    return template?.body || '';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Email Templates</h1>
        <p className="text-gray-500">Manage email templates for automated responses</p>
      </div>

      {/* How It Works Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg">How Email Templates Work</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <p className="font-semibold mb-1">1. Templates are per job</p>
            <p className="text-gray-600">Each job can have its own set of email templates. Enter a Job ID to load or create templates for that specific job.</p>
          </div>
          <div>
            <p className="font-semibold mb-1">2. Three template types</p>
            <p className="text-gray-600">Create separate templates for each decision status:</p>
            <ul className="list-disc list-inside ml-2 text-gray-600">
              <li><strong>Yes:</strong> Sent when you mark an applicant as "Yes"</li>
              <li><strong>Maybe:</strong> Sent when you mark an applicant as "Maybe"</li>
              <li><strong>No:</strong> Sent when you mark an applicant as "No"</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-1">3. Automatic sending</p>
            <p className="text-gray-600">When you change an applicant's status in the Applicants page, the corresponding email template is automatically sent to them.</p>
          </div>
          <div>
            <p className="font-semibold mb-1">4. Use variables</p>
            <p className="text-gray-600">Use <code className="bg-white px-1 rounded">{'{{name}}'}</code> and <code className="bg-white px-1 rounded">{'{{job_title}}'}</code> in your templates. These will be replaced with the applicant's name and job title when the email is sent.</p>
          </div>
        </CardContent>
      </Card>

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
                placeholder="Enter job ID (e.g., 1, 2, 3...)"
              />
              <Button onClick={loadTemplates}>Load Templates</Button>
            </div>
            <p className="text-xs text-gray-500">Enter the ID of the job you want to manage templates for</p>
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
            const isEditing = editingTemplate?.status === status;
            const currentSubject = getCurrentSubject(status);
            const currentBody = getCurrentBody(status);

            return (
              <TabsContent key={status} value={status}>
                <Card>
                  <CardHeader>
                    <CardTitle>Template for "{status}" Status</CardTitle>
                    <CardDescription>
                      This email will be sent automatically when you mark an applicant as "{status}" for job #{jobId}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Email Subject</Label>
                      <Input
                        value={currentSubject}
                        onChange={(e) => {
                          setSubject(e.target.value);
                          if (template) handleEdit(template);
                        }}
                        onFocus={() => template && handleEdit(template)}
                        placeholder="e.g., Congratulations! We would like to move forward"
                      />
                      <p className="text-xs text-gray-500">
                        You can use <code className="bg-gray-100 px-1 rounded">{'{{name}}'}</code> and <code className="bg-gray-100 px-1 rounded">{'{{job_title}}'}</code> here
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Email Body (HTML)</Label>
                      <Textarea
                        value={currentBody}
                        onChange={(e) => {
                          setBody(e.target.value);
                          if (template) handleEdit(template);
                        }}
                        onFocus={() => template && handleEdit(template)}
                        rows={12}
                        className="font-mono text-sm"
                        placeholder={`<p>Dear {{name}},</p>
<p>Thank you for your interest in the {{job_title}} position...</p>
<p>Best regards,<br>The Hiring Team</p>`}
                      />
                      <div className="bg-gray-50 p-3 rounded text-xs space-y-1">
                        <p className="font-semibold">Available variables:</p>
                        <ul className="list-disc list-inside ml-2 space-y-0.5">
                          <li><code>{'{{name}}'}</code> - Applicant's full name</li>
                          <li><code>{'{{job_title}}'}</code> - Job title</li>
                        </ul>
                        <p className="mt-2 font-semibold">HTML is supported:</p>
                        <p className="ml-2">Use HTML tags like &lt;p&gt;, &lt;br&gt;, &lt;strong&gt;, etc.</p>
                      </div>
                    </div>
                    
                    {/* Preview Section */}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <Label>Preview</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowPreview(!showPreview)}
                        >
                          {showPreview ? 'Hide Preview' : 'Show Preview'}
                        </Button>
                      </div>
                      {showPreview && (
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Preview name"
                              value={previewName}
                              onChange={(e) => setPreviewName(e.target.value)}
                              className="text-sm"
                            />
                            <Input
                              placeholder="Preview job title"
                              value={previewJobTitle}
                              onChange={(e) => setPreviewJobTitle(e.target.value)}
                              className="text-sm"
                            />
                          </div>
                          <Card className="bg-white border-2">
                            <CardContent className="p-4">
                              <div className="space-y-1 mb-3">
                                <p className="text-xs text-gray-500">To: applicant@example.com</p>
                                <p className="text-xs text-gray-500">Subject: {replaceVariables(currentSubject) || '(empty)'}</p>
                              </div>
                              <div 
                                className="prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: replaceVariables(currentBody) || '<p className="text-gray-400 italic">(empty)</p>' }}
                              />
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </div>

                    <Button onClick={() => handleSave(status)} className="w-full">
                      {template ? 'Update Template' : 'Create Template'}
                    </Button>
                    {template && (template.updated_at || template.created_at) && (
                      <p className="text-xs text-gray-500 text-center">
                        Last updated: {new Date(template.updated_at || template.created_at).toLocaleString()}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            );
          })}
        </Tabs>
      )}

      {jobId && templates.length === 0 && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <p className="text-sm text-yellow-800">
              No templates found for job #{jobId}. Create your first template by selecting a tab above and filling in the subject and body fields.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

