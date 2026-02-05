-- Create company_announcements table
CREATE TABLE IF NOT EXISTS company_announcements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  announcement_date DATE NOT NULL,
  is_published BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create index for published announcements ordered by date
CREATE INDEX IF NOT EXISTS idx_announcements_published_date 
ON company_announcements(is_published, announcement_date DESC);
