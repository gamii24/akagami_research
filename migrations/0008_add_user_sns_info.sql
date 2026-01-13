-- Add user SNS information columns
ALTER TABLE users ADD COLUMN youtube_url TEXT;
ALTER TABLE users ADD COLUMN instagram_handle TEXT;
ALTER TABLE users ADD COLUMN tiktok_handle TEXT;
ALTER TABLE users ADD COLUMN twitter_handle TEXT;
