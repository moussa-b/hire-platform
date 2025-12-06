// Mailgun email service wrapper
import formData from 'form-data';
import Mailgun from 'mailgun.js';

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY || '',
});

const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || '';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
    return false;
  }

  try {
    const messageData = {
      from: options.from || `Hiring Platform <noreply@${MAILGUN_DOMAIN}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    await mg.messages.create(MAILGUN_DOMAIN, messageData);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export function replaceTemplateVariables(template: string, variables: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }
  return result;
}

