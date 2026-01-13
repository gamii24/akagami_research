-- Add new SNS columns (only the ones that don't exist yet)
-- youtube_url already exists from 0008, so we only add the new handle columns
ALTER TABLE users ADD COLUMN instagram_handle TEXT;
ALTER TABLE users ADD COLUMN tiktok_handle TEXT;
ALTER TABLE users ADD COLUMN twitter_handle TEXT;
