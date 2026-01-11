-- Create excluded_tags table for storing tags that should not be auto-generated
CREATE TABLE IF NOT EXISTS excluded_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tag_name TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_excluded_tags_name ON excluded_tags(tag_name);

-- Insert some common words to exclude by default
INSERT OR IGNORE INTO excluded_tags (tag_name) VALUES
  ('ツール'),
  ('戦略'),
  ('活用'),
  ('運用'),
  ('ガイド'),
  ('入門'),
  ('初心者');
