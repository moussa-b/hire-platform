-- Seed Dummy Data for Hiring Platform

-- Insert admin user (password: admin123 - hash generated with bcrypt)
INSERT INTO users (email, password_hash) VALUES
('admin@company.com', '$2b$10$FU5ElwpiaHL17Kc28I2AJeKbBxiMhoXwoWSKU6PBGrNIqtFWNOONS')
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;

-- Note: The password hash above is for 'admin123'. In production, use a proper bcrypt hash.
-- For demo purposes, you may want to create a user with a known password hash.

-- Insert sample jobs
INSERT INTO jobs (title, description, location, job_type, salary_min, salary_max, status) VALUES
('Senior Full Stack Developer', 'We are looking for an experienced full stack developer to join our team. You will work on building scalable web applications using modern technologies.', 'San Francisco, CA', 'Full-time', 120000, 180000, 'active'),
('Product Manager', 'Join our product team to drive innovation and deliver exceptional user experiences. You will work closely with engineering and design teams.', 'New York, NY', 'Full-time', 100000, 150000, 'active'),
('UX Designer', 'We need a creative UX designer to help shape the future of our products. Experience with design systems and user research is a plus.', 'Remote', 'Full-time', 80000, 120000, 'active'),
('DevOps Engineer', 'Looking for a DevOps engineer to help scale our infrastructure. Experience with AWS, Docker, and Kubernetes required.', 'Austin, TX', 'Full-time', 110000, 160000, 'active'),
('Marketing Manager', 'Lead our marketing efforts and help grow our brand. Experience with digital marketing and content strategy required.', 'Chicago, IL', 'Full-time', 70000, 100000, 'active')
ON CONFLICT DO NOTHING;

-- Insert sample applicants
INSERT INTO applicants (job_id, name, email, cover_message, resume_path, status, decision_notes) VALUES
(1, 'John Smith', 'john.smith@email.com', 'I am very interested in this position. I have 5 years of experience in full stack development.', '/uploads/resume_john_smith.pdf', 'yes', 'Strong candidate with relevant experience'),
(1, 'Sarah Johnson', 'sarah.j@email.com', 'I would love to contribute to your team. I have experience with React and Node.js.', '/uploads/resume_sarah_johnson.pdf', 'maybe', 'Good skills but needs more experience'),
(1, 'Mike Davis', 'mike.davis@email.com', 'I am excited about this opportunity. I have been working with modern web technologies for 3 years.', '/uploads/resume_mike_davis.pdf', 'pending', NULL),
(2, 'Emily Chen', 'emily.chen@email.com', 'I have a strong background in product management and would love to discuss this role further.', '/uploads/resume_emily_chen.pdf', 'yes', 'Excellent product sense and communication skills'),
(2, 'David Wilson', 'david.wilson@email.com', 'I am interested in this position. I have managed multiple products in the tech industry.', '/uploads/resume_david_wilson.pdf', 'no', 'Not the right fit for our team'),
(3, 'Lisa Anderson', 'lisa.anderson@email.com', 'I am passionate about UX design and creating user-centered experiences.', '/uploads/resume_lisa_anderson.pdf', 'yes', 'Great portfolio and design skills'),
(3, 'Robert Taylor', 'robert.taylor@email.com', 'I have experience in UX/UI design and would love to join your team.', '/uploads/resume_robert_taylor.pdf', 'pending', NULL),
(4, 'Jennifer Brown', 'jennifer.brown@email.com', 'I am a DevOps engineer with extensive experience in cloud infrastructure.', '/uploads/resume_jennifer_brown.pdf', 'maybe', 'Good technical skills, need to assess cultural fit'),
(4, 'Michael Martinez', 'michael.martinez@email.com', 'I have been working in DevOps for 4 years and am looking for new challenges.', '/uploads/resume_michael_martinez.pdf', 'pending', NULL),
(5, 'Amanda White', 'amanda.white@email.com', 'I have a strong background in marketing and would love to help grow your brand.', '/uploads/resume_amanda_white.pdf', 'yes', 'Excellent marketing experience'),
(5, 'Christopher Lee', 'chris.lee@email.com', 'I am interested in this marketing position. I have experience with digital marketing campaigns.', '/uploads/resume_christopher_lee.pdf', 'pending', NULL)
ON CONFLICT DO NOTHING;

