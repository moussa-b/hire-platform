-- Update admin user password hash (password: admin123)
-- Run this if you're getting 401 errors with the correct password

UPDATE users 
SET password_hash = '$2b$10$FU5ElwpiaHL17Kc28I2AJeKbBxiMhoXwoWSKU6PBGrNIqtFWNOONS'
WHERE email = 'admin@company.com';

-- Verify the update
SELECT id, email, LENGTH(password_hash) as hash_length 
FROM users 
WHERE email = 'admin@company.com';

