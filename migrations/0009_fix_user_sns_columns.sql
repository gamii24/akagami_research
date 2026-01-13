-- Fix user SNS columns: remove old columns and add correct ones
-- Note: SQLite doesn't support DROP COLUMN, so we need to check if columns exist

-- Add new columns (will fail silently if they already exist from 0008)
ALTER TABLE users ADD COLUMN youtube_url TEXT;
ALTER TABLE users ADD COLUMN instagram_handle TEXT;
ALTER TABLE users ADD COLUMN tiktok_handle TEXT;
ALTER TABLE users ADD COLUMN twitter_handle TEXT;
