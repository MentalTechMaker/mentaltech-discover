-- Add prescriber role and fields to users table

-- Allow 'prescriber' in role CHECK constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('user', 'admin', 'prescriber'));

-- Add prescriber-specific fields
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS profession VARCHAR(255),
    ADD COLUMN IF NOT EXISTS organization VARCHAR(255),
    ADD COLUMN IF NOT EXISTS rpps_adeli VARCHAR(50);