-- Insert email templates
INSERT INTO email_templates (job_id, status, subject, body) VALUES
(1, 'yes', 'Congratulations! We would like to move forward', '<p>Dear {{name}},</p><p>Thank you for your interest in the {{job_title}} position. We are pleased to inform you that we would like to move forward with your application.</p><p>We will be in touch soon to schedule the next steps.</p><p>Best regards,<br>The Hiring Team</p>'),
(1, 'maybe', 'Your Application - Next Steps', '<p>Dear {{name}},</p><p>Thank you for applying to the {{job_title}} position. We are currently reviewing your application and will keep you updated on our decision.</p><p>We appreciate your patience.</p><p>Best regards,<br>The Hiring Team</p>'),
(1, 'no', 'Thank you for your application', '<p>Dear {{name}},</p><p>Thank you for your interest in the {{job_title}} position. After careful consideration, we have decided to move forward with other candidates.</p><p>We wish you the best in your job search.</p><p>Best regards,<br>The Hiring Team</p>'),
(2, 'yes', 'Congratulations! We would like to move forward', '<p>Dear {{name}},</p><p>Thank you for your interest in the {{job_title}} position. We are pleased to inform you that we would like to move forward with your application.</p><p>We will be in touch soon to schedule the next steps.</p><p>Best regards,<br>The Hiring Team</p>'),
(2, 'maybe', 'Your Application - Next Steps', '<p>Dear {{name}},</p><p>Thank you for applying to the {{job_title}} position. We are currently reviewing your application and will keep you updated on our decision.</p><p>We appreciate your patience.</p><p>Best regards,<br>The Hiring Team</p>'),
(2, 'no', 'Thank you for your application', '<p>Dear {{name}},</p><p>Thank you for your interest in the {{job_title}} position. After careful consideration, we have decided to move forward with other candidates.</p><p>We wish you the best in your job search.</p><p>Best regards,<br>The Hiring Team</p>'),
(3, 'yes', 'Congratulations! We would like to move forward', '<p>Dear {{name}},</p><p>Thank you for your interest in the {{job_title}} position. We are pleased to inform you that we would like to move forward with your application.</p><p>We will be in touch soon to schedule the next steps.</p><p>Best regards,<br>The Hiring Team</p>'),
(3, 'maybe', 'Your Application - Next Steps', '<p>Dear {{name}},</p><p>Thank you for applying to the {{job_title}} position. We are currently reviewing your application and will keep you updated on our decision.</p><p>We appreciate your patience.</p><p>Best regards,<br>The Hiring Team</p>'),
(3, 'no', 'Thank you for your application', '<p>Dear {{name}},</p><p>Thank you for your interest in the {{job_title}} position. After careful consideration, we have decided to move forward with other candidates.</p><p>We wish you the best in your job search.</p><p>Best regards,<br>The Hiring Team</p>'),
(4, 'yes', 'Congratulations! We would like to move forward', '<p>Dear {{name}},</p><p>Thank you for your interest in the {{job_title}} position. We are pleased to inform you that we would like to move forward with your application.</p><p>We will be in touch soon to schedule the next steps.</p><p>Best regards,<br>The Hiring Team</p>'),
(4, 'maybe', 'Your Application - Next Steps', '<p>Dear {{name}},</p><p>Thank you for applying to the {{job_title}} position. We are currently reviewing your application and will keep you updated on our decision.</p><p>We appreciate your patience.</p><p>Best regards,<br>The Hiring Team</p>'),
(4, 'no', 'Thank you for your application', '<p>Dear {{name}},</p><p>Thank you for your interest in the {{job_title}} position. After careful consideration, we have decided to move forward with other candidates.</p><p>We wish you the best in your job search.</p><p>Best regards,<br>The Hiring Team</p>'),
(5, 'yes', 'Congratulations! We would like to move forward', '<p>Dear {{name}},</p><p>Thank you for your interest in the {{job_title}} position. We are pleased to inform you that we would like to move forward with your application.</p><p>We will be in touch soon to schedule the next steps.</p><p>Best regards,<br>The Hiring Team</p>'),
(5, 'maybe', 'Your Application - Next Steps', '<p>Dear {{name}},</p><p>Thank you for applying to the {{job_title}} position. We are currently reviewing your application and will keep you updated on our decision.</p><p>We appreciate your patience.</p><p>Best regards,<br>The Hiring Team</p>'),
(5, 'no', 'Thank you for your application', '<p>Dear {{name}},</p><p>Thank you for your interest in the {{job_title}} position. After careful consideration, we have decided to move forward with other candidates.</p><p>We wish you the best in your job search.</p><p>Best regards,<br>The Hiring Team</p>')
ON CONFLICT (job_id, status) DO NOTHING;

-- Insert activity logs
INSERT INTO activity_logs (applicant_id, action) VALUES
(1, 'Application submitted'),
(1, 'Status changed to: yes'),
(1, 'Note added: Strong candidate with relevant experience'),
(2, 'Application submitted'),
(2, 'Status changed to: maybe'),
(2, 'Note added: Good skills but needs more experience'),
(3, 'Application submitted'),
(4, 'Application submitted'),
(4, 'Status changed to: yes'),
(4, 'Note added: Excellent product sense and communication skills'),
(5, 'Application submitted'),
(5, 'Status changed to: no'),
(5, 'Note added: Not the right fit for our team'),
(6, 'Application submitted'),
(6, 'Status changed to: yes'),
(6, 'Note added: Great portfolio and design skills'),
(7, 'Application submitted'),
(8, 'Application submitted'),
(8, 'Status changed to: maybe'),
(8, 'Note added: Good technical skills, need to assess cultural fit'),
(9, 'Application submitted'),
(10, 'Application submitted'),
(10, 'Status changed to: yes'),
(10, 'Note added: Excellent marketing experience'),
(11, 'Application submitted')
ON CONFLICT DO NOTHING;

