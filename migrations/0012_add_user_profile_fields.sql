-- Migration: Add user profile fields
-- Add location and birthday fields to users table
-- Make name field optional for simplified registration

-- Add location field (prefecture in Japan or country for international users)
ALTER TABLE users ADD COLUMN location TEXT;

-- Add birthday field (optional, for personalization)
ALTER TABLE users ADD COLUMN birthday DATE;

-- Note: SQLite doesn't support ALTER COLUMN, so name field remains NOT NULL
-- But we'll handle optional name in application logic
