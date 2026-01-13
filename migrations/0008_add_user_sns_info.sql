-- Add user SNS information columns
ALTER TABLE users ADD COLUMN twitter_url TEXT;
ALTER TABLE users ADD COLUMN instagram_url TEXT;
ALTER TABLE users ADD COLUMN youtube_url TEXT;
ALTER TABLE users ADD COLUMN tiktok_url TEXT;
ALTER TABLE users ADD COLUMN threads_url TEXT;
ALTER TABLE users ADD COLUMN note_url TEXT;
ALTER TABLE users ADD COLUMN other_sns_url TEXT;
